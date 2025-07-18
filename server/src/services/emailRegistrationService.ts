import { EmailService } from './emailService';
import { EmailTemplates } from '../utils/emailTemplates';
import { TokenUtils } from '../utils/tokenUtils';

interface VendorEmailData {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  subscriptionType: string;
  businessType?: string;
  parishAffiliation?: string;
  businessDescription?: string;
  reach?: string;
  contactForOpportunities?: boolean;
}

interface StoreEmailData {
  adminFirstName: string;
  adminLastName: string;
  organizationName: string;
  organizationType: string;
  email: string;
  subscriptionTier: string;
  description?: string;
  impact?: string;
  foundingYear?: string;
  slogan?: string;
  hasTaxExemptStatus?: string;
  collectsDonations?: boolean;
  donationPlatform?: string;
}

/**
 * Service for handling all registration-related email notifications
 */
export class EmailRegistrationService {
  
  /**
   * Send vendor confirmation email and admin review email
   */
  static async sendVendorRegistrationEmails(
    vendorData: VendorEmailData,
    vendorId: number
  ): Promise<{ userEmailSent: boolean; adminEmailSent: boolean }> {
    let userEmailSent = false;
    let adminEmailSent = false;

    try {
      // 1. Send confirmation email to vendor
      console.log(`📧 Sending vendor confirmation email to ${vendorData.email}`);
      
      const confirmationHtml = EmailTemplates.renderVendorConfirmation(vendorData);
      
      await EmailService.sendEmail(
        vendorData.email,
        'Registration Received - ParishMart',
        confirmationHtml
      );
      
      userEmailSent = true;
      console.log(`✅ Vendor confirmation email sent to ${vendorData.email}`);

    } catch (error) {
      console.error(`❌ Failed to send vendor confirmation email:`, error);
    }

    try {
      // 2. Generate approval tokens  
      const tokens = await TokenUtils.createApprovalTokens('vendor', vendorId);
      
      // 3. Send admin review email
      const adminEmail = process.env.ADMIN_EMAIL_ADDRESS;
      if (!adminEmail) {
        throw new Error('ADMIN_EMAIL_ADDRESS not configured');
      }

      console.log(`📧 Sending admin review email for vendor ${vendorData.businessName}`);
      
      const adminReviewHtml = EmailTemplates.renderAdminVendorReview(
        vendorData,
        tokens.approveToken,
        tokens.rejectToken
      );
      
      await EmailService.sendEmail(
        adminEmail,
        `New Vendor Registration - Action Required`,
        adminReviewHtml
      );
      
      adminEmailSent = true;
      console.log(`✅ Admin review email sent for vendor ${vendorData.businessName}`);

    } catch (error) {
      console.error(`❌ Failed to send admin review email:`, error);
    }

    return { userEmailSent, adminEmailSent };
  }

  /**
   * Send store confirmation email and admin review email
   */
  static async sendStoreRegistrationEmails(
    storeData: StoreEmailData,
    adminId: number
  ): Promise<{ userEmailSent: boolean; adminEmailSent: boolean }> {
    let userEmailSent = false;
    let adminEmailSent = false;

    try {
      // 1. Send confirmation email to store administrator
      console.log(`📧 Sending store confirmation email to ${storeData.email}`);
      
      const confirmationHtml = EmailTemplates.renderStoreConfirmation(storeData);
      
      await EmailService.sendEmail(
        storeData.email,
        'Store Registration Received - ParishMart',
        confirmationHtml
      );
      
      userEmailSent = true;
      console.log(`✅ Store confirmation email sent to ${storeData.email}`);

    } catch (error) {
      console.error(`❌ Failed to send store confirmation email:`, error);
    }

    try {
      // 2. Generate approval tokens
      const tokens = await TokenUtils.createApprovalTokens('administrator', adminId);
      
      // 3. Send admin review email
      const adminEmail = process.env.ADMIN_EMAIL_ADDRESS;
      if (!adminEmail) {
        throw new Error('ADMIN_EMAIL_ADDRESS not configured');
      }

      console.log(`📧 Sending admin review email for store ${storeData.organizationName}`);
      
      const adminReviewHtml = EmailTemplates.renderAdminStoreReview(
        storeData,
        tokens.approveToken,
        tokens.rejectToken
      );
      
      await EmailService.sendEmail(
        adminEmail,
        `New Store Registration - Action Required`,
        adminReviewHtml
      );
      
      adminEmailSent = true;
      console.log(`✅ Admin review email sent for store ${storeData.organizationName}`);

    } catch (error) {
      console.error(`❌ Failed to send admin review email:`, error);
    }

    return { userEmailSent, adminEmailSent };
  }

  /**
   * Send test email to verify email configuration
   */
  static async sendTestEmail(
    toEmail: string,
    testType: 'vendor' | 'store' = 'vendor'
  ): Promise<boolean> {
    try {
      const testData = testType === 'vendor' 
        ? {
            firstName: 'Test',
            lastName: 'User',
            businessName: 'Test Business',
            email: toEmail,
            phone: '555-0123',
            subscriptionType: 'basic',
            businessType: 'product',
            parishAffiliation: 'Test Parish',
            reach: 'local'
          }
        : {
            adminFirstName: 'Test',
            adminLastName: 'Admin',
            organizationName: 'Test Organization',
            organizationType: 'parish',
            email: toEmail,
            subscriptionTier: 'basic',
            description: 'Test organization for email testing',
            impact: 'Community testing',
            foundingYear: '2024'
          };

      const html = testType === 'vendor'
        ? EmailTemplates.renderVendorConfirmation(testData as VendorEmailData)
        : EmailTemplates.renderStoreConfirmation(testData as StoreEmailData);

      await EmailService.sendEmail(
        toEmail,
        `ParishMart Email Test - ${testType === 'vendor' ? 'Vendor' : 'Store'} Registration`,
        html
      );

      console.log(`✅ Test email sent successfully to ${toEmail}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to send test email:`, error);
      return false;
    }
  }

  /**
   * Get email service health status
   */
  static async getEmailServiceHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    lastTestedAt: Date;
  }> {
    try {
      return await EmailService.getHealthStatus();
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Email service unavailable',
        lastTestedAt: new Date()
      };
    }
  }
} 