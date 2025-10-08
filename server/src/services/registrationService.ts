import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query, getClient } from '../db/connection';
import S3Service from './s3Service';
import { EmailRegistrationService } from './emailRegistrationService';


interface VendorFormData {
  // Personal Information (split from fullName)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parishAffiliation?: string;
  ownerDescription?: string;
  businessUnique?: string;
  communityEfforts?: string;
  // Business Information
  businessName: string;
  businessType: 'product' | 'service' | 'both';
  businessDescription: string;
  businessPolicy?: string;
  businessAddress: string;
  businessCity: string;
  businessState?: string;
  businessCountry?: string;
  businessLocation?: {
    country: string;
    subdivision: string;
  } | string;
  businessZipCode: string;
  websiteLinks?: string;
  subscriptionType: 'basic' | 'premium' | 'elite';
  contactEmail: string;
  contactPhone: string;
  products?: any[];
  participateInCampaigns: boolean;
  reach: string;
  contactForOpportunities?: boolean;
}

interface StoreFormData {
  // Administrator Information (split from adminFullName)
  adminFirstName: string;
  adminLastName: string;
  email: string;
  streetAddress: string;
  city: string;
  state?: string;
  country?: string;
  location?: {
    country: string;
    subdivision: string;
  } | string;
  zipCode: string;
  phoneNumber?: string;
  // Organization Information
  organizationName: string;
  organizationType: string;
  description: string;
  impact: string;
  foundingYear: string;
  slogan?: string;
  primaryColor?: string;
  secondaryColor?: string;
  subscriptionTier: 'basic' | 'premium' | 'elite';
  needsConsultation?: boolean;
  collectsDonations?: boolean;
  donationPlatform?: string;
  otherDonationPlatform?: string;
  otherOrganizationType?: string;
  hasTaxExemptStatus?: string;
  products?: any[];
}

export class RegistrationService {
  /**
   * Process vendor registration
   */
  static async processVendorRegistration(
    formData: VendorFormData,
    files: { [fieldname: string]: Express.Multer.File[] }
  ) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // 1. Generate secure password
      const tempPassword = crypto.randomBytes(12).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // 2. Upload logo to S3 (public bucket)
      let logoResult = null;
      if (files.logo && files.logo[0]) {
        logoResult = await S3Service.uploadFile(files.logo[0], 'media');
      }
      
      // 3. Upload business images to S3 (public bucket)
      const businessImageResults = [];
      if (files.businessImages) {
        for (const image of files.businessImages) {
          const result = await S3Service.uploadFile(image, 'media');
          businessImageResults.push(result);
        }
      }
      
      // 4. Create vendor record (names already split in frontend)
      const vendorResult = await client.query(`
        INSERT INTO vendors (
          email, phone, password_hash, first_name, last_name,
          mission_affiliation, about_you, community_contribution, participate_in_campaigns,
          contact_for_opportunities, approval_status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', NOW(), NOW())
        RETURNING vendor_id
      `, [
        formData.email,
        formData.phone,
        hashedPassword,
        formData.firstName,
        formData.lastName,
        formData.parishAffiliation || null,
        formData.ownerDescription || null,
        formData.communityEfforts || null,
        formData.participateInCampaigns,
        
        formData.contactForOpportunities || null
      ]);
      
      const vendorId = vendorResult.rows[0].vendor_id;
      
      // 5. Create business record
      // Parse businessLocation if it's a JSON string
      if (typeof formData.businessLocation === 'string') {
        try {
          formData.businessLocation = JSON.parse(formData.businessLocation);
        } catch (error) {
          console.error('Error parsing businessLocation JSON:', error);
          formData.businessLocation = undefined;
        }
      }

      console.log('Form data businessLocation:', formData.businessLocation);
      console.log('Form data businessState:', formData.businessState);
      console.log('Form data businessCountry:', formData.businessCountry);

      const businessResult = await client.query(`
        INSERT INTO businesses (
          vendor_id, business_name, business_description, business_policy,
          business_address, business_city, business_state, business_country, business_zip_code,
          business_reach, what_makes_unique, business_type,
          website_links, contact_email, contact_phone, current_subscription_type, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        RETURNING business_id
      `, [
        vendorId,
        formData.businessName,
        formData.businessDescription,
        formData.businessPolicy || null,
        formData.businessAddress,
        formData.businessCity,
        (typeof formData.businessLocation === 'object' && formData.businessLocation?.subdivision) || formData.businessState,
        (typeof formData.businessLocation === 'object' && formData.businessLocation?.country) || formData.businessCountry,
        formData.businessZipCode,
        formData.reach || null,
        formData.businessUnique || null,
        formData.businessType,
        formData.websiteLinks || null,
        formData.contactEmail,
        formData.contactPhone,
        formData.subscriptionType
      ]);
      
      const businessId = businessResult.rows[0].business_id;
      
      // 6. Save business media
      if (logoResult) {
        await client.query(`
          INSERT INTO businessmedia (
            business_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, is_primary, created_at
          ) VALUES ($1, $2, 'logo', 0, 'public', $3, $4, $5, $6, true, NOW())
        `, [
          businessId,
          logoResult.directUrl,
          logoResult.bucketName,
          logoResult.fileKey,
          logoResult.size,
          logoResult.mimeType
        ]);
      }
      
      // 7. Save business images for banner creation
      for (let i = 0; i < businessImageResults.length; i++) {
        const image = businessImageResults[i];
        await client.query(`
          INSERT INTO businessmedia (
            business_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, created_at
          ) VALUES ($1, $2, 'banner', $3, 'public', $4, $5, $6, $7, NOW())
        `, [
          businessId,
          image.directUrl,
          i + 1,
          image.bucketName,
          image.fileKey,
          image.size,
          image.mimeType
        ]);
      }
      
      // 8. Process products if subscription allows
      if (formData.subscriptionType !== 'basic') {
        // Parse products from JSON string if needed
        let products = formData.products;
        if (typeof formData.products === 'string') {
          try {
            products = JSON.parse(formData.products);
          } catch (error) {
            console.error('Failed to parse vendor products JSON:', error);
            products = [];
          }
        }
        
        // Only process if we have valid products
        if (products && Array.isArray(products) && products.length > 0) {
          await this.processVendorProducts(client, businessId, products, files);
        }
      }
      
      await client.query('COMMIT');
      
      // Send registration emails (confirmation + admin review)
      console.log('📧 Sending registration emails...');
      const emailResult = await EmailRegistrationService.sendVendorRegistrationEmails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        subscriptionType: formData.subscriptionType,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription || '',
        parishAffiliation: formData.parishAffiliation,
        reach: 'local', // Default value
        contactForOpportunities: formData.contactForOpportunities || false
      }, vendorId);
      
      return {
        vendorId,
        businessId,
        tempPassword,
        emailResult,
        message: 'Vendor registration completed successfully'
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Vendor registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Process store registration
   */
  static async processStoreRegistration(
    formData: StoreFormData,
    files: { [fieldname: string]: Express.Multer.File[] }
  ) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // 1. Generate secure password
      const tempPassword = crypto.randomBytes(12).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // 2. Upload logo to S3 (public bucket)
      let logoResult = null;
      if (files.logo && files.logo[0]) {
        logoResult = await S3Service.uploadFile(files.logo[0], 'media');
      }
      
      // 3. Upload banner image to S3 (public bucket)
      let bannerResult = null;
      if (files.banner && files.banner[0]) {
        bannerResult = await S3Service.uploadFile(files.banner[0], 'media');
      }
      
      // 4. Upload tax exemption form to S3 (private bucket)
      let taxFormResult = null;
      if (files.taxExemptionForm && files.taxExemptionForm[0]) {
        taxFormResult = await S3Service.uploadFile(files.taxExemptionForm[0], 'documents');
      }
      
      // 5. Create organization record
      const orgResult = await client.query(`
        INSERT INTO organizations (
          name, organization_type, description, impact, since_year, slogan,
          is_tax_exempt, collect_donations, donations_platform,
          current_subscription_type, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING organization_id
      `, [
        formData.organizationName,
        formData.organizationType === 'other' ? formData.otherOrganizationType : formData.organizationType,
        formData.description,
        formData.impact,
        formData.foundingYear ? parseInt(formData.foundingYear) : null,
        formData.slogan || null,
        formData.hasTaxExemptStatus === 'yes',
        formData.collectsDonations || false,
        formData.donationPlatform === 'other' ? formData.otherDonationPlatform : formData.donationPlatform || null,
        // formData.primaryColor || null,
        // formData.secondaryColor || null,
        // Map frontend subscription tiers to database enum values
        formData.subscriptionTier === 'premium' ? 'elite' : formData.subscriptionTier
      ]);
      
      const organizationId = orgResult.rows[0].organization_id;
      
      // 6. Create administrator record (names already split in frontend)
      // Parse location if it's a JSON string
      if (typeof formData.location === 'string') {
        try {
          formData.location = JSON.parse(formData.location);
        } catch (error) {
          console.error('Error parsing location JSON:', error);
          formData.location = undefined;
        }
      }

      const adminResult = await client.query(`
        INSERT INTO administrators (
          organization_id, first_name, last_name, email, password_hash,
          street_address, city, state, country, zip_code, phone_number, approval_status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', NOW(), NOW())
        RETURNING admin_id
      `, [
        organizationId,
        formData.adminFirstName,
        formData.adminLastName,
        formData.email,
        hashedPassword,
        formData.streetAddress,
        formData.city,
        (typeof formData.location === 'object' && formData.location?.subdivision) || formData.state,
        (typeof formData.location === 'object' && formData.location?.country) || formData.country,
        formData.zipCode,
        formData.phoneNumber || null
      ]);
      
      const adminId = adminResult.rows[0].admin_id;
      
      // 7. Save organization media
      if (logoResult) {
        await client.query(`
          INSERT INTO storemedia (
            organization_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, is_primary, created_at
          ) VALUES ($1, $2, 'logo', 0, 'public', $3, $4, $5, $6, true, NOW())
        `, [
          organizationId,
          logoResult.directUrl,
          logoResult.bucketName,
          logoResult.fileKey,
          logoResult.size,
          logoResult.mimeType
        ]);
      }
      
      if (bannerResult) {
        await client.query(`
          INSERT INTO storemedia (
            organization_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, created_at
          ) VALUES ($1, $2, 'banner', 1, 'public', $3, $4, $5, $6, NOW())
        `, [
          organizationId,
          bannerResult.directUrl,
          bannerResult.bucketName,
          bannerResult.fileKey,
          bannerResult.size,
          bannerResult.mimeType
        ]);
      }
      
      // 8. Save tax exemption form if provided
      if (taxFormResult) {
        const taxFormId = await client.query(`
          INSERT INTO organizationtaxforms (
            organization_id, document_url, document_key, bucket_type,
            bucket_name, file_size, mime_type, created_at
          ) VALUES ($1, '', $2, 'private', $3, $4, $5, NOW())
          RETURNING tax_form_id
        `, [
          organizationId,
          taxFormResult.fileKey,
          taxFormResult.bucketName,
          taxFormResult.size,
          taxFormResult.mimeType
        ]);
        
        // Update organization with current tax form
        await client.query(`
          UPDATE organizations 
          SET current_tax_form_id = $1 
          WHERE organization_id = $2
        `, [taxFormId.rows[0].tax_form_id, organizationId]);
      }
      
      // 9. Process products if elite subscription
      if (formData.subscriptionTier === 'elite') {
        // Parse products from JSON string if needed
        let products = formData.products;
        if (typeof formData.products === 'string') {
          try {
            products = JSON.parse(formData.products);
          } catch (error) {
            console.error('Failed to parse products JSON:', error);
            products = [];
          }
        }
        
        // Only process if we have valid products
        if (products && Array.isArray(products) && products.length > 0) {
          // Filter out invalid/empty products
          const validProducts = products.filter(product => 
            product && 
            typeof product === 'object' && 
            product.name && 
            product.category && 
            product.description && 
            product.pricingInfo
          );
          
          if (validProducts.length > 0) {
            await this.processStoreProducts(client, organizationId, validProducts, files);
          } else {
            console.log('No valid products found for elite subscription');
          }
        }
      }
      
      await client.query('COMMIT');
      
      // Send registration emails (confirmation + admin review)
      console.log('📧 Sending store registration emails...');
      const emailResult = await EmailRegistrationService.sendStoreRegistrationEmails({
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType === 'other' ? (formData.otherOrganizationType || formData.organizationType) : formData.organizationType,
        email: formData.email,
        subscriptionTier: formData.subscriptionTier === 'premium' ? 'elite' : formData.subscriptionTier,
        description: formData.description,
        impact: formData.impact,
        foundingYear: formData.foundingYear,
        slogan: formData.slogan,
        hasTaxExemptStatus: formData.hasTaxExemptStatus,
        collectsDonations: formData.collectsDonations,
        donationPlatform: formData.donationPlatform === 'other' ? formData.otherDonationPlatform : formData.donationPlatform
      }, adminId);
      
      return {
        organizationId,
        adminId,
        tempPassword,
        emailResult,
        message: 'Store registration completed successfully'
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Store registration error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Process vendor products
   */
  private static async processVendorProducts(
    client: any,
    businessId: number,
    products: any[],
    files: { [fieldname: string]: Express.Multer.File[] }
  ) {
    // Validate that products array is not empty and contains valid products
    if (!products || products.length === 0) {
      console.log('No products to process for vendor');
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Validate required product fields
      if (!product || !product.name || !product.category || !product.description || !product.pricingInfo) {
        console.log(`Skipping invalid vendor product at index ${i}:`, product);
        continue;
      }
      
      // Create product record
      const productResult = await client.query(`
        INSERT INTO businessproducts (
          business_id, name, category, description, promotional_hook, pricing_info, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING product_id
      `, [
        businessId,
        product.name,
        product.category === 'Other' ? product.otherCategory : product.category,
        product.description,
        product.promotionalHook || null,
        product.pricingInfo
      ]);
      
      const productId = productResult.rows[0].product_id;
      
      // Handle product images - they come indexed by product (e.g., productImages_0, productImages_1)
      const productImagesKey = `productImages_${i}`;
      if (files[productImagesKey]) {
        const productImages = files[productImagesKey];
        
        for (let j = 0; j < productImages.length; j++) {
          const imageFile = productImages[j];
          const imageResult = await S3Service.uploadFile(imageFile, 'media');
          
          await client.query(`
            INSERT INTO businessproductmedia (
              product_id, media_url, media_type, media_order, bucket_type,
              bucket_name, media_key, file_size, mime_type, created_at
            ) VALUES ($1, $2, 'image', $3, 'public', $4, $5, $6, $7, NOW())
          `, [
            productId,
            imageResult.directUrl,
            j,
            imageResult.bucketName,
            imageResult.fileKey,
            imageResult.size,
            imageResult.mimeType
          ]);
        }
      }
      
      // Handle product videos - they come indexed by product (e.g., productVideos_0, productVideos_1)
      const productVideosKey = `productVideos_${i}`;
      if (files[productVideosKey] && files[productVideosKey][0]) {
        const videoFile = files[productVideosKey][0];
        const videoResult = await S3Service.uploadFile(videoFile, 'media');
        
        await client.query(`
          INSERT INTO businessproductmedia (
            product_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, created_at
          ) VALUES ($1, $2, 'video', 0, 'public', $3, $4, $5, $6, NOW())
        `, [
          productId,
          videoResult.directUrl,
          videoResult.bucketName,
          videoResult.fileKey,
          videoResult.size,
          videoResult.mimeType
        ]);
      }
    }
  }
  
  /**
   * Process store products
   */
  private static async processStoreProducts(
    client: any,
    organizationId: number,
    products: any[],
    files: { [fieldname: string]: Express.Multer.File[] }
  ) {
    // Validate that products array is not empty and contains valid products
    if (!products || products.length === 0) {
      console.log('No products to process for store');
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Validate required product fields
      if (!product || !product.name || !product.category || !product.description || !product.pricingInfo) {
        console.log(`Skipping invalid product at index ${i}:`, product);
        continue;
      }
      
      // Create product record
      const productResult = await client.query(`
        INSERT INTO storeproducts (
          organization_id, name, category, description, promotional_hook, pricing_info, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING product_id
      `, [
        organizationId,
        product.name,
        product.category === 'Other' ? product.otherCategory : product.category,
        product.description,
        product.promotionalHook || null,
        product.pricingInfo
      ]);
      
      const productId = productResult.rows[0].product_id;
      
      // Handle product images - they come indexed by product (e.g., productImages_0, productImages_1)
      const productImagesKey = `productImages_${i}`;
      if (files[productImagesKey] && files[productImagesKey].length > 0) {
        const productImages = files[productImagesKey];
        
        for (let j = 0; j < productImages.length; j++) {
          const imageFile = productImages[j];
          if (imageFile) {
            const imageResult = await S3Service.uploadFile(imageFile, 'media');
            
            await client.query(`
              INSERT INTO storeproductmedia (
                product_id, media_url, media_type, media_order, bucket_type,
                bucket_name, media_key, file_size, mime_type, created_at
              ) VALUES ($1, $2, 'image', $3, 'public', $4, $5, $6, $7, NOW())
            `, [
              productId,
              imageResult.directUrl,
              j,
              imageResult.bucketName,
              imageResult.fileKey,
              imageResult.size,
              imageResult.mimeType
            ]);
          }
        }
      }
      
      // Handle product videos - they come indexed by product (e.g., productVideos_0, productVideos_1)
      const productVideosKey = `productVideos_${i}`;
      if (files[productVideosKey] && files[productVideosKey][0]) {
        const videoFile = files[productVideosKey][0];
        const videoResult = await S3Service.uploadFile(videoFile, 'media');
        
        await client.query(`
          INSERT INTO storeproductmedia (
            product_id, media_url, media_type, media_order, bucket_type,
            bucket_name, media_key, file_size, mime_type, created_at
          ) VALUES ($1, $2, 'video', 0, 'public', $3, $4, $5, $6, NOW())
        `, [
          productId,
          videoResult.directUrl,
          videoResult.bucketName,
          videoResult.fileKey,
          videoResult.size,
          videoResult.mimeType
        ]);
      }
    }
  }
  
  /**
   * Check registration status
   */
  static async checkRegistrationStatus(token: string) {
    const result = await query(`
      SELECT * FROM approval_tokens 
      WHERE token = $1 AND expires_at > NOW() AND is_used = false
    `, [token]);
    
    if (result.rows.length === 0) {
      throw new Error('Invalid or expired token');
    }
    
    return result.rows[0];
  }
} 