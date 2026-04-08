import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Lazily imported so the package is optional when using SMTP
let ResendClient: any = null;

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: {
    name: string;
    address: string;
  };
}

interface EmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
}

/**
 * Email Service — supports two transports:
 *  - Resend HTTP API  (when RESEND_API_KEY is set — works on Railway/any platform)
 *  - Nodemailer SMTP  (fallback — requires outbound SMTP ports, e.g. Heroku)
 */
export class EmailService {
  private static transporter: Transporter | null = null;

  private static useResend(): boolean {
    return !!process.env.RESEND_API_KEY;
  }

  // ─── Resend transport ────────────────────────────────────────────────────────

  private static async getResendClient() {
    if (!ResendClient) {
      const { Resend } = await import('resend');
      ResendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return ResendClient;
  }

  private static async sendViaResend(
    to: string | string[],
    subject: string,
    html: string
  ): Promise<EmailResult> {
    const resend = await this.getResendClient();
    const fromName = process.env.EMAIL_FROM_NAME || 'ParishMart';
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`✅ Email sent via Resend to ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`   Message ID: ${data?.id}`);

    return {
      messageId: data?.id || '',
      accepted: Array.isArray(to) ? to : [to],
      rejected: [],
      response: 'OK',
    };
  }

  private static async testResendConnection(): Promise<boolean> {
    try {
      const resend = await this.getResendClient();
      // Resend has no explicit "verify" — check by listing domains (lightweight call)
      await resend.domains.list();
      console.log('✅ Resend API connection successful');
      return true;
    } catch (error) {
      console.error('❌ Resend API connection failed:', error);
      return false;
    }
  }

  // ─── SMTP transport (Nodemailer) ─────────────────────────────────────────────

  /**
   * Create and configure SMTP transporter
   */
  private static createTransporter(): Transporter {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email configuration missing. Please check EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.');
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    });
  }

  private static getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
      (this.transporter as any).on('error', (err: Error) => {
        console.error('📧 Email transport pool error (connection dropped):', err.message);
        this.transporter = null;
      });
    }
    return this.transporter;
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /**
   * Test email connection
   */
  static async testConnection(): Promise<boolean> {
    if (this.useResend()) {
      return this.testResendConnection();
    }
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      console.log('✅ Email server connection successful');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }

  /**
   * Send email with retry logic and comprehensive error handling
   */
  static async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
    retries: number = 3
  ): Promise<EmailResult> {
    // Validate email addresses
    const recipients = Array.isArray(to) ? to : [to];
    for (const email of recipients) {
      if (!this.isValidEmail(email)) {
        throw new Error(`Invalid email address: ${email}`);
      }
    }

    if (this.useResend()) {
      return this.sendViaResend(to, subject, html);
    }

    const transporter = this.getTransporter();

    const mailOptions: EmailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'ParishMart',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || ''
      },
      to,
      subject,
      html,
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`);
        console.log(`   Message ID: ${info.messageId}`);

        return {
          messageId: info.messageId,
          accepted: info.accepted as string[],
          rejected: info.rejected as string[],
          response: info.response
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Email send attempt ${attempt} failed:`, lastError.message);

        if (this.isNonRetryableError(lastError)) {
          throw lastError;
        }

        if (attempt === retries) {
          throw new Error(`Failed to send email after ${retries} attempts: ${lastError.message}`);
        }

        const waitTime = 1000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError || new Error('Unknown email sending error');
  }

  /**
   * Send multiple emails (batch operation)
   */
  static async sendBulkEmails(
    emails: Array<{ to: string; subject: string; html: string }>,
    concurrency: number = 3
  ): Promise<Array<{ success: boolean; result?: EmailResult; error?: string }>> {
    const results: Array<{ success: boolean; result?: EmailResult; error?: string }> = [];
    
    // Process emails in batches to respect rate limits
    for (let i = 0; i < emails.length; i += concurrency) {
      const batch = emails.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (email) => {
        try {
          const result = await this.sendEmail(email.to, email.subject, email.html);
          return { success: true, result };
        } catch (error) {
          console.error(`Failed to send email to ${email.to}:`, error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect Gmail rate limits
      if (i + concurrency < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Validate email address format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if error should not be retried
   */
  private static isNonRetryableError(error: Error): boolean {
    const nonRetryableMessages = [
      'Invalid login',
      'Authentication failed',
      'Username and Password not accepted',
      'Invalid email address',
      'Recipient address rejected'
    ];

    return nonRetryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }

  /**
   * Initialize email service and test connection
   */
  static async initialize(): Promise<void> {
    console.log('🔧 Initializing email service...');
    
    try {
      const isConnected = await this.testConnection();
      if (isConnected) {
        console.log('📧 Email service ready');
      } else {
        console.warn('⚠️  Email service unavailable - emails will not be sent');
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      throw error;
    }
  }

  /**
   * Close transporter connections
   */
  static async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
      console.log('📧 Email service connections closed');
    }
  }

  /**
   * Get email service health status
   */
  static async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    lastTestedAt: Date;
  }> {
    const lastTestedAt = new Date();
    
    try {
      const isHealthy = await this.testConnection();
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'Email service is operational' : 'Email service is not responding',
        lastTestedAt
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        lastTestedAt
      };
    }
  }
} 