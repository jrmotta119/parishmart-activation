import express, { Request, Response } from 'express';
import { TokenUtils } from '../utils/tokenUtils';
import { EmailService } from '../services/emailService';
import { EmailTemplates } from '../utils/emailTemplates';
import { query, getClient } from '../db/connection';
import { HTTP_STATUS } from '@parishmart/shared';
import rateLimit from 'express-rate-limit';

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
            <a href="#" onclick="window.close()" class="button">Close Tab</a>
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
 * Approve vendor using database function (simplified)
 */
async function activateVendorApproval(client: any, vendorId: number, userData: any, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Approving vendor with ID: ${vendorId}`);

    // Use the database function to approve vendor
    await client.query(`
      SELECT approve_vendor($1, $2, $3, $4, $5)
    `, [
      vendorId,
      'admin@system', // performed_by 
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Vendor approved successfully with ID: ${vendorId}`);

  } catch (error) {
    console.error(`❌ Failed to approve vendor:`, error);
    throw error;
  }
}

/**
 * Approve administrator using database function (simplified)
 */
async function activateStoreApproval(client: any, adminId: number, userData: any, tokenUsed?: string, ipAddress?: string, userAgent?: string) {
  try {
    console.log(`🔄 Approving administrator with ID: ${adminId}`);

    // Use the database function to approve administrator only
    await client.query(`
      SELECT approve_admin($1, $2, $3, $4, $5)
    `, [
      adminId,
      'admin@system', // performed_by
      tokenUsed || null,
      ipAddress || null,
      userAgent || null
    ]);

    console.log(`✅ Administrator approved successfully with ID: ${adminId}`);

  } catch (error) {
    console.error(`❌ Failed to approve administrator:`, error);
    throw error;
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

export default router; 