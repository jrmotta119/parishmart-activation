import express, { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { TokenUtils } from '../utils/tokenUtils';
import { EmailService } from '../services/emailService';
import { EmailTemplates } from '../utils/emailTemplates';
import { query, getClient } from '../db/connection';
import { HTTP_STATUS } from '@parishmart/shared';
import rateLimit from 'express-rate-limit';
import { ImageProcessingService } from '../services/imageProcessingService';
import { requireSuperAdminAuth } from '../middleware/adminAuth';

interface VendorData {
  business_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  current_subscription_type?: string;
  phone?: string;
  approval_status?: string;
  rejection_reason?: string;
}

interface StoreData {
  organization_name: string;
  organization_type?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  current_subscription_type?: string;
  approval_status?: string;
  rejection_reason?: string;
}

interface MediaRow {
  media_url: string;
  media_type: string;
  business_id?: number;
  logo_has_transparent_bg?: boolean;
  banner_mode?: string;
}

const router = express.Router();

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
 * Approve vendor in database and trigger image processing
 */
async function activateVendorApproval(client: PoolClient, vendorId: number, userData: VendorData, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Approving vendor with ID: ${vendorId}`);

    // Step 1: Approve vendor in database
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

    console.log(`✅ Vendor approved successfully: ${vendorId}`);

    // Step 2: Trigger image processing (non-blocking — results arrive via webhook)
    try {
      const mediaResult = await client.query(`
        SELECT bm.media_url, bm.media_type, bm.business_id,
               b.logo_has_transparent_bg, b.banner_mode
        FROM businessmedia bm
        JOIN businesses b ON b.business_id = bm.business_id
        WHERE b.vendor_id = $1 AND bm.media_type IN ('logo', 'banner')
        ORDER BY bm.media_type, bm.media_order
      `, [vendorId]);

      const logoRow    = mediaResult.rows.find((r: MediaRow) => r.media_type === 'logo');
      const bannerRows = mediaResult.rows.filter((r: MediaRow) => r.media_type === 'banner');
      const businessId    = logoRow?.business_id || bannerRows[0]?.business_id;
      const skipBgRemoval = logoRow?.logo_has_transparent_bg ?? false;
      const bannerMode    = logoRow?.banner_mode || bannerRows[0]?.banner_mode || 'collage';

      if (businessId && (logoRow || bannerRows.length > 0)) {
        if (bannerMode === 'full' && bannerRows.length > 0) {
          // Full banner is ready to use — mark it as done without ImaMod
          await client.query(
            `UPDATE businessmedia
             SET processed_media_url = media_url, processing_status = 'done'
             WHERE business_id = $1 AND media_type = 'banner'`,
            [businessId]
          );
          console.log(`✅ Full banner stored directly (no ImaMod needed) for V-${businessId}`);
        }

        // Call ImaMod whenever there's a logo (returns merch images) or collage banners to composite.
        // ImaMod accepts empty images_for_banner when only logo processing is needed.
        const imagesForBanner = bannerMode === 'collage' ? bannerRows.map((r: MediaRow) => r.media_url) : [];
        const needsImaMod = !!logoRow || (bannerMode === 'collage' && bannerRows.length > 0);

        if (needsImaMod) {
          const jobId = await ImageProcessingService.submitJob({
            seller_id: `V-${businessId}`,
            store_name: userData.business_name,
            logo_url: logoRow?.media_url,
            images_for_banner: imagesForBanner,
            merchandise: ['tshirt', 'cap', 'hoodie'],
            skip_background_removal: skipBgRemoval,
            webhook_url: `${process.env.BASE_URL}/api/webhook/image-processing`,
          });

          await client.query(
            `UPDATE businesses SET image_processing_job_id = $1 WHERE business_id = $2`,
            [jobId, businessId]
          );
          // Only mark logo + collage banners as pending — full banner is already done above
          await client.query(
            `UPDATE businessmedia SET processing_status = 'pending'
             WHERE business_id = $1 AND media_type = 'logo'`,
            [businessId]
          );
          if (bannerMode === 'collage') {
            await client.query(
              `UPDATE businessmedia SET processing_status = 'pending'
               WHERE business_id = $1 AND media_type = 'banner'`,
              [businessId]
            );
          }
          console.log(`🖼️  Image processing job submitted: ${jobId}`);
        }
      }
    } catch (imgErr) {
      console.error('⚠️ Image processing job submission failed (non-fatal):', imgErr);
    }

  } catch (error) {
    console.error(`❌ Failed to approve vendor:`, error);
    throw error;
  }
}

/**
 * Approve administrator in database and trigger image processing
 */
async function activateStoreApproval(client: PoolClient, adminId: number, userData: StoreData, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Approving administrator with ID: ${adminId}`);

    // Step 1: Approve administrator in database
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

    console.log(`✅ Administrator approved successfully: ${adminId}`);

    // Step 2: Trigger image processing (non-blocking — results arrive via webhook)
    try {
      const orgRow = await client.query(
        `SELECT organization_id, logo_has_transparent_bg, banner_mode FROM organizations
         WHERE organization_id = (SELECT organization_id FROM administrators WHERE admin_id = $1)`,
        [adminId]
      );
      const organizationId  = orgRow.rows[0]?.organization_id;
      const skipBgRemoval   = orgRow.rows[0]?.logo_has_transparent_bg ?? false;
      const bannerMode      = orgRow.rows[0]?.banner_mode || 'collage';

      if (organizationId) {
        const mediaResult = await client.query(`
          SELECT media_url, media_type FROM storemedia
          WHERE organization_id = $1 AND media_type IN ('logo', 'banner')
          ORDER BY media_type, media_order
        `, [organizationId]);

        const logoRow    = mediaResult.rows.find((r: MediaRow) => r.media_type === 'logo');
        const bannerRows = mediaResult.rows.filter((r: MediaRow) => r.media_type === 'banner');

        if (logoRow || bannerRows.length > 0) {
          if (bannerMode === 'full' && bannerRows.length > 0) {
            // Full banner is ready to use — mark it as done without ImaMod
            await client.query(
              `UPDATE storemedia
               SET processed_media_url = media_url, processing_status = 'done'
               WHERE organization_id = $1 AND media_type = 'banner'`,
              [organizationId]
            );
            console.log(`✅ Full banner stored directly (no ImaMod needed) for S-${organizationId}`);
          }

          // Call ImaMod whenever there's a logo (returns merch images) or collage banners to composite.
          // ImaMod accepts empty images_for_banner when only logo processing is needed.
          const imagesForBanner = bannerMode === 'collage' ? bannerRows.map((r: MediaRow) => r.media_url) : [];
          const needsImaMod = !!logoRow || (bannerMode === 'collage' && bannerRows.length > 0);

          if (needsImaMod) {
            const jobId = await ImageProcessingService.submitJob({
              seller_id: `S-${organizationId}`,
              store_name: userData.organization_name,
              logo_url: logoRow?.media_url,
              images_for_banner: imagesForBanner,
              merchandise: ['tshirt', 'cap', 'hoodie'],
              skip_background_removal: skipBgRemoval,
              webhook_url: `${process.env.BASE_URL}/api/webhook/image-processing`,
            });

            await client.query(
              `UPDATE organizations SET image_processing_job_id = $1 WHERE organization_id = $2`,
              [jobId, organizationId]
            );
            await client.query(
              `UPDATE storemedia SET processing_status = 'pending'
               WHERE organization_id = $1 AND media_type = 'logo'`,
              [organizationId]
            );
            if (bannerMode === 'collage') {
              await client.query(
                `UPDATE storemedia SET processing_status = 'pending'
                 WHERE organization_id = $1 AND media_type = 'banner'`,
                [organizationId]
              );
            }
            console.log(`🖼️  Image processing job submitted: ${jobId}`);
          }
        }
      }
    } catch (imgErr) {
      console.error('⚠️ Image processing job submission failed (non-fatal):', imgErr);
    }

  } catch (error) {
    console.error(`❌ Failed to approve administrator:`, error);
    throw error;
  }
}

/**
 * Reject vendor using database function (simplified)
 */
async function rejectVendorApplication(client: PoolClient, vendorId: number, reason?: string, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
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
async function rejectStoreApplication(client: PoolClient, adminId: number, reason?: string, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
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

    // Atomically claim the token (validates + marks used in one UPDATE — no race condition)
    const validation = await TokenUtils.claimToken(token);
    if (!validation || !validation.user_type || !validation.user_id) {
      console.error(`❌ Invalid, expired, or already-used token for approval`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('approved', 'vendor', false, 'Invalid or expired token')
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

      // Fetch user data directly by ID — token is already claimed so getUserByToken would reject it
      const userData = await TokenUtils.getUserById(user_type, user_id);
      if (!userData || !userData.userData) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.NOT_FOUND).send(
          renderAdminActionPage('approved', user_type, false, 'User not found')
        );
      }

      // Activate features based on user type
      if (user_type === 'vendor') {
        await activateVendorApproval(client, user_id, userData.userData, token, req.ip, req.get('User-Agent'));
      } else {
        await activateStoreApproval(client, user_id, userData.userData, token, req.ip, req.get('User-Agent'));
      }

      // Invalidate all remaining tokens for this user (e.g. the sibling reject token)
      await TokenUtils.invalidateUserTokens(user_type, user_id);

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

    // Atomically claim the token (validates + marks used in one UPDATE — no race condition)
    const validation = await TokenUtils.claimToken(token);
    if (!validation || !validation.user_type || !validation.user_id) {
      console.error(`❌ Invalid, expired, or already-used token for rejection`);
      return res.status(HTTP_STATUS.BAD_REQUEST).send(
        renderAdminActionPage('rejected', 'vendor', false, 'Invalid or expired token')
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

      // Fetch user data directly by ID — token is already claimed so getUserByToken would reject it
      const userData = await TokenUtils.getUserById(user_type, user_id);
      if (!userData || !userData.userData) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.NOT_FOUND).send(
          renderAdminActionPage('rejected', user_type, false, 'User not found')
        );
      }

      // Update rejection status in database
      if (user_type === 'vendor') {
        await rejectVendorApplication(client, user_id, userData.userData.rejection_reason, token, req.ip, req.get('User-Agent'));
      } else {
        await rejectStoreApplication(client, user_id, userData.userData.rejection_reason, token, req.ip, req.get('User-Agent'));
      }

      // Invalidate all remaining tokens for this user (e.g. the sibling approve token)
      await TokenUtils.invalidateUserTokens(user_type, user_id);

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
router.get('/tokens/stats', requireSuperAdminAuth, async (req: Request, res: Response) => {
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
router.post('/tokens/cleanup', requireSuperAdminAuth, async (req: Request, res: Response) => {
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
router.get('/health', requireSuperAdminAuth, async (req: Request, res: Response) => {
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
router.get('/approval-stats', requireSuperAdminAuth, async (req: Request, res: Response) => {
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
 * GET /api/admin/products/vendor/:vendorId
 * Get all products for a vendor from database
 */
router.get('/products/vendor/:vendorId', requireSuperAdminAuth, async (req: Request, res: Response) => {
  try {
    const vendorId = parseInt(req.params.vendorId);
    if (isNaN(vendorId) || vendorId <= 0) {
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
router.get('/products/store/:organizationId', requireSuperAdminAuth, async (req: Request, res: Response) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
    if (isNaN(organizationId) || organizationId <= 0) {
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

/**
 * GET /api/admin/dashboard/vendors
 * Returns all vendors + business details for manual marketplace onboarding.
 * Updates last_dashboard_view for the requesting super admin.
 */
router.get('/dashboard/vendors', requireSuperAdminAuth, async (req: Request, res: Response) => {
  const superAdminId = (req as any).superAdminId as number;

  try {
    // Fetch last_dashboard_view for this admin to compute is_new
    const adminResult = await query(
      'SELECT last_dashboard_view FROM super_admins WHERE super_admin_id = $1',
      [superAdminId]
    );
    const lastView: Date | null = adminResult.rows[0]?.last_dashboard_view ?? null;

    const result = await query(`
      SELECT
        v.vendor_id,
        v.first_name,
        v.last_name,
        v.email,
        v.phone,
        v.approval_status,
        v.created_at,
        b.business_name,
        b.business_type,
        b.business_description,
        b.business_policy,
        b.business_address,
        b.business_city,
        b.business_state,
        b.business_zip_code,
        b.business_country,
        b.business_reach,
        b.website_links,
        b.contact_email,
        b.contact_phone,
        b.current_subscription_type,
        b.subscription_amount,
        b.billing_cycle,
        v.about_you,
        v.community_contribution,
        v.mission_affiliation,
        (SELECT bm.processed_media_url FROM businessmedia bm WHERE bm.business_id = b.business_id AND bm.media_type = 'logo' AND bm.processed_media_url IS NOT NULL ORDER BY bm.media_order LIMIT 1) AS logo_processed_url,
        (SELECT bm.media_url FROM businessmedia bm WHERE bm.business_id = b.business_id AND bm.media_type = 'logo' ORDER BY bm.media_order LIMIT 1) AS logo_raw_url,
        (SELECT bm.processed_media_url FROM businessmedia bm WHERE bm.business_id = b.business_id AND bm.media_type = 'banner' AND bm.processed_media_url IS NOT NULL ORDER BY bm.media_order LIMIT 1) AS banner_processed_url,
        (SELECT json_agg(bm.media_url ORDER BY bm.media_order) FROM businessmedia bm WHERE bm.business_id = b.business_id AND bm.media_type = 'banner') AS banner_images,
        b.processed_results
      FROM vendors v
      LEFT JOIN businesses b ON b.vendor_id = v.vendor_id
      ORDER BY v.created_at DESC
    `);

    const vendors = result.rows.map(row => ({
      ...row,
      is_new: lastView === null || new Date(row.created_at) > new Date(lastView),
    }));

    return res.json({ success: true, data: vendors });

  } catch (error) {
    console.error('❌ Failed to fetch vendor dashboard data:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve vendor data' });
  }
});

/**
 * GET /api/admin/dashboard/stores
 * Returns all store administrators + organization details for manual marketplace onboarding.
 * Updates last_dashboard_view for the requesting super admin.
 */
router.get('/dashboard/stores', requireSuperAdminAuth, async (req: Request, res: Response) => {
  const superAdminId = (req as any).superAdminId as number;

  try {
    // Fetch last_dashboard_view for this admin to compute is_new
    const adminResult = await query(
      'SELECT last_dashboard_view FROM super_admins WHERE super_admin_id = $1',
      [superAdminId]
    );
    const lastView: Date | null = adminResult.rows[0]?.last_dashboard_view ?? null;

    const result = await query(`
      SELECT
        a.admin_id,
        a.first_name,
        a.last_name,
        a.email,
        a.phone_number,
        a.street_address,
        a.city,
        a.state,
        a.country,
        a.zip_code,
        a.approval_status,
        a.created_at,
        o.name AS organization_name,
        o.organization_type,
        o.description,
        o.impact,
        o.since_year,
        o.slogan,
        o.is_tax_exempt,
        o.collect_donations,
        o.donations_platform,
        o.current_subscription_type,
        o.subscription_amount,
        o.billing_cycle,
        o.parish_count,
        a.role,
        a.referred_by,
        a.referral_associate_name,
        a.social_media_platform,
        (SELECT sm.processed_media_url FROM storemedia sm WHERE sm.organization_id = o.organization_id AND sm.media_type = 'logo' AND sm.processed_media_url IS NOT NULL ORDER BY sm.media_order LIMIT 1) AS logo_processed_url,
        (SELECT sm.media_url FROM storemedia sm WHERE sm.organization_id = o.organization_id AND sm.media_type = 'logo' ORDER BY sm.media_order LIMIT 1) AS logo_raw_url,
        (SELECT sm.processed_media_url FROM storemedia sm WHERE sm.organization_id = o.organization_id AND sm.media_type = 'banner' AND sm.processed_media_url IS NOT NULL ORDER BY sm.media_order LIMIT 1) AS banner_processed_url,
        (SELECT json_agg(sm.media_url ORDER BY sm.media_order) FROM storemedia sm WHERE sm.organization_id = o.organization_id AND sm.media_type = 'banner') AS banner_images,
        o.processed_results
      FROM administrators a
      LEFT JOIN organizations o ON o.organization_id = a.organization_id
      ORDER BY a.created_at DESC
    `);

    const stores = result.rows.map(row => ({
      ...row,
      is_new: lastView === null || new Date(row.created_at) > new Date(lastView),
    }));

    return res.json({ success: true, data: stores });

  } catch (error) {
    console.error('❌ Failed to fetch store dashboard data:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve store data' });
  }
});

export default router;
