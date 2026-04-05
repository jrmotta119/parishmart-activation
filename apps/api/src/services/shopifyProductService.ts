import { GraphQLClient } from 'graphql-request';
import { S3Service } from './s3Service';

// Shopify API config
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'your-shopify-domain.myshopify.com';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';
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

interface ProductData {
  product_id: number;
  name: string;
  category: string;
  description: string;
  promotional_hook?: string;
  pricing_info?: string;
  media?: ProductMedia[];
}

interface ProductMedia {
  media_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  media_order: number;
  alt_text?: string;
  media_key: string;
  bucket_type: 'public' | 'private';
}

interface ShopifyProductResult {
  shopifyProductId: string;
  shopifyHandle: string;
  uploadedImages: string[];
  errors?: string[];
}

export class ShopifyProductService {

  /**
   * Create a Shopify product from database product data
   */
  static async createShopifyProduct(
    productData: ProductData,
    vendorName: string,
    collectionHandle?: string
  ): Promise<ShopifyProductResult> {
    try {
      console.log(`📦 Creating Shopify product: ${productData.name}`);

      // Step 1: Prepare S3 URLs for images (skip separate upload, use URLs directly)
      const productImages = productData.media?.filter(m => m.media_type === 'image') || [];
      const imageUrls: string[] = [];

      for (const image of productImages) {
        try {
          // Generate S3 access URL for this image
          const s3Url = await S3Service.generateAccessUrl(
            image.media_key,
            image.bucket_type
          );
          imageUrls.push(s3Url);
          console.log(`📷 Generated S3 URL for image: ${image.media_key}`);
        } catch (imageError) {
          console.error(`❌ Failed to generate S3 URL for image ${image.media_id}:`, imageError);
          // Continue with other images
        }
      }

      // Step 2: Create the product in Shopify with media
      const createProductMutation = `
        mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
          productCreate(product: $product, media: $media) {
            product {
              id
              title
              handle
              status
              vendor
              productType
              variants(first: 1) {
                nodes {
                  id
                  price
                  inventoryItem {
                    id
                    tracked
                  }
                }
              }
              media(first: 10) {
                nodes {
                  alt
                  mediaContentType
                  preview {
                    status
                  }
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

      // Extract price for the variant
      const price = this.extractPrice(productData.pricing_info);

      // Build product input (category field requires Shopify category ID, not string)
      const productInput: any = {
        title: productData.name,
        descriptionHtml: `<p>${this.buildProductDescription(productData).replace(/\n/g, '</p><p>')}</p>`,
        productType: productData.category, // This works fine for product organization
        vendor: vendorName,
        status: "DRAFT", // Keep products in draft until ready
        tags: [productData.category, "ParishMart", collectionHandle || ""]
        // Note: category field requires a Shopify category taxonomy ID, not a string
        // For now, productType provides categorization in the product organization section
      };

      // Prepare media input using S3 URLs
      const mediaInput = imageUrls.map((s3Url, index) => ({
        originalSource: s3Url, // Use S3 URL directly
        alt: `${productData.name} - Image ${index + 1}`,
        mediaContentType: "IMAGE"
      }));

      const result = await graphqlClient.request(createProductMutation, {
        product: productInput,
        media: mediaInput.length > 0 ? mediaInput : undefined
      }) as any;

      // Check for errors
      if (result.productCreate?.userErrors?.length > 0) {
        const errorMessages = result.productCreate.userErrors.map((err: any) =>
          `${err.field}: ${err.message}`
        );
        throw new Error(`Shopify product creation failed: ${errorMessages.join(', ')}`);
      }

      if (!result.productCreate?.product?.id) {
        throw new Error('Shopify product creation returned no ID');
      }

      const shopifyProductId = result.productCreate.product.id;
      const shopifyHandle = result.productCreate.product.handle;

      console.log(`✅ Created Shopify product: ${shopifyProductId} (${shopifyHandle})`);

      // Step 3: Set variant pricing if we have a price
      const defaultVariant = result.productCreate.product.variants?.nodes?.[0];
      if (defaultVariant && price !== null) {
        console.log(`✅ Default variant created: ${defaultVariant.id} with price: ${defaultVariant.price || 'not set'}`);

        try {
          await this.updateVariantPricingBulk(shopifyProductId, defaultVariant.id, price);
          console.log(`✅ Updated variant pricing to $${price}`);
        } catch (pricingError) {
          console.error(`⚠️ Failed to update variant pricing:`, pricingError);
          // Don't fail the whole process
        }
      }

      // Step 4: Publish to all sales channels
      try {
        await this.publishToAllChannels(shopifyProductId);
        console.log(`✅ Published product to all sales channels`);
      } catch (publishError) {
        console.error(`⚠️ Failed to publish to all channels:`, publishError);
        // Don't fail the whole process
      }

      // Step 3: Add product to collection if specified
      if (collectionHandle) {
        try {
          await this.addProductToCollection(shopifyProductId, collectionHandle);
          console.log(`✅ Added product to collection: ${collectionHandle}`);
        } catch (collectionError) {
          console.error(`⚠️ Failed to add product to collection:`, collectionError);
          // Don't fail the whole process if collection assignment fails
        }
      }

      return {
        shopifyProductId,
        shopifyHandle,
        uploadedImages: imageUrls // Return S3 URLs used
      };

    } catch (error) {
      console.error(`❌ Failed to create Shopify product for ${productData.name}:`, error);
      throw error;
    }
  }

  /**
   * Upload a single product image to Shopify
   */
  private static async uploadProductImageToShopify(
    imageData: ProductMedia,
    productName: string
  ): Promise<string | null> {
    try {
      // Generate S3 access URL
      const s3Url = await S3Service.generateAccessUrl(
        imageData.media_key,
        imageData.bucket_type
      );

      console.log(`📷 Uploading product image to Shopify: ${imageData.media_key}`);

      // Upload to Shopify
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

      const uploadResult = await graphqlClient.request(uploadImageMutation, {
        files: [{
          alt: imageData.alt_text || `${productName} image`,
          contentType: "IMAGE",
          originalSource: s3Url
        }]
      }) as any;

      // Check for upload errors
      if (uploadResult.fileCreate?.userErrors?.length > 0) {
        console.error(`❌ Image upload failed:`, uploadResult.fileCreate.userErrors);
        return null;
      }

      const uploadedFileId = uploadResult.fileCreate?.files?.[0]?.id;
      if (uploadedFileId) {
        console.log(`✅ Image uploaded to Shopify: ${uploadedFileId}`);
        return uploadedFileId;
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to upload image to Shopify:`, error);
      return null;
    }
  }

  /**
   * Associate uploaded images with a product using productImageUpdate
   */
  private static async associateImagesWithProduct(
    productId: string,
    imageIds: string[]
  ): Promise<void> {
    try {
      // Associate each image with the product
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];

        const productImageUpdateMutation = `
          mutation productImageUpdate($productId: ID!, $image: ImageInput!) {
            productImageUpdate(productId: $productId, image: $image) {
              image {
                id
                url
                altText
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const result = await graphqlClient.request(productImageUpdateMutation, {
          productId: productId,
          image: {
            id: imageId,
            altText: `Product Image ${i + 1}`
          }
        }) as any;

        if (result.productImageUpdate?.userErrors?.length > 0) {
          console.error(`❌ Failed to associate image ${imageId}:`, result.productImageUpdate.userErrors);
          // Continue with other images
        } else {
          console.log(`✅ Associated image ${i + 1} with product`);
        }
      }

      console.log(`✅ Successfully processed ${imageIds.length} images for product ${productId}`);
    } catch (error) {
      console.error(`❌ Failed to associate images with product:`, error);
      throw error;
    }
  }

  /**
   * Update variant pricing using productVariantsBulkUpdate
   */
  private static async updateVariantPricingBulk(
    productId: string,
    variantId: string,
    price: number
  ): Promise<void> {
    try {
      const updateVariantMutation = `
        mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
              id
              price
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const updateResult = await graphqlClient.request(updateVariantMutation, {
        productId: productId,
        variants: [{
          id: variantId,
          price: price.toString()
        }]
      }) as any;

      if (updateResult.productVariantsBulkUpdate?.userErrors?.length > 0) {
        console.error(`❌ Variant pricing update failed:`, updateResult.productVariantsBulkUpdate.userErrors);
        throw new Error('Failed to update variant pricing');
      }

      console.log(`✅ Successfully updated variant ${variantId} with price $${price}`);
    } catch (error) {
      console.error(`❌ Failed to update variant pricing:`, error);
      throw error;
    }
  }

  /**
   * Publish product to all sales channels (fixed for custom/admin apps)
   */
  private static async publishToAllChannels(productId: string): Promise<void> {
    try {
      // Get all available publications first
      const channelsQuery = `
        query GetPublications {
          publications(first: 50) {
            nodes {
              id
              supportsFuturePublishing
              catalog { __typename }
            }
          }
        }
      `;

      const channelsResult = await graphqlClient.request(channelsQuery) as any;
      const publications = channelsResult.publications.nodes || [];

      if (publications.length === 0) {
        console.log(`⚠️ No publications found for this shop`);
        return;
      }

      // Publish to each channel individually
      let successCount = 0;
      for (const publication of publications) {
        try {
          const publishMutation = `
            mutation PublishToChannel($productId: ID!, $publicationId: ID!) {
              publishablePublish(id: $productId, input: { publicationId: $publicationId }) {
                publishable {
                  ... on Product {
                    id
                    status
                    publishedOnPublication(publicationId: $publicationId)
                  }
                }
                userErrors { field message }
              }
            }
          `;

          const publishResult = await graphqlClient.request(publishMutation, {
            productId: productId,
            publicationId: publication.id
          }) as any;

          if (publishResult.publishablePublish?.userErrors?.length > 0) {
            console.error(`❌ Failed to publish to ${publication.id}:`, publishResult.publishablePublish.userErrors);
          } else {
            successCount++;
            console.log(`✅ Published to channel: ${publication.id}`);
          }
        } catch (channelError) {
          console.error(`❌ Error publishing to ${publication.id}:`, channelError);
          // Continue with other channels
        }
      }

      console.log(`✅ Successfully published to ${successCount}/${publications.length} sales channels`);
    } catch (error) {
      console.error(`❌ Failed to publish to sales channels:`, error);
      throw error;
    }
  }

  /**
   * Find or create a collection for the given handle
   */
  static async findOrCreateCollection(
    collectionHandle: string,
    collectionTitle: string
  ): Promise<string | null> {
    try {
      console.log(`🔍 Finding or creating collection: ${collectionHandle}`);

      // Step 1: Try to find existing collection
      const findCollectionQuery = `
        query findCollection($query: String!) {
          collections(first: 1, query: $query) {
            edges {
              node {
                id
                handle
                title
              }
            }
          }
        }
      `;

      const existingResult = await graphqlClient.request(findCollectionQuery, {
        query: `handle:${collectionHandle}`
      }) as any;

      if (existingResult.collections.edges.length > 0) {
        const collectionId = existingResult.collections.edges[0].node.id;
        console.log(`✅ Found existing collection: ${collectionId}`);
        return collectionId;
      }

      // Step 2: Create new collection if not found
      console.log(`📦 Creating new collection: ${collectionTitle}`);

      const createCollectionMutation = `
        mutation collectionCreate($input: CollectionInput!) {
          collectionCreate(input: $input) {
            collection {
              id
              handle
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResult = await graphqlClient.request(createCollectionMutation, {
        input: {
          title: collectionTitle,
          handle: collectionHandle,
          descriptionHtml: `Products from ${collectionTitle} on ParishMart`,
          ruleSet: {
            rules: [
              {
                column: "TAG",
                relation: "EQUALS",
                condition: collectionHandle
              }
            ],
            appliedDisjunctively: false
          }
        }
      }) as any;

      if (createResult.collectionCreate?.userErrors?.length > 0) {
        console.error(`❌ Collection creation failed:`, createResult.collectionCreate.userErrors);
        return null;
      }

      const collectionId = createResult.collectionCreate?.collection?.id;
      if (collectionId) {
        console.log(`✅ Created new collection: ${collectionId}`);

        // Publish the new collection to all sales channels
        try {
          await this.publishToAllChannels(collectionId);
          console.log(`✅ Published collection to all sales channels`);
        } catch (publishError) {
          console.error(`⚠️ Failed to publish collection to sales channels:`, publishError);
          // Don't fail collection creation if publication fails
        }

        return collectionId;
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to find/create collection ${collectionHandle}:`, error);
      return null;
    }
  }

  /**
   * Add a product to a collection by creating a collection rule that includes products with specific tags
   */
  static async addProductToCollection(
    productId: string,
    collectionHandle: string
  ): Promise<void> {
    try {
      // First, tag the product with the collection handle so it can be auto-included
      const updateProductMutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              tags
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Add collection handle as a tag to the product
      await graphqlClient.request(updateProductMutation, {
        input: {
          id: productId,
          tags: ["ParishMart", collectionHandle] // Add collection handle as tag
        }
      });

      console.log(`✅ Tagged product ${productId} for collection ${collectionHandle}`);

      // Note: The collection should be set up with rules to automatically include
      // products tagged with the collection handle. This happens in findOrCreateCollection.
    } catch (error) {
      console.error(`❌ Failed to tag product for collection:`, error);
      throw error;
    }
  }

  /**
   * Extract price from pricing_info string
   */
  private static extractPrice(pricingInfo?: string): number | null {
    if (!pricingInfo) return null;

    // Look for price patterns like $12.99, 12.99, $12, 12
    const priceMatch = pricingInfo.match(/\$?(\d+(?:\.\d{2})?)/);
    if (priceMatch) {
      return parseFloat(priceMatch[1]);
    }

    return null;
  }

  /**
   * Build a comprehensive product description from database fields
   */
  private static buildProductDescription(productData: ProductData): string {
    let description = productData.description;

    if (productData.promotional_hook) {
      description = `${productData.promotional_hook}\n\n${description}`;
    }

    // Don't include pricing in description anymore since we'll set it in the variant
    // if (productData.pricing_info) {
    //   description += `\n\n**Pricing Information:**\n${productData.pricing_info}`;
    // }

    // Add ParishMart branding
    description += `\n\n---\n*Available on ParishMart - Supporting faith-based businesses and organizations.*`;

    return description;
  }

  /**
   * Sync all products for a vendor to Shopify
   */
  static async syncVendorProducts(
    vendorId: number,
    businessName: string,
    collectionHandle: string,
    client: any
  ): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    try {
      console.log(`🔄 Syncing products for vendor ${vendorId} to Shopify collection: ${collectionHandle}`);

      // Fetch vendor products with media
      const productsResult = await client.query(`
        SELECT
          bp.product_id,
          bp.name,
          bp.category,
          bp.description,
          bp.promotional_hook,
          bp.pricing_info,
          COALESCE(
            json_agg(
              json_build_object(
                'media_id', bpm.media_id,
                'media_url', bpm.media_url,
                'media_type', bpm.media_type,
                'media_order', bpm.media_order,
                'alt_text', bpm.alt_text,
                'media_key', bpm.media_key,
                'bucket_type', bpm.bucket_type
              ) ORDER BY bpm.media_order
            ) FILTER (WHERE bpm.media_id IS NOT NULL),
            '[]'::json
          ) as media
        FROM businessproducts bp
        JOIN businesses b ON b.business_id = bp.business_id
        LEFT JOIN businessproductmedia bpm ON bpm.product_id = bp.product_id
        WHERE b.vendor_id = $1
        GROUP BY bp.product_id, bp.name, bp.category, bp.description, bp.promotional_hook, bp.pricing_info
        ORDER BY bp.created_at
      `, [vendorId]);

      console.log(`📦 Found ${productsResult.rows.length} products to sync for vendor ${vendorId}`);

      // Ensure collection exists
      await this.findOrCreateCollection(collectionHandle, businessName);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each product
      for (const productRow of productsResult.rows) {
        try {
          const productData: ProductData = {
            product_id: productRow.product_id,
            name: productRow.name,
            category: productRow.category,
            description: productRow.description,
            promotional_hook: productRow.promotional_hook,
            pricing_info: productRow.pricing_info,
            media: productRow.media || []
          };

          await this.createShopifyProduct(productData, businessName, collectionHandle);
          successCount++;
          console.log(`✅ Synced product: ${productData.name}`);

        } catch (productError) {
          errorCount++;
          const errorMessage = `Failed to sync product ${productRow.name}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
          errors.push(errorMessage);
          console.error(`❌ ${errorMessage}`);
        }
      }

      console.log(`🏁 Vendor product sync complete: ${successCount} success, ${errorCount} errors`);
      return { successCount, errorCount, errors };

    } catch (error) {
      console.error(`❌ Failed to sync vendor products:`, error);
      throw error;
    }
  }

  /**
   * Sync all products for a store to Shopify
   */
  static async syncStoreProducts(
    organizationId: number,
    organizationName: string,
    collectionHandle: string,
    client: any
  ): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
    try {
      console.log(`🔄 Syncing products for organization ${organizationId} to Shopify collection: ${collectionHandle}`);

      // Fetch store products with media
      const productsResult = await client.query(`
        SELECT
          sp.product_id,
          sp.name,
          sp.category,
          sp.description,
          sp.promotional_hook,
          sp.pricing_info,
          COALESCE(
            json_agg(
              json_build_object(
                'media_id', spm.media_id,
                'media_url', spm.media_url,
                'media_type', spm.media_type,
                'media_order', spm.media_order,
                'alt_text', spm.alt_text,
                'media_key', spm.media_key,
                'bucket_type', spm.bucket_type
              ) ORDER BY spm.media_order
            ) FILTER (WHERE spm.media_id IS NOT NULL),
            '[]'::json
          ) as media
        FROM storeproducts sp
        LEFT JOIN storeproductmedia spm ON spm.product_id = sp.product_id
        WHERE sp.organization_id = $1
        GROUP BY sp.product_id, sp.name, sp.category, sp.description, sp.promotional_hook, sp.pricing_info
        ORDER BY sp.created_at
      `, [organizationId]);

      console.log(`📦 Found ${productsResult.rows.length} products to sync for organization ${organizationId}`);

      // Ensure collection exists
      await this.findOrCreateCollection(collectionHandle, organizationName);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each product
      for (const productRow of productsResult.rows) {
        try {
          const productData: ProductData = {
            product_id: productRow.product_id,
            name: productRow.name,
            category: productRow.category,
            description: productRow.description,
            promotional_hook: productRow.promotional_hook,
            pricing_info: productRow.pricing_info,
            media: productRow.media || []
          };

          await this.createShopifyProduct(productData, organizationName, collectionHandle);
          successCount++;
          console.log(`✅ Synced product: ${productData.name}`);

        } catch (productError) {
          errorCount++;
          const errorMessage = `Failed to sync product ${productRow.name}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
          errors.push(errorMessage);
          console.error(`❌ ${errorMessage}`);
        }
      }

      console.log(`🏁 Store product sync complete: ${successCount} success, ${errorCount} errors`);
      return { successCount, errorCount, errors };

    } catch (error) {
      console.error(`❌ Failed to sync store products:`, error);
      throw error;
    }
  }
}