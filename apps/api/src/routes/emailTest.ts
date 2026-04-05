import express, { Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { EmailRegistrationService } from '../services/emailRegistrationService';
import { EmailTemplates } from '../utils/emailTemplates';
import { HTTP_STATUS } from '@parishmart/shared';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for email testing
const emailTestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 email tests per hour
  message: 'Too many email test requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(emailTestLimiter);

// Block all email test routes in production
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }
  next();
});

/**
 * POST /api/email-test/connection
 * Test email server connection
 */
router.post('/connection', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Testing email connection...');
    
    const health = await EmailService.getHealthStatus();
    
    if (health.status === 'healthy') {
      res.json({
        success: true,
        message: 'Email connection successful',
        details: health
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Email connection failed',
        details: health
      });
    }
  } catch (error) {
    console.error('❌ Email connection test failed:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Email connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/email-test/send
 * Send test email
 */
router.post('/send', async (req: Request, res: Response) => {
  const { 
    toEmail, 
    templateType = 'vendor-confirmation',
    testData 
  } = req.body;

  if (!toEmail || !toEmail.includes('@')) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Valid email address is required'
    });
  }

  try {
    console.log(`📧 Sending test email to ${toEmail} with template: ${templateType}`);
    
    let emailHtml: string;
    let subject: string;

    // Generate test data based on template type
    const defaultVendorData = {
      firstName: testData?.firstName || 'John',
      lastName: testData?.lastName || 'Doe',
      businessName: testData?.businessName || 'Test Business LLC',
      email: toEmail,
      phone: testData?.phone || '(555) 123-4567',
      subscriptionType: testData?.subscriptionType || 'basic',
      businessType: 'product',
      parishAffiliation: 'St. Mary\'s Parish',
      businessDescription: 'A test business for email verification',
      reach: 'local',
      contactForOpportunities: true
    };

    const defaultStoreData = {
      adminFirstName: testData?.adminFirstName || 'Jane',
      adminLastName: testData?.adminLastName || 'Smith',
      organizationName: testData?.organizationName || 'Test Faith Organization',
      organizationType: testData?.organizationType || 'parish',
      email: toEmail,
      subscriptionTier: testData?.subscriptionTier || 'basic',
      description: 'A test faith-based organization for email verification',
      impact: 'Supporting our community through faith-based initiatives',
      foundingYear: '2020',
      slogan: 'Faith in Action',
      hasTaxExemptStatus: 'yes',
      collectsDonations: true,
      donationPlatform: 'tithe.ly'
    };

    // Generate email based on template type
    switch (templateType) {
      case 'vendor-confirmation':
        emailHtml = EmailTemplates.renderVendorConfirmation(defaultVendorData);
        subject = 'TEST: Registration Received - ParishMart';
        break;
        
      case 'store-confirmation':
        emailHtml = EmailTemplates.renderStoreConfirmation(defaultStoreData);
        subject = 'TEST: Store Registration Received - ParishMart';
        break;
        
      case 'vendor-approved':
        emailHtml = EmailTemplates.renderVendorApproved(defaultVendorData);
        subject = 'TEST: Welcome to ParishMart - Account Approved!';
        break;
        
      case 'store-approved':
        emailHtml = EmailTemplates.renderStoreApproved(defaultStoreData);
        subject = 'TEST: Welcome to ParishMart - Store Approved!';
        break;
        
      case 'vendor-rejected':
        emailHtml = EmailTemplates.renderVendorRejected(defaultVendorData);
        subject = 'TEST: ParishMart Application Update';
        break;
        
      case 'store-rejected':
        emailHtml = EmailTemplates.renderStoreRejected(defaultStoreData);
        subject = 'TEST: ParishMart Store Application Update';
        break;
        
      case 'admin-vendor-review':
        emailHtml = EmailTemplates.renderAdminVendorReview(
          defaultVendorData,
          'test-approve-token-123',
          'test-reject-token-123'
        );
        subject = 'TEST: New Vendor Registration - Action Required';
        break;
        
      case 'admin-store-review':
        emailHtml = EmailTemplates.renderAdminStoreReview(
          defaultStoreData,
          'test-approve-token-123',
          'test-reject-token-123'
        );
        subject = 'TEST: New Store Registration - Action Required';
        break;
        
      default:
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid template type',
          availableTemplates: [
            'vendor-confirmation',
            'store-confirmation', 
            'vendor-approved',
            'store-approved',
            'vendor-rejected',
            'store-rejected',
            'admin-vendor-review',
            'admin-store-review'
          ]
        });
    }

    // Send test email
    await EmailService.sendEmail(toEmail, subject, emailHtml);
    
    console.log(`✅ Test email sent successfully to ${toEmail}`);
    
    res.json({
      success: true,
      message: `Test email sent successfully to ${toEmail}`,
      templateType,
      subject
    });

  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/email-test/templates
 * List available email templates
 */
router.get('/templates', (req: Request, res: Response) => {
  res.json({
    success: true,
    templates: [
      {
        type: 'vendor-confirmation',
        description: 'Vendor registration confirmation email',
        recipient: 'Vendor applicant'
      },
      {
        type: 'store-confirmation',
        description: 'Store registration confirmation email',
        recipient: 'Store administrator'
      },
      {
        type: 'vendor-approved',
        description: 'Vendor approval notification email',
        recipient: 'Approved vendor'
      },
      {
        type: 'store-approved',
        description: 'Store approval notification email',
        recipient: 'Approved store administrator'
      },
      {
        type: 'vendor-rejected',
        description: 'Vendor rejection notification email',
        recipient: 'Rejected vendor'
      },
      {
        type: 'store-rejected',
        description: 'Store rejection notification email',
        recipient: 'Rejected store administrator'
      },
      {
        type: 'admin-vendor-review',
        description: 'Admin review email for vendor applications',
        recipient: 'Platform administrator'
      },
      {
        type: 'admin-store-review',
        description: 'Admin review email for store applications',
        recipient: 'Platform administrator'
      }
    ]
  });
});

/**
 * GET /api/email-test/config
 * Get email configuration status (without sensitive data) — dev only
 */
router.get('/config', (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }
  const config = {
    emailHost: process.env.EMAIL_HOST || 'Not configured',
    emailPort: process.env.EMAIL_PORT || 'Not configured',
    emailSecure: process.env.EMAIL_SECURE || 'Not configured',
    emailUser: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    emailPass: process.env.EMAIL_PASS ? 'Configured' : 'Not configured',
    fromName: process.env.EMAIL_FROM_NAME || 'ParishMart',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@parishmart.com',
    adminEmail: process.env.ADMIN_EMAIL_ADDRESS ? 'Configured' : 'Not configured',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@parishmart.com'
  };

  const missingConfig = Object.entries(config)
    .filter(([key, value]) => value === 'Not configured')
    .map(([key]) => key);

  res.json({
    success: true,
    configuration: config,
    missingConfiguration: missingConfig,
    isFullyConfigured: missingConfig.length === 0
  });
});

export default router; 