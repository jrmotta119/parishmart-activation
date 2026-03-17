import fs from 'fs';
import path from 'path';

function vendorTierName(tier: string): string {
  const map: Record<string, string> = { tier1: 'Basic Listing', tier2: 'Commerce', tier3: 'Featured Partner' };
  return map[tier] ?? tier;
}

function storeTierName(tier: string): string {
  const map: Record<string, string> = { tier1: 'Cause Plan', tier2: 'Parish Growth Plan', tier3: 'Diocese Network Plan' };
  return map[tier] ?? tier;
}

interface TemplateData {
  [key: string]: string | number | boolean | undefined;
}

interface VendorData {
  firstName: string;
  lastName: string;
  fullName?: string;
  businessName: string;
  email: string;
  phone: string;
  subscriptionType: string;
  businessType?: string;
  parishAffiliation?: string;
  businessDescription?: string;
  reach?: string;
  contactForOpportunities?: boolean;
  logoUrl?: string;
  bannerUrl?: string;
}

interface StoreData {
  adminFirstName: string;
  adminLastName: string;
  adminFullName?: string;
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
  logoUrl?: string;
  bannerUrl?: string;
}

/**
 * Email Template Renderer
 * Handles dynamic content injection into HTML email templates
 */
export class EmailTemplates {
  private static templateCache: Map<string, string> = new Map();
  
  /**
   * Load and cache template from file system
   */
  private static loadTemplate(templateName: string): string {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
      const template = fs.readFileSync(templatePath, 'utf8');
      
      // Cache for future use
      this.templateCache.set(templateName, template);
      return template;
    } catch (error) {
      console.error(`❌ Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  /**
   * Render template with data interpolation
   */
  private static renderTemplate(templateName: string, data: TemplateData): string {
    let template = this.loadTemplate(templateName);
    
    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      const value = data[key] !== undefined ? String(data[key]) : '';
      template = template.replace(placeholder, value);
    });

    // Replace any remaining placeholders with empty strings
    template = template.replace(/{{[^}]+}}/g, '');
    
    return template;
  }

  /**
   * Get common template data (used across all templates)
   */
  private static getCommonData(): TemplateData {
    return {
      year: new Date().getFullYear(),
      supportEmail: process.env.SUPPORT_EMAIL_ADDRESS || 'support@parishmart.com',
      companyName: 'ParishMart',
      baseUrl: process.env.BASE_URL || 'http://localhost:3001',
      logoUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/images/parishmart-logo.png`,
      marketplaceUrl: 'https://shop.parishmart.com',
      aboutUrl: 'https://home.parishmart.com/about-us',
    };
  }

  /**
   * Render vendor confirmation email
   */
  static renderVendorConfirmation(userData: VendorData): string {
    const fullName = userData.fullName || `${userData.firstName} ${userData.lastName}`;
    
    const templateData: TemplateData = {
      ...this.getCommonData(),
      userName: fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessName: userData.businessName,
      email: userData.email,
      subscriptionType: vendorTierName(userData.subscriptionType),
      businessType: userData.businessType || 'N/A',
      parishAffiliation: userData.parishAffiliation || 'Not specified',
      reach: userData.reach || 'Not specified'
    };

    return this.renderTemplate('vendor-confirmation', templateData);
  }

  /**
   * Render store confirmation email
   */
  static renderStoreConfirmation(userData: StoreData): string {
    const adminFullName = userData.adminFullName || `${userData.adminFirstName} ${userData.adminLastName}`;
    
    const templateData: TemplateData = {
      ...this.getCommonData(),
      adminName: adminFullName,
      adminFirstName: userData.adminFirstName,
      adminLastName: userData.adminLastName,
      organizationName: userData.organizationName,
      organizationType: userData.organizationType,
      email: userData.email,
      subscriptionTier: storeTierName(userData.subscriptionTier),
      description: userData.description || 'Not provided',
      impact: userData.impact || 'Not specified',
      foundingYear: userData.foundingYear || 'Not specified',
      slogan: userData.slogan || 'Not provided'
    };

    return this.renderTemplate('store-confirmation', templateData);
  }

  /**
   * Render admin vendor review email
   */
  static renderAdminVendorReview(userData: VendorData, approvalToken: string, rejectionToken: string): string {
    const fullName = userData.fullName || `${userData.firstName} ${userData.lastName}`;

    const templateData: TemplateData = {
      ...this.getCommonData(),
      userName: fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessName: userData.businessName,
      email: userData.email,
      phone: userData.phone,
      subscriptionType: vendorTierName(userData.subscriptionType),
      businessType: userData.businessType || 'N/A',
      businessDescription: userData.businessDescription || 'Not provided',
      parishAffiliation: userData.parishAffiliation || 'Not specified',
      reach: userData.reach || 'Not specified',
      contactForOpportunities: userData.contactForOpportunities ? 'Yes' : 'No',
      logoUrl: userData.logoUrl || '',
      bannerUrl: userData.bannerUrl || '',
      approveUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/api/admin/approve/${approvalToken}`,
      rejectUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/api/admin/reject/${rejectionToken}`,
      tokenExpiration: '7 days'
    };

    return this.renderTemplate('admin-vendor-review', templateData);
  }

  /**
   * Render admin store review email
   */
  static renderAdminStoreReview(userData: StoreData, approvalToken: string, rejectionToken: string): string {
    const adminFullName = userData.adminFullName || `${userData.adminFirstName} ${userData.adminLastName}`;

    const templateData: TemplateData = {
      ...this.getCommonData(),
      adminName: adminFullName,
      adminFirstName: userData.adminFirstName,
      adminLastName: userData.adminLastName,
      organizationName: userData.organizationName,
      organizationType: userData.organizationType,
      email: userData.email,
      subscriptionTier: storeTierName(userData.subscriptionTier),
      description: userData.description || 'Not provided',
      impact: userData.impact || 'Not specified',
      foundingYear: userData.foundingYear || 'Not specified',
      slogan: userData.slogan || 'Not provided',
      hasTaxExemptStatus: userData.hasTaxExemptStatus || 'Not specified',
      collectsDonations: userData.collectsDonations ? 'Yes' : 'No',
      donationPlatform: userData.donationPlatform || 'Not applicable',
      logoUrl: userData.logoUrl || '',
      bannerUrl: userData.bannerUrl || '',
      approveUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/api/admin/approve/${approvalToken}`,
      rejectUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/api/admin/reject/${rejectionToken}`,
      tokenExpiration: '7 days'
    };

    return this.renderTemplate('admin-store-review', templateData);
  }

  /**
   * Render vendor approved email
   */
  static renderVendorApproved(userData: VendorData): string {
    const fullName = userData.fullName || `${userData.firstName} ${userData.lastName}`;

    const templateData: TemplateData = {
      ...this.getCommonData(),
      userName: fullName,
      firstName: userData.firstName,
      businessName: userData.businessName,
      email: userData.email,
      subscriptionType: vendorTierName(userData.subscriptionType),
    };

    return this.renderTemplate('vendor-approved', templateData);
  }

  /**
   * Render store approved email
   */
  static renderStoreApproved(userData: StoreData): string {
    const adminFullName = userData.adminFullName || `${userData.adminFirstName} ${userData.adminLastName}`;

    const templateData: TemplateData = {
      ...this.getCommonData(),
      adminName: adminFullName,
      adminFirstName: userData.adminFirstName,
      organizationName: userData.organizationName,
      email: userData.email,
      subscriptionTier: storeTierName(userData.subscriptionTier),
      dioceseNote: userData.subscriptionTier === 'tier3'
        ? ' Additionally, a member of our team may reach out to you to help establish and connect the parishes under your diocese.'
        : '',
    };

    return this.renderTemplate('store-approved', templateData);
  }

  /**
   * Render vendor rejected email
   */
  static renderVendorRejected(userData: VendorData): string {
    const fullName = userData.fullName || `${userData.firstName} ${userData.lastName}`;
    
    const templateData: TemplateData = {
      ...this.getCommonData(),
      userName: fullName,
      firstName: userData.firstName,
      businessName: userData.businessName,
      email: userData.email,
      reapplyUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/vendor/register`,
      contactUrl: 'mailto:info@parishmart.com'
    };

    return this.renderTemplate('vendor-rejected', templateData);
  }

  /**
   * Render store rejected email
   */
  static renderStoreRejected(userData: StoreData): string {
    const adminFullName = userData.adminFullName || `${userData.adminFirstName} ${userData.adminLastName}`;
    
    const templateData: TemplateData = {
      ...this.getCommonData(),
      adminName: adminFullName,
      adminFirstName: userData.adminFirstName,
      organizationName: userData.organizationName,
      email: userData.email,
      reapplyUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/store/register`,
      contactUrl: 'mailto:info@parishmart.com'
    };

    return this.renderTemplate('store-rejected', templateData);
  }

  /**
   * Clear template cache (useful for development)
   */
  static clearCache(): void {
    this.templateCache.clear();
    console.log('📧 Email template cache cleared');
  }

  /**
   * Preload all templates into cache
   */
  static async preloadTemplates(): Promise<void> {
    const templateNames = [
      'vendor-confirmation',
      'store-confirmation',
      'admin-vendor-review',
      'admin-store-review',
      'vendor-approved',
      'store-approved',
      'vendor-rejected',
      'store-rejected'
    ];

    try {
      for (const templateName of templateNames) {
        this.loadTemplate(templateName);
      }
      console.log('📧 All email templates preloaded successfully');
    } catch (error) {
      console.error('❌ Failed to preload email templates:', error);
      throw error;
    }
  }

  /**
   * Validate that all required templates exist
   */
  static validateTemplates(): boolean {
    const requiredTemplates = [
      'vendor-confirmation',
      'store-confirmation',
      'admin-vendor-review',
      'admin-store-review',
      'vendor-approved',
      'store-approved',
      'vendor-rejected',
      'store-rejected'
    ];

    let allValid = true;

    for (const templateName of requiredTemplates) {
      try {
        this.loadTemplate(templateName);
        console.log(`✅ Template ${templateName} found`);
      } catch (error) {
        console.error(`❌ Template ${templateName} missing`);
        allValid = false;
      }
    }

    return allValid;
  }
} 