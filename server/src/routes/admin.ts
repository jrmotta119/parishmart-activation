import express, { Request, Response } from 'express';
import { TokenUtils } from '../utils/tokenUtils';
import { EmailService } from '../services/emailService';
import { EmailTemplates } from '../utils/emailTemplates';
import { query, getClient } from '../db/connection';
import { HTTP_STATUS } from '@parishmart/shared';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'fs';
import path from 'path';
import { GraphQLClient } from 'graphql-request';
import { S3Service } from '../services/s3Service';
import { ShopifyProductService } from '../services/shopifyProductService';

const router = express.Router();

// Shopify API config
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'your-shopify-domain.myshopify.com';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2023-04';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'your-access-token';

// Shopify GraphQL endpoint
const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Initialize Shopify GraphQL client
const graphqlClient = new GraphQLClient(SHOPIFY_GRAPHQL_ENDPOINT, {
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  }
});

// Rate limiting for admin actions to prevent abuse
const adminActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 admin actions per windowMs
  message: 'Too many admin actions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all admin routes
router.use(adminActionLimiter);

/**
 * Helper function to render success/error pages
 */
const renderAdminActionPage = (action: 'approved' | 'rejected', userType: 'vendor' | 'administrator', success: boolean = true, error?: string) => {
  const title = success 
    ? `${userType === 'vendor' ? 'Vendor' : 'Store Administrator'} ${action === 'approved' ? 'Approved' : 'Rejected'} Successfully`
    : 'Action Failed';
    
  const message = success
    ? `The ${userType === 'vendor' ? 'vendor' : 'store administrator'} application has been ${action} and the applicant has been notified via email.`
    : `Failed to process the ${action} action: ${error}`;

  const bgColor = success ? (action === 'approved' ? '#d4edda' : '#f8d7da') : '#f8d7da';
  const textColor = success ? (action === 'approved' ? '#155724' : '#721c24') : '#721c24';
  const icon = success ? (action === 'approved' ? '✅' : '❌') : '⚠️';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 50px 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                background-color: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            .status-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .title {
                color: ${textColor};
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            .message {
                color: #666666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .status-box {
                background-color: ${bgColor};
                color: ${textColor};
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .button {
                display: inline-block;
                background-color: #006699;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #005588;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #666666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status-icon">${icon}</div>
            <h1 class="title">${title}</h1>
            <div class="status-box">${message}</div>
            <p class="message">
                ${success 
                  ? 'The action has been completed successfully. You can close this tab or return to your admin panel.'
                  : 'Please try again or contact technical support if the issue persists.'
                }
            </p>
            
            <div class="footer">
                ParishMart Admin Panel<br>
                © ${new Date().getFullYear()} ParishMart. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `;
};



/**
 * Approve vendor using database function with Shopify integration
 */
async function activateVendorApproval(client: any, vendorId: number, userData: any, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  let shopifySuccess = false;
  let shopifyMetaObjectId = null;

  try {
    console.log(`🔄 Approving vendor with ID: ${vendorId}`);

    // Step 1: Create Shopify metaobject for vendor business
    console.log(`📦 Creating Shopify metaobject for vendor business: ${userData.business_name}`);

    // Check if metaobject already exists
    const checkQuery = `
      query CheckSeller($query: String!) {
        metaobjects(type: "seller", first: 10, query: $query) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    let existingCheck;
    try {
      // Generate handle from business name for search
      const searchHandle = (userData.business_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Try to find existing metaobject using display_name (correct Shopify syntax)
      existingCheck = await graphqlClient.request(checkQuery, {
        query: `display_name:"${userData.business_name}"` // Use display_name instead of name
      }) as any;

      console.log(`🔍 Checking for existing seller metaobject with display_name: "${userData.business_name}"`);
      console.log(`📊 Query result:`, JSON.stringify(existingCheck, null, 2));

      // If no results found by display_name, try searching by handle
      if (existingCheck.metaobjects.edges.length === 0) {
        console.log(`🔍 No results found by display_name, trying handle search: "${searchHandle}"`);
        existingCheck = await graphqlClient.request(checkQuery, {
          query: `handle:"${searchHandle}"`
        }) as any;
        console.log(`📊 Handle search result:`, JSON.stringify(existingCheck, null, 2));
      }
    } catch (searchError) {
      console.warn(`⚠️ Search for existing metaobject failed, proceeding with creation:`, searchError);
      existingCheck = { metaobjects: { edges: [] } }; // Assume no existing objects
    }

    // Enable duplicate check now that we have improved search logic
    const forceCreate = false; // Enable duplicate detection with improved search

    if (!forceCreate && existingCheck.metaobjects.edges.length > 0) {
      console.log(`⚠️ Metaobject already exists for vendor business: ${userData.business_name}`);
      console.log(`📋 Existing metaobject details:`, existingCheck.metaobjects.edges[0].node);
      shopifyMetaObjectId = existingCheck.metaobjects.edges[0].node.id;
      shopifySuccess = true;
    } else {
      // Step 1.5: Fetch and upload images to Shopify
      console.log(`📸 Fetching stored images for vendor: ${vendorId}`);

      let profileImageId = null;
      let bannerImageId = null;

      try {
        // Fetch stored media files from database
        const mediaResult = await client.query(`
          SELECT bm.media_url, bm.media_type, bm.bucket_name, bm.media_key, bm.bucket_type, bm.media_order
          FROM businessmedia bm
          JOIN businesses b ON b.business_id = bm.business_id
          WHERE b.vendor_id = $1 AND bm.media_type IN ('logo', 'banner')
          ORDER BY bm.media_type, bm.media_order
        `, [vendorId]);

        console.log(`📁 Found ${mediaResult.rows.length} media files for vendor ${vendorId}`);

        // Process images and upload to Shopify
        if (mediaResult.rows.length > 0) {
          // GraphQL mutation for uploading files to Shopify
          const uploadImageMutation = `
            mutation fileCreate($files: [FileCreateInput!]!) {
              fileCreate(files: $files) {
                files {
                  id
                  fileStatus
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          for (const media of mediaResult.rows) {
            try {
              // Generate S3 access URL
              const s3Url = await S3Service.generateAccessUrl(
                media.media_key,
                media.bucket_type as 'public' | 'private'
              );

              console.log(`📷 Uploading ${media.media_type} to Shopify from S3: ${media.media_key}`);

              // Upload to Shopify
              const uploadResult = await graphqlClient.request(uploadImageMutation, {
                files: [{
                  alt: `${userData.business_name} ${media.media_type}`,
                  contentType: "IMAGE",
                  originalSource: s3Url
                }]
              }) as any;

              // Check for upload errors
              if (uploadResult.fileCreate?.userErrors?.length) {
                console.error(`❌ ${media.media_type} upload failed:`, uploadResult.fileCreate.userErrors);
                continue; // Skip this image but continue with others
              }

              const uploadedFileId = uploadResult.fileCreate?.files?.[0]?.id;
              if (uploadedFileId) {
                if (media.media_type === 'logo') {
                  profileImageId = uploadedFileId;
                  console.log(`✅ Logo uploaded to Shopify: ${uploadedFileId}`);
                } else if (media.media_type === 'banner') {
                  bannerImageId = uploadedFileId;
                  console.log(`✅ Banner uploaded to Shopify: ${uploadedFileId}`);
                }
              }

            } catch (imageError) {
              console.error(`❌ Failed to upload ${media.media_type} to Shopify:`, imageError);
              // Continue with other images even if one fails
            }
          }
        }

      } catch (mediaError) {
        console.error(`❌ Failed to fetch or upload media files:`, mediaError);
        // Continue without images - metaobject can still be created
      }

      // Create metaobject for vendor business
      const mutation = `
        mutation CreateSeller($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
            metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Generate URL for the vendor store page
      const handle = (userData.business_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const baseUrl = "https://parishmart.com";
      const storeUrl = userData.business_type === "estore"
        ? `${baseUrl}/pages/store/${handle}`
        : `${baseUrl}/pages/sellers/${handle}`;

      // Map vendor business data to seller metaobject
      const metaobjectFields = [
        { key: "name", value: userData.business_name || "" },
        { key: "description", value: userData.business_description ? JSON.stringify({
          "type": "root",
          "children": [{
            "type": "paragraph",
            "children": [{"type": "text", "value": userData.business_description}]
          }]
        }) : "" },
        { key: "type", value: userData.business_type === 'estore' ? 'estore' : 'seller' },
        { key: "slogan", value: userData.business_policy || "" },
        { key: "impact", value: userData.community_contribution || "" },
        { key: "location", value: userData.business_city && userData.business_state ?
          `${userData.business_city}, ${userData.business_state}` :
          userData.business_city || userData.business_state || "" },
        { key: "founder_name", value: userData.first_name && userData.last_name ?
          `${userData.first_name} ${userData.last_name}` : "" },
        { key: "founder_detail", value: userData.about_you || `Owner of ${userData.business_name}` },
        { key: "question", value: "Why choose our business?" },
        { key: "answer", value: userData.what_makes_unique || userData.business_description || "We provide quality products and services." },
        { key: "store_type", value: JSON.stringify([userData.business_type === 'product' ? 'Product Based' :
                                                   userData.business_type === 'service' ? 'Service Based' : 'Product & Service Based']) },
        { key: "url", value: storeUrl }
      ];

      // Add image fields if images were uploaded successfully
      if (profileImageId) {
        metaobjectFields.push({ key: "image", value: profileImageId });
        console.log(`📷 Added profile image to metaobject: ${profileImageId}`);
      }

      if (bannerImageId) {
        metaobjectFields.push({ key: "banner_image", value: bannerImageId });
        console.log(`🖼️ Added banner image to metaobject: ${bannerImageId}`);
      }

      const metaobject = {
        type: "seller",
        fields: metaobjectFields
      };

      const result = await graphqlClient.request(mutation, { metaobject }) as any;

      if (result.metaobjectCreate?.userErrors?.length) {
        const errorMessages = result.metaobjectCreate.userErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        console.error('❌ Shopify GraphQL errors for vendor:', result.metaobjectCreate.userErrors);
        throw new Error(`Shopify metaobject creation failed for vendor: ${errorMessages}`);
      }

      if (!result.metaobjectCreate?.metaobject?.id) {
        throw new Error('Shopify metaobject creation returned no ID for vendor');
      }

      shopifyMetaObjectId = result.metaobjectCreate.metaobject.id;
      console.log(`✅ Shopify metaobject created successfully for vendor: ${shopifyMetaObjectId}`);
    }

    shopifySuccess = true;

    // Step 2: After metaobject creation, sync products to Shopify
    const collectionHandle = (userData.business_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log(`📦 Syncing vendor products to Shopify collection: ${collectionHandle}`);
    try {
      const productSyncResult = await ShopifyProductService.syncVendorProducts(
        vendorId,
        userData.business_name,
        collectionHandle,
        client
      );

      console.log(`✅ Product sync completed: ${productSyncResult.successCount} success, ${productSyncResult.errorCount} errors`);

      if (productSyncResult.errors.length > 0) {
        console.warn(`⚠️ Product sync warnings:`, productSyncResult.errors);
      }
    } catch (productSyncError) {
      console.error(`❌ Product sync failed (continuing with approval):`, productSyncError);
      // Don't fail the approval process if product sync fails
    }

    // Step 3: Only after Shopify success, approve vendor in database
    console.log(`📋 Approving vendor in database: ${vendorId}`);
    await client.query(`
      SELECT approve_vendor($1, $2, $3, $4, $5)
    `, [
      vendorId,
      'admin@system', // performed_by
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Vendor approved successfully with Shopify integration: ${vendorId}`);

  } catch (error) {
    console.error(`❌ Failed to approve vendor with Shopify integration:`, error);

    if (shopifySuccess && shopifyMetaObjectId) {
      console.warn(`⚠️ Shopify metaobject created (${shopifyMetaObjectId}) but vendor database approval failed. Manual cleanup may be needed.`);
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Shopify')) {
      throw new Error(`Shopify integration failed for vendor: ${errorMessage}`);
    } else {
      throw new Error(`Vendor database approval failed after Shopify success: ${errorMessage}`);
    }
  }
}

/**
 * Approve administrator using database function (simplified)
 */
async function activateStoreApproval(client: any, adminId: number, userData: any, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  let shopifySuccess = false;
  let shopifyMetaObjectId = null;

  try {
    console.log(`🔄 Approving administrator with ID: ${adminId}`);

    // Step 1: First create the Shopify metaobject to ensure Shopify integration works
    console.log(`📦 Creating Shopify metaobject for: ${userData.organization_name}`);

    // Check if metaobject with same name already exists (duplicate prevention)
    // Note: Store registrations should check for "estore" type metaobjects
    const checkQuery = `
      query CheckEstore($query: String!) {
        metaobjects(type: "estore", first: 10, query: $query) {
          edges {
            node {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    `;

    let existingCheck;
    try {
      // Generate handle from organization name for search
      const searchHandle = (userData.organization_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Try to find existing metaobject using display_name (correct Shopify syntax)
      existingCheck = await graphqlClient.request(checkQuery, {
        query: `display_name:"${userData.organization_name}"` // Use display_name instead of name
      }) as any;

      console.log(`🔍 Checking for existing estore metaobject with display_name: "${userData.organization_name}"`);
      console.log(`📊 Query result:`, JSON.stringify(existingCheck, null, 2));

      // If no results found by display_name, try searching by handle
      if (existingCheck.metaobjects.edges.length === 0) {
        console.log(`🔍 No results found by display_name, trying handle search: "${searchHandle}"`);
        existingCheck = await graphqlClient.request(checkQuery, {
          query: `handle:"${searchHandle}"`
        }) as any;
        console.log(`📊 Handle search result:`, JSON.stringify(existingCheck, null, 2));
      }
    } catch (searchError) {
      console.warn(`⚠️ Search for existing metaobject failed, proceeding with creation:`, searchError);
      existingCheck = { metaobjects: { edges: [] } }; // Assume no existing objects
    }

    // Enable duplicate check now that we have improved search logic
    const forceCreate = false; // Enable duplicate detection with improved search

    if (!forceCreate && existingCheck.metaobjects.edges.length > 0) {
      console.log(`⚠️ Metaobject already exists for: ${userData.organization_name}`);
      console.log(`📋 Existing metaobject details:`, existingCheck.metaobjects.edges[0].node);
      shopifyMetaObjectId = existingCheck.metaobjects.edges[0].node.id;
      shopifySuccess = true;
    } else {
      // Step 1.5: Fetch and upload images to Shopify
      console.log(`📸 Fetching stored images for administrator: ${adminId}`);

      let profileImageId = null;
      let bannerImageId = null;

      try {
        // Fetch stored media files from database
        const mediaResult = await client.query(`
          SELECT sm.media_url, sm.media_type, sm.bucket_name, sm.media_key, sm.bucket_type, sm.media_order
          FROM storemedia sm
          JOIN organizations o ON o.organization_id = sm.organization_id
          JOIN administrators a ON a.organization_id = o.organization_id
          WHERE a.admin_id = $1 AND sm.media_type IN ('logo', 'banner')
          ORDER BY sm.media_type, sm.media_order
        `, [adminId]);

        console.log(`📁 Found ${mediaResult.rows.length} media files for administrator ${adminId}`);

        // Process images and upload to Shopify
        if (mediaResult.rows.length > 0) {
          // GraphQL mutation for uploading files to Shopify
          const uploadImageMutation = `
            mutation fileCreate($files: [FileCreateInput!]!) {
              fileCreate(files: $files) {
                files {
                  id
                  fileStatus
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          for (const media of mediaResult.rows) {
            try {
              // Generate S3 access URL
              const s3Url = await S3Service.generateAccessUrl(
                media.media_key,
                media.bucket_type as 'public' | 'private'
              );

              console.log(`📷 Uploading ${media.media_type} to Shopify from S3: ${media.media_key}`);

              // Upload to Shopify
              const uploadResult = await graphqlClient.request(uploadImageMutation, {
                files: [{
                  alt: `${userData.organization_name} ${media.media_type}`,
                  contentType: "IMAGE",
                  originalSource: s3Url
                }]
              }) as any;

              // Check for upload errors
              if (uploadResult.fileCreate?.userErrors?.length) {
                console.error(`❌ ${media.media_type} upload failed:`, uploadResult.fileCreate.userErrors);
                continue; // Skip this image but continue with others
              }

              const uploadedFileId = uploadResult.fileCreate?.files?.[0]?.id;
              if (uploadedFileId) {
                if (media.media_type === 'logo') {
                  profileImageId = uploadedFileId;
                  console.log(`✅ Logo uploaded to Shopify: ${uploadedFileId}`);
                } else if (media.media_type === 'banner') {
                  bannerImageId = uploadedFileId;
                  console.log(`✅ Banner uploaded to Shopify: ${uploadedFileId}`);
                }
              }

            } catch (imageError) {
              console.error(`❌ Failed to upload ${media.media_type} to Shopify:`, imageError);
              // Continue with other images even if one fails
            }
          }
        }

      } catch (mediaError) {
        console.error(`❌ Failed to fetch or upload media files:`, mediaError);
        // Continue without images - metaobject can still be created
      }

      // Create new metaobject
      const mutation = `
        mutation CreateSeller($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
            metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Generate URL for the store page
      const handle = (userData.organization_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const baseUrl = "https://parishmart.com";
      const storeUrl = `${baseUrl}/pages/store/${handle}`; // Stores always use /pages/store/

      // Create comprehensive metaobject with all available fields
      const metaobjectFields = [
        // Basic information
        { key: "name", value: userData.organization_name || "" },
        { key: "description", value: userData.description ? JSON.stringify({
          "type": "root",
          "children": [{
            "type": "paragraph",
            "children": [{"type": "text", "value": userData.description}]
          }]
        }) : "" },
        { key: "type", value: "estore" }, // Store registrations are always estore type
        { key: "slogan", value: userData.slogan || "" },
        { key: "founded", value: userData.since_year ? userData.since_year.toString() : "" },
        { key: "impact", value: userData.impact || "" },

        // Location information (from administrator data)
        { key: "location", value: userData.city && userData.state ? `${userData.city}, ${userData.state}` : userData.city || userData.state || "" },

        // Founder/Admin information
        { key: "founder_name", value: userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : "" },
        { key: "founder_detail", value: `Administrator of ${userData.organization_name || 'the organization'}` },

        // Additional information
        { key: "question", value: "Why choose us?" },
        { key: "answer", value: userData.impact || userData.description || "We are committed to serving our community with excellence." },

        // Store type - map organization type to store type
        { key: "store_type", value: JSON.stringify([userData.organization_type === "estore" ? "Online" : "Online & Offline"]) },
        { key: "url", value: storeUrl }
      ];

      // Add image fields if images were uploaded successfully
      if (profileImageId) {
        metaobjectFields.push({ key: "image", value: profileImageId });
        console.log(`📷 Added profile image to metaobject: ${profileImageId}`);
      }

      if (bannerImageId) {
        metaobjectFields.push({ key: "banner_image", value: bannerImageId });
        console.log(`🖼️ Added banner image to metaobject: ${bannerImageId}`);
      }

      const metaobject = {
        type: "seller",
        fields: metaobjectFields
      };

      // Run mutation on Shopify
      const result = await graphqlClient.request(mutation, { metaobject }) as any;

      if (result.metaobjectCreate?.userErrors?.length) {
        const errorMessages = result.metaobjectCreate.userErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
        console.error('❌ Shopify GraphQL errors:', result.metaobjectCreate.userErrors);
        throw new Error(`Shopify metaobject creation failed: ${errorMessages}`);
      }

      if (!result.metaobjectCreate?.metaobject?.id) {
        throw new Error('Shopify metaobject creation returned no ID');
      }

      shopifyMetaObjectId = result.metaobjectCreate.metaobject.id;
      console.log(`✅ Shopify metaobject created successfully: ${shopifyMetaObjectId}`);
    }

    shopifySuccess = true;

    // Step 2: After metaobject creation, sync products to Shopify
    const storeCollectionHandle = (userData.organization_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log(`📦 Syncing store products to Shopify collection: ${storeCollectionHandle}`);
    try {
      // Get organization_id from userData for store products
      const orgResult = await client.query(`
        SELECT organization_id FROM administrators WHERE admin_id = $1
      `, [adminId]);

      if (orgResult.rows.length > 0) {
        const organizationId = orgResult.rows[0].organization_id;

        const productSyncResult = await ShopifyProductService.syncStoreProducts(
          organizationId,
          userData.organization_name,
          storeCollectionHandle,
          client
        );

        console.log(`✅ Store product sync completed: ${productSyncResult.successCount} success, ${productSyncResult.errorCount} errors`);

        if (productSyncResult.errors.length > 0) {
          console.warn(`⚠️ Store product sync warnings:`, productSyncResult.errors);
        }
      } else {
        console.warn(`⚠️ Could not find organization for admin ${adminId}, skipping product sync`);
      }
    } catch (productSyncError) {
      console.error(`❌ Store product sync failed (continuing with approval):`, productSyncError);
      // Don't fail the approval process if product sync fails
    }

    // Step 3: Only after Shopify success, approve in database
    console.log(`📋 Approving administrator in database: ${adminId}`);
    await client.query(`
      SELECT approve_admin($1, $2, $3, $4, $5)
    `, [
      adminId,
      'admin@system', // performed_by
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Administrator approved successfully with Shopify integration: ${adminId}`);

  } catch (error) {
    console.error(`❌ Failed to approve administrator with Shopify integration:`, error);

    // Rollback strategy:
    // If Shopify creation succeeded but database approval failed,
    // we could delete the Shopify metaobject, but this might be risky
    // Better to leave it and handle manually or retry later

    if (shopifySuccess && shopifyMetaObjectId) {
      console.warn(`⚠️ Shopify metaobject created (${shopifyMetaObjectId}) but database approval failed. Manual cleanup may be needed.`);
      // TODO: Implement Shopify cleanup or add to a retry queue
    }

    // Add more context to error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Shopify')) {
      throw new Error(`Shopify integration failed: ${errorMessage}`);
    } else {
      throw new Error(`Database approval failed after Shopify success: ${errorMessage}`);
    }
  }
}

/**
 * Reject vendor using database function (simplified)
 */
async function rejectVendorApplication(client: any, vendorId: number, reason?: string, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Rejecting vendor with ID: ${vendorId}`);

    // Use the database function to reject vendor
    await client.query(`
      SELECT reject_vendor($1, $2, $3, $4, $5, $6)
    `, [
      vendorId,
      reason || null,
      'admin@system', // performed_by
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Vendor rejected successfully with ID: ${vendorId}`);

  } catch (error) {
    console.error(`❌ Failed to reject vendor:`, error);
    throw error;
  }
}

/**
 * Reject administrator using database function (simplified)
 */
async function rejectStoreApplication(client: any, adminId: number, reason?: string, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Rejecting administrator with ID: ${adminId}`);

    // Use the database function to reject administrator only
    // Parameter order: admin_id, performed_by, reason, token_used, ip_address, user_agent
    await client.query(`
      SELECT reject_admin($1, $2, $3, $4, $5, $6)
    `, [
      adminId,
      'admin@system', // performed_by
      reason || null,
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Administrator rejected successfully with ID: ${adminId}`);

  } catch (error) {
    console.error(`❌ Failed to reject administrator:`, error);
    throw error;
  }
}

/**
 * GET /api/admin/approve/:token
 * Handle vendor/store approval
 */
router.get('/approve/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  
  try {
    console.log(`🔍 Processing approval request with token: ${token.substring(0, 8)}...`);
    
    // Validate token
    const validation = await TokenUtils.validateToken(token);
    if (!validation.isValid || !validation.user_type || !validation.user_id || !validation.action_type) {
      console.error(`❌ Invalid token for approval`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('approved', validation.user_type || 'vendor', false, 'Invalid or expired token')
      );
    }

    const { user_type, user_id, action_type } = validation;
    
    // Verify this is an approval token
    if (action_type !== 'approve') {
      console.error(`❌ Token is not an approval token: ${action_type}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('approved', user_type, false, 'Invalid token type')
      );
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get user data before updating status
      const userData = await TokenUtils.getUserByToken(token);
      if (!userData || !userData.userData) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.NOT_FOUND).send(
          renderAdminActionPage('approved', user_type, false, 'User not found')
        );
      }

      const oldStatus = userData.userData.approval_status || 'pending';

      // Activate features based on user type
      if (user_type === 'vendor') {
        await activateVendorApproval(client, user_id, userData.userData, token, req.ip, req.get('User-Agent'));
      } else {
        // For administrator, we approve the administrator
        await activateStoreApproval(client, user_id, userData.userData, token, req.ip, req.get('User-Agent'));
      }

      // Mark token as used
      const tokenMarked = await TokenUtils.markTokenAsUsed(token);
      if (!tokenMarked) {
        console.warn(`⚠️  Failed to mark token as used: ${token}`);
      }

      await client.query('COMMIT');
      
      // Send approval email to user
      try {
        let emailHtml: string;
        
        if (user_type === 'vendor') {
          emailHtml = EmailTemplates.renderVendorApproved({
            firstName: userData.userData.first_name,
            lastName: userData.userData.last_name,
            businessName: userData.userData.business_name,
            email: userData.userData.email,
            subscriptionType: userData.userData.current_subscription_type,
            phone: userData.userData.phone
          });
        } else {
          emailHtml = EmailTemplates.renderStoreApproved({
            adminFirstName: userData.userData.first_name,
            adminLastName: userData.userData.last_name,
            organizationName: userData.userData.organization_name,
            email: userData.userData.email,
            subscriptionTier: userData.userData.current_subscription_type,
            organizationType: userData.userData.organization_type
          });
        }

        await EmailService.sendEmail(
          userData.userData.email,
          `Welcome to ParishMart - Your ${user_type === 'vendor' ? 'Account' : 'Store'} is Approved!`,
          emailHtml
        );

        console.log(`✅ Approval email sent to ${userData.userData.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send approval email:`, emailError);
        // Don't fail the approval process if email fails
      }

      console.log(`✅ ${user_type} approved successfully with full feature activation: ${user_id}`);
      
      res.send(renderAdminActionPage('approved', user_type, true));
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(`❌ Approval process failed:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(
      renderAdminActionPage('approved', 'vendor', false, 'Internal server error')
    );
  }
});

/**
 * GET /api/admin/reject/:token
 * Handle vendor/store rejection
 */
router.get('/reject/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  
  try {
    console.log(`🔍 Processing rejection request with token: ${token.substring(0, 8)}...`);
    
    // Validate token
    const validation = await TokenUtils.validateToken(token);
    if (!validation.isValid || !validation.user_type || !validation.user_id || !validation.action_type) {
      console.error(`❌ Invalid token for rejection`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('rejected', validation.user_type || 'vendor', false, 'Invalid or expired token')
      );
    }

    const { user_type, user_id, action_type } = validation;
    
    // Verify this is a rejection token
    if (action_type !== 'reject') {
      console.error(`❌ Token is not a rejection token: ${action_type}`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('rejected', user_type, false, 'Invalid token type')
      );
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get user data before updating status
      const userData = await TokenUtils.getUserByToken(token);
      if (!userData || !userData.userData) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.NOT_FOUND).send(
          renderAdminActionPage('rejected', user_type, false, 'User not found')
        );
      }

      const oldStatus = userData.userData.approval_status || 'pending';

      // Update rejection status in database
      if (user_type === 'vendor') {
        await rejectVendorApplication(client, user_id, userData.userData.rejection_reason, token, req.ip, req.get('User-Agent'));
      } else {
        await rejectStoreApplication(client, user_id, userData.userData.rejection_reason, token, req.ip, req.get('User-Agent'));
      }

      // Mark token as used
      const tokenMarked = await TokenUtils.markTokenAsUsed(token);
      if (!tokenMarked) {
        console.warn(`⚠️  Failed to mark token as used: ${token}`);
      }

      await client.query('COMMIT');
      
      // Send rejection email to user
      try {
        let emailHtml: string;
        
        if (user_type === 'vendor') {
          emailHtml = EmailTemplates.renderVendorRejected({
            firstName: userData.userData.first_name,
            lastName: userData.userData.last_name,
            businessName: userData.userData.business_name,
            email: userData.userData.email,
            subscriptionType: userData.userData.current_subscription_type,
            phone: userData.userData.phone
          });
        } else {
          emailHtml = EmailTemplates.renderStoreRejected({
            adminFirstName: userData.userData.first_name,
            adminLastName: userData.userData.last_name,
            organizationName: userData.userData.organization_name,
            email: userData.userData.email,
            subscriptionTier: userData.userData.current_subscription_type,
            organizationType: userData.userData.organization_type
          });
        }

        await EmailService.sendEmail(
          userData.userData.email,
          `ParishMart Application Update`,
          emailHtml
        );

        console.log(`✅ Rejection email sent to ${userData.userData.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send rejection email:`, emailError);
        // Don't fail the rejection process if email fails
      }

      console.log(`✅ ${user_type} rejected successfully: ${user_id}`);
      
      res.send(renderAdminActionPage('rejected', user_type, true));
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error(`❌ Rejection process failed:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(
      renderAdminActionPage('rejected', 'vendor', false, 'Internal server error')
    );
  }
});

/**
 * GET /api/admin/tokens/stats
 * Get token statistics for monitoring (admin only)
 */
router.get('/tokens/stats', async (req: Request, res: Response) => {
  try {
    const stats = await TokenUtils.getTokenStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Failed to get token stats:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to retrieve token statistics'
    });
  }
});

/**
 * POST /api/admin/tokens/cleanup
 * Manually trigger token cleanup (admin only)
 */
router.post('/tokens/cleanup', async (req: Request, res: Response) => {
  try {
    const deletedCount = await TokenUtils.cleanupExpiredTokens();
    
    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} expired tokens`,
      deletedCount
    });
  } catch (error) {
    console.error('❌ Failed to cleanup tokens:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to cleanup tokens'
    });
  }
});

/**
 * GET /api/admin/health
 * Admin system health check
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const emailHealth = await EmailService.getHealthStatus();
    const tokenStats = await TokenUtils.getTokenStats();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      services: {
        email: emailHealth,
        tokens: {
          status: 'healthy',
          ...tokenStats
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin health check failed:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

/**
 * GET /api/admin/approval-stats
 * Get approval statistics for dashboard
 */
router.get('/approval-stats', async (req: Request, res: Response) => {
  try {
    const vendorStats = await query('SELECT * FROM get_vendor_approval_stats()');
    const orgStats = await query('SELECT * FROM get_organization_approval_stats()');
    
    res.json({
      success: true,
      data: {
        vendors: vendorStats.rows[0],
        organizations: orgStats.rows[0],
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Failed to get approval stats:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to retrieve approval statistics'
    });
  }
});

/**
 * GET /api/admin/test-shopify
 * Test Shopify connection and credentials
 */
router.get('/test-shopify', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testing Shopify connection...');

    // Simple query to test connection - get shop info
    const testQuery = `
      query {
        shop {
          id
          name
          myshopifyDomain
        }
      }
    `;

    const result = await graphqlClient.request(testQuery) as any;

    console.log('✅ Shopify connection successful:', result.shop);

    res.json({
      success: true,
      message: 'Shopify connection successful',
      data: {
        shopId: result.shop.id,
        shopName: result.shop.name,
        domain: result.shop.myshopifyDomain,
        apiVersion: SHOPIFY_API_VERSION
      }
    });

  } catch (error) {
    console.error('❌ Shopify connection test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Shopify connection failed',
      details: errorMessage
    });
  }
});

/**
 * POST /api/admin/test-metaobject
 * Test creating a Shopify metaobject with dummy data
 */
router.post('/test-metaobject', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testing Shopify metaobject creation with dummy data...');

    // Create dummy seller data
    const dummyData = {
      name: "Test Organization",
      description: "This is a test organization created to verify Shopify integration is working properly.",
      type: "seller", // Valid types: seller, estore
      slogan: "Testing for a better world",
      founded: "2020",
      impact: "Helping developers test integrations since 2020",
      location: "Test City, TX",
      founder_name: "Test Founder"
    };

    // Generate handle (Shopify will create this automatically, but we can predict it)
    const predictedHandle = dummyData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Generate URL based on type
    const baseUrl = "https://parishmart.com";
    const url = dummyData.type === "seller"
      ? `${baseUrl}/pages/sellers/${predictedHandle}`
      : `${baseUrl}/pages/store/${predictedHandle}`;

    // Convert description to Shopify rich text format
    const richTextDescription = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: dummyData.description
            }
          ]
        }
      ]
    };

    const mutation = `
      mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            handle
            displayName
            fields {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metaobject: {
        type: "seller",
        fields: [
          { key: "name", value: dummyData.name },
          { key: "description", value: JSON.stringify(richTextDescription) },
          { key: "type", value: dummyData.type },
          { key: "slogan", value: dummyData.slogan },
          { key: "founded", value: dummyData.founded },
          { key: "impact", value: dummyData.impact },
          { key: "location", value: dummyData.location },
          { key: "founder_name", value: dummyData.founder_name },
          { key: "url", value: url }
          // TODO: Add image fields when we implement image upload functionality
          // { key: "image", value: imageFileId },
          // { key: "banner_image", value: bannerImageFileId },
          // { key: "banner_image_mobile", value: mobilebannerImageFileId }
        ]
      }
    };

    const result = await graphqlClient.request(mutation, variables) as any;

    console.log('📋 Shopify metaobject creation result:', JSON.stringify(result, null, 2));

    // Check for errors
    if (result.metaobjectCreate?.userErrors?.length) {
      const errorMessages = result.metaobjectCreate.userErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      console.error('❌ Shopify GraphQL errors:', result.metaobjectCreate.userErrors);
      throw new Error(`Shopify metaobject creation failed: ${errorMessages}`);
    }

    if (!result.metaobjectCreate?.metaobject?.id) {
      throw new Error('Shopify metaobject creation returned no ID');
    }

    const metaobjectId = result.metaobjectCreate.metaobject.id;
    const handle = result.metaobjectCreate.metaobject.handle;

    console.log(`✅ Test metaobject created successfully: ${metaobjectId}`);

    res.json({
      success: true,
      message: 'Test metaobject created successfully',
      data: {
        id: metaobjectId,
        handle: handle,
        displayName: result.metaobjectCreate.metaobject.displayName,
        fields: result.metaobjectCreate.metaobject.fields,
        dummyData: dummyData
      }
    });

  } catch (error) {
    console.error('❌ Shopify metaobject test creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Shopify metaobject creation failed',
      details: errorMessage
    });
  }
});

/**
 * GET /api/admin/test-product-permissions
 * Test Shopify permissions for products and collections
 */
router.get('/test-product-permissions', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testing Shopify product and collection permissions...');

    // Test 1: Check if we can query products
    const productsQuery = `
      query {
        products(first: 1) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    let canReadProducts = false;
    try {
      const productsResult = await graphqlClient.request(productsQuery) as any;
      canReadProducts = true;
      console.log('✅ Can read products:', productsResult.products.edges.length);
    } catch (error) {
      console.log('❌ Cannot read products:', error);
    }

    // Test 2: Check if we can query collections
    const collectionsQuery = `
      query {
        collections(first: 1) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    let canReadCollections = false;
    try {
      const collectionsResult = await graphqlClient.request(collectionsQuery) as any;
      canReadCollections = true;
      console.log('✅ Can read collections:', collectionsResult.collections.edges.length);
    } catch (error) {
      console.log('❌ Cannot read collections:', error);
    }

    // Test 3: Try to create a test product (will fail gracefully if no permissions)
    const createProductMutation = `
      mutation productCreate($product: ProductInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    let canCreateProducts = false;
    let testProductId = null;
    try {
      const productResult = await graphqlClient.request(createProductMutation, {
        product: {
          title: "Test Product - Permission Check",
          productType: "Test",
          vendor: "ParishMart",
          status: "DRAFT"
        }
      }) as any;

      if (productResult.productCreate?.userErrors?.length === 0 && productResult.productCreate?.product?.id) {
        canCreateProducts = true;
        testProductId = productResult.productCreate.product.id;
        console.log('✅ Can create products:', testProductId);
      } else {
        console.log('❌ Cannot create products:', productResult.productCreate?.userErrors);
      }
    } catch (error) {
      console.log('❌ Cannot create products:', error);
    }

    // Test 4: Try to create a test collection
    const createCollectionMutation = `
      mutation collectionCreate($collection: CollectionInput!) {
        collectionCreate(collection: $collection) {
          collection {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    let canCreateCollections = false;
    let testCollectionId = null;
    try {
      const collectionResult = await graphqlClient.request(createCollectionMutation, {
        collection: {
          title: "Test Collection - Permission Check",
          handle: "test-collection-permission-check"
        }
      }) as any;

      if (collectionResult.collectionCreate?.userErrors?.length === 0 && collectionResult.collectionCreate?.collection?.id) {
        canCreateCollections = true;
        testCollectionId = collectionResult.collectionCreate.collection.id;
        console.log('✅ Can create collections:', testCollectionId);
      } else {
        console.log('❌ Cannot create collections:', collectionResult.collectionCreate?.userErrors);
      }
    } catch (error) {
      console.log('❌ Cannot create collections:', error);
    }

    // Clean up test entities if created
    if (testProductId) {
      try {
        const deleteProductMutation = `
          mutation productDelete($input: ProductDeleteInput!) {
            productDelete(input: $input) {
              deletedProductId
              userErrors {
                field
                message
              }
            }
          }
        `;
        await graphqlClient.request(deleteProductMutation, {
          input: { id: testProductId }
        });
        console.log('🧹 Cleaned up test product');
      } catch (cleanupError) {
        console.log('⚠️ Could not clean up test product:', cleanupError);
      }
    }

    if (testCollectionId) {
      try {
        const deleteCollectionMutation = `
          mutation collectionDelete($input: CollectionDeleteInput!) {
            collectionDelete(input: $input) {
              deletedCollectionId
              userErrors {
                field
                message
              }
            }
          }
        `;
        await graphqlClient.request(deleteCollectionMutation, {
          input: { id: testCollectionId }
        });
        console.log('🧹 Cleaned up test collection');
      } catch (cleanupError) {
        console.log('⚠️ Could not clean up test collection:', cleanupError);
      }
    }

    const permissions = {
      canReadProducts,
      canReadCollections,
      canCreateProducts,
      canCreateCollections
    };

    const missingPermissions = [];
    if (!canReadProducts) missingPermissions.push('read_products');
    if (!canReadCollections) missingPermissions.push('read_collections');
    if (!canCreateProducts) missingPermissions.push('write_products');
    if (!canCreateCollections) missingPermissions.push('write_collections');

    const isReady = canReadProducts && canReadCollections && canCreateProducts && canCreateCollections;

    res.json({
      success: true,
      message: 'Shopify product/collection permission test completed',
      data: {
        permissions,
        isReady,
        missingPermissions,
        recommendation: isReady
          ? 'All permissions available - ready for product integration!'
          : `Missing permissions: ${missingPermissions.join(', ')}. Please update your Shopify app permissions.`
      }
    });

  } catch (error) {
    console.error('❌ Shopify permission test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Shopify permission test failed',
      details: errorMessage
    });
  }
});

/**
 * POST /api/admin/test-metaobject-with-images
 * Test creating a Shopify metaobject with images
 * This endpoint tests uploading images to Shopify and referencing them in metaobjects
 */
router.post('/test-metaobject-with-images', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testing Shopify metaobject creation with images...');

    // Step 1: Upload test images to Shopify
    // For testing, we'll use a simple approach - upload a placeholder image URL
    const testImageUrl = "https://via.placeholder.com/400x300/007bff/ffffff?text=Test+Profile+Image";
    const testBannerUrl = "https://via.placeholder.com/800x200/28a745/ffffff?text=Test+Banner";
    const testMobileBannerUrl = "https://via.placeholder.com/600x150/dc3545/ffffff?text=Mobile+Banner";

    // Upload images to Shopify Files
    const uploadImageMutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id
            fileStatus
            preview {
              image {
                id
                url
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    console.log('📸 Uploading test images to Shopify...');

    // Upload profile image
    const profileImageResult = await graphqlClient.request(uploadImageMutation, {
      files: [{
        alt: "Test Profile Image",
        contentType: "IMAGE",
        originalSource: testImageUrl
      }]
    }) as any;

    // Upload banner image
    const bannerImageResult = await graphqlClient.request(uploadImageMutation, {
      files: [{
        alt: "Test Banner Image",
        contentType: "IMAGE",
        originalSource: testBannerUrl
      }]
    }) as any;

    // Upload mobile banner image
    const mobileBannerResult = await graphqlClient.request(uploadImageMutation, {
      files: [{
        alt: "Test Mobile Banner Image",
        contentType: "IMAGE",
        originalSource: testMobileBannerUrl
      }]
    }) as any;

    // Check for upload errors
    if (profileImageResult.fileCreate?.userErrors?.length) {
      throw new Error(`Profile image upload failed: ${profileImageResult.fileCreate.userErrors.map((e: any) => e.message).join(', ')}`);
    }

    if (bannerImageResult.fileCreate?.userErrors?.length) {
      throw new Error(`Banner image upload failed: ${bannerImageResult.fileCreate.userErrors.map((e: any) => e.message).join(', ')}`);
    }

    if (mobileBannerResult.fileCreate?.userErrors?.length) {
      throw new Error(`Mobile banner upload failed: ${mobileBannerResult.fileCreate.userErrors.map((e: any) => e.message).join(', ')}`);
    }

    // Get the file IDs
    const profileImageId = profileImageResult.fileCreate?.files?.[0]?.id;
    const bannerImageId = bannerImageResult.fileCreate?.files?.[0]?.id;
    const mobileBannerImageId = mobileBannerResult.fileCreate?.files?.[0]?.id;

    if (!profileImageId || !bannerImageId || !mobileBannerImageId) {
      throw new Error('Failed to get image IDs from upload response');
    }

    console.log(`✅ Images uploaded successfully:
      Profile: ${profileImageId}
      Banner: ${bannerImageId}
      Mobile Banner: ${mobileBannerImageId}`);

    // Step 2: Create metaobject with uploaded images
    const dummyData = {
      name: "Test Organization With Images",
      description: "This is a test organization with images to verify full Shopify integration.",
      type: "seller",
      slogan: "Testing images for a better world",
      founded: "2020",
      impact: "Helping developers test image integration since 2020",
      location: "Test City, TX",
      founder_name: "Test Founder with Images"
    };

    // Generate handle and URL
    const expectedHandle = dummyData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const baseUrl = "https://parishmart.com";
    const url = dummyData.type === "seller"
      ? `${baseUrl}/pages/sellers/${expectedHandle}`
      : `${baseUrl}/pages/store/${expectedHandle}`;

    // Rich text description
    const richTextDescription = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: dummyData.description
            }
          ]
        }
      ]
    };

    const metaobjectMutation = `
      mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            handle
            displayName
            fields {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metaobject: {
        type: "seller",
        fields: [
          { key: "name", value: dummyData.name },
          { key: "description", value: JSON.stringify(richTextDescription) },
          { key: "type", value: dummyData.type },
          { key: "slogan", value: dummyData.slogan },
          { key: "founded", value: dummyData.founded },
          { key: "impact", value: dummyData.impact },
          { key: "location", value: dummyData.location },
          { key: "founder_name", value: dummyData.founder_name },
          { key: "url", value: url },
          { key: "image", value: profileImageId },
          { key: "banner_image", value: bannerImageId },
          { key: "banner_image_mobile", value: mobileBannerImageId }
        ]
      }
    };

    const result = await graphqlClient.request(metaobjectMutation, variables) as any;

    console.log('📋 Shopify metaobject with images creation result:', JSON.stringify(result, null, 2));

    // Check for errors
    if (result.metaobjectCreate?.userErrors?.length) {
      const errorMessages = result.metaobjectCreate.userErrors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      console.error('❌ Shopify GraphQL errors:', result.metaobjectCreate.userErrors);
      throw new Error(`Shopify metaobject creation failed: ${errorMessages}`);
    }

    if (!result.metaobjectCreate?.metaobject?.id) {
      throw new Error('Shopify metaobject creation returned no ID');
    }

    const metaobjectId = result.metaobjectCreate.metaobject.id;
    const finalHandle = result.metaobjectCreate.metaobject.handle;

    console.log(`✅ Test metaobject with images created successfully: ${metaobjectId}`);

    res.json({
      success: true,
      message: 'Test metaobject with images created successfully',
      data: {
        id: metaobjectId,
        handle: finalHandle,
        displayName: result.metaobjectCreate.metaobject.displayName,
        fields: result.metaobjectCreate.metaobject.fields,
        uploadedImages: {
          profileImage: {
            id: profileImageId,
            url: testImageUrl
          },
          bannerImage: {
            id: bannerImageId,
            url: testBannerUrl
          },
          mobileBannerImage: {
            id: mobileBannerImageId,
            url: testMobileBannerUrl
          }
        },
        dummyData: dummyData,
        generatedUrl: url
      }
    });

  } catch (error) {
    console.error('❌ Shopify metaobject with images test creation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Shopify metaobject with images creation failed',
      details: errorMessage
    });
  }
});

/**
 * POST /api/admin/test-product-sync/:vendorId
 * Test syncing vendor products to Shopify
 */
router.post('/test-product-sync/:vendorId', async (req: Request, res: Response) => {
  try {
    const vendorId = parseInt(req.params.vendorId);
    if (isNaN(vendorId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid vendor ID'
      });
    }

    console.log(`🧪 Testing product sync for vendor: ${vendorId}`);

    const client = await getClient();
    try {
      // Get vendor business information
      const vendorResult = await client.query(`
        SELECT
          v.vendor_id,
          v.first_name,
          v.last_name,
          b.business_name,
          b.business_id
        FROM vendors v
        JOIN businesses b ON b.vendor_id = v.vendor_id
        WHERE v.vendor_id = $1 AND v.approval_status = 'approved'
      `, [vendorId]);

      if (vendorResult.rows.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'Approved vendor not found'
        });
      }

      const vendorData = vendorResult.rows[0];
      const businessName = vendorData.business_name;
      const collectionHandle = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Sync products
      const syncResult = await ShopifyProductService.syncVendorProducts(
        vendorId,
        businessName,
        collectionHandle,
        client
      );

      res.json({
        success: true,
        message: `Product sync completed for vendor ${businessName}`,
        data: {
          vendorId,
          businessName,
          collectionHandle,
          ...syncResult
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Product sync test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Product sync test failed',
      details: errorMessage
    });
  }
});

/**
 * POST /api/admin/test-store-product-sync/:adminId
 * Test syncing store products to Shopify
 */
router.post('/test-store-product-sync/:adminId', async (req: Request, res: Response) => {
  try {
    const adminId = parseInt(req.params.adminId);
    if (isNaN(adminId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid admin ID'
      });
    }

    console.log(`🧪 Testing store product sync for admin: ${adminId}`);

    const client = await getClient();
    try {
      // Get admin and organization information
      const adminResult = await client.query(`
        SELECT
          a.admin_id,
          a.first_name,
          a.last_name,
          a.organization_id,
          o.name as organization_name
        FROM administrators a
        JOIN organizations o ON o.organization_id = a.organization_id
        WHERE a.admin_id = $1 AND a.approval_status = 'approved'
      `, [adminId]);

      if (adminResult.rows.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'Approved admin not found'
        });
      }

      const adminData = adminResult.rows[0];
      const organizationName = adminData.organization_name;
      const organizationId = adminData.organization_id;
      const collectionHandle = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Sync products
      const syncResult = await ShopifyProductService.syncStoreProducts(
        organizationId,
        organizationName,
        collectionHandle,
        client
      );

      res.json({
        success: true,
        message: `Store product sync completed for ${organizationName}`,
        data: {
          adminId,
          organizationId,
          organizationName,
          collectionHandle,
          ...syncResult
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Store product sync test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Store product sync test failed',
      details: errorMessage
    });
  }
});

/**
 * GET /api/admin/products/vendor/:vendorId
 * Get all products for a vendor from database
 */
router.get('/products/vendor/:vendorId', async (req: Request, res: Response) => {
  try {
    const vendorId = parseInt(req.params.vendorId);
    if (isNaN(vendorId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid vendor ID'
      });
    }

    const client = await getClient();
    try {
      const result = await client.query(`
        SELECT
          bp.product_id,
          bp.name,
          bp.category,
          bp.description,
          bp.promotional_hook,
          bp.pricing_info,
          bp.created_at,
          b.business_name,
          COUNT(bpm.media_id) as media_count
        FROM businessproducts bp
        JOIN businesses b ON b.business_id = bp.business_id
        LEFT JOIN businessproductmedia bpm ON bpm.product_id = bp.product_id
        WHERE b.vendor_id = $1
        GROUP BY bp.product_id, bp.name, bp.category, bp.description, bp.promotional_hook, bp.pricing_info, bp.created_at, b.business_name
        ORDER BY bp.created_at
      `, [vendorId]);

      res.json({
        success: true,
        message: 'Vendor products retrieved successfully',
        data: {
          vendorId,
          products: result.rows
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Failed to get vendor products:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to retrieve vendor products'
    });
  }
});

/**
 * GET /api/admin/products/store/:organizationId
 * Get all products for a store from database
 */
router.get('/products/store/:organizationId', async (req: Request, res: Response) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    if (isNaN(organizationId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid organization ID'
      });
    }

    const client = await getClient();
    try {
      const result = await client.query(`
        SELECT
          sp.product_id,
          sp.name,
          sp.category,
          sp.description,
          sp.promotional_hook,
          sp.pricing_info,
          sp.created_at,
          o.name as organization_name,
          COUNT(spm.media_id) as media_count
        FROM storeproducts sp
        JOIN organizations o ON o.organization_id = sp.organization_id
        LEFT JOIN storeproductmedia spm ON spm.product_id = sp.product_id
        WHERE sp.organization_id = $1
        GROUP BY sp.product_id, sp.name, sp.category, sp.description, sp.promotional_hook, sp.pricing_info, sp.created_at, o.name
        ORDER BY sp.created_at
      `, [organizationId]);

      res.json({
        success: true,
        message: 'Store products retrieved successfully',
        data: {
          organizationId,
          products: result.rows
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Failed to get store products:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to retrieve store products'
    });
  }
});

export default router;
