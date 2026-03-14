import crypto from 'crypto';
import { query, getClient } from '../db/connection';

export interface ApprovalToken {
  token: string;
  user_type: 'vendor' | 'administrator';
  user_id: number;
  action_type: 'approve' | 'reject';
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserData {
  userData?: any;
  approval_status?: string;
}

interface ValidatedTokenResult {
  isValid: boolean;
  user_type?: 'vendor' | 'administrator';
  user_id?: number;
  action_type?: 'approve' | 'reject';
}

/**
 * Utility class for managing approval tokens
 * Handles secure token generation, validation, and database operations
 */
export class TokenUtils {
  /**
   * Generate a cryptographically secure random token
   */
  private static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create approval tokens for both approve and reject actions
   */
  static async createApprovalTokens(
    userType: 'vendor' | 'administrator',
    userId: number,
    createdBy: number = 1, // Default system admin ID  
    expirationHours: number = 168 // 7 days default
  ): Promise<{ approveToken: string; rejectToken: string }> {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Generate secure tokens
      const approveToken = this.generateSecureToken();
      const rejectToken = this.generateSecureToken();
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expirationHours);

      // Insert approve token (using existing table structure)
      await client.query(`
        INSERT INTO approval_tokens (
          token, user_type, user_id, action_type, created_by, expires_at, is_used, created_at
        ) VALUES ($1, $2, $3, 'approve', $4, $5, false, NOW())
      `, [approveToken, userType, userId, createdBy, expiresAt]);

      // Insert reject token (using existing table structure)
      await client.query(`
        INSERT INTO approval_tokens (
          token, user_type, user_id, action_type, created_by, expires_at, is_used, created_at
        ) VALUES ($1, $2, $3, 'reject', $4, $5, false, NOW())
      `, [rejectToken, userType, userId, createdBy, expiresAt]);

      await client.query('COMMIT');
      
      console.log(`✅ Created approval tokens for ${userType} ID ${userId}`);
      
      return {
        approveToken,
        rejectToken
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to create approval tokens:', error);
      throw new Error('Failed to generate approval tokens');
    } finally {
      client.release();
    }
  }

  /**
   * Validate token and get associated data
   */
  static async validateToken(token: string): Promise<ValidatedTokenResult> {
    try {
      const result = await query(`
        SELECT user_type, user_id, action_type, expires_at, is_used
        FROM approval_tokens 
        WHERE token = $1
      `, [token]);

      if (result.rows.length === 0) {
        return { isValid: false };
      }

      const tokenData = result.rows[0];

      // Check if token is already used
      if (tokenData.is_used) {
        return { isValid: false };
      }

      // Check if token is expired
      if (new Date() > new Date(tokenData.expires_at)) {
        return { isValid: false };
      }

      return {
        isValid: true,
        user_type: tokenData.user_type,
        user_id: tokenData.user_id,
        action_type: tokenData.action_type
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { isValid: false };
    }
  }

  /**
   * Get user data by token
   */
  static async getUserByToken(token: string): Promise<UserData | null> {
    try {
      const validation = await this.validateToken(token);
      
      if (!validation.isValid || !validation.user_type || !validation.user_id) {
        return null;
      }

      const { user_type, user_id } = validation;
      let userData = null;

      if (user_type === 'vendor') {
        const result = await query(`
          SELECT
            v.*,
            b.business_name,
            b.business_description,
            b.business_type,
            b.business_policy,
            b.business_address,
            b.business_city,
            b.business_state,
            b.business_country,
            b.business_zip_code,
            b.business_reach,
            b.website_links,
            b.contact_email,
            b.contact_phone,
            b.current_subscription_type
          FROM vendors v
          LEFT JOIN businesses b ON v.vendor_id = b.vendor_id
          WHERE v.vendor_id = $1
        `, [user_id]);
        
        userData = result.rows[0] || null;
      } else if (user_type === 'administrator') {
        const result = await query(`
          SELECT
            a.*,
            o.name as organization_name,
            o.organization_type,
            o.description,
            o.impact,
            o.since_year,
            o.slogan,
            o.is_tax_exempt,
            o.collect_donations,
            o.donations_platform,
            o.current_subscription_type
          FROM administrators a
          LEFT JOIN organizations o ON a.organization_id = o.organization_id
          WHERE a.admin_id = $1
        `, [user_id]);
        
        userData = result.rows[0] || null;
      }

      return { userData };

    } catch (error) {
      console.error('❌ Error getting user data by token:', error);
      return null;
    }
  }

  /**
   * Fetch user data directly by type and ID without re-validating a token.
   * Use this after claimToken() so the already-marked token doesn't block the lookup.
   */
  static async getUserById(userType: 'vendor' | 'administrator', userId: number): Promise<UserData | null> {
    try {
      let userData = null;

      if (userType === 'vendor') {
        const result = await query(`
          SELECT
            v.*,
            b.business_name,
            b.business_description,
            b.business_type,
            b.business_policy,
            b.business_address,
            b.business_city,
            b.business_state,
            b.business_country,
            b.business_zip_code,
            b.business_reach,
            b.website_links,
            b.contact_email,
            b.contact_phone,
            b.current_subscription_type
          FROM vendors v
          LEFT JOIN businesses b ON v.vendor_id = b.vendor_id
          WHERE v.vendor_id = $1
        `, [userId]);
        userData = result.rows[0] || null;
      } else if (userType === 'administrator') {
        const result = await query(`
          SELECT
            a.*,
            o.name as organization_name,
            o.organization_type,
            o.description,
            o.impact,
            o.since_year,
            o.slogan,
            o.is_tax_exempt,
            o.collect_donations,
            o.donations_platform,
            o.current_subscription_type
          FROM administrators a
          LEFT JOIN organizations o ON a.organization_id = o.organization_id
          WHERE a.admin_id = $1
        `, [userId]);
        userData = result.rows[0] || null;
      }

      return userData ? { userData } : null;

    } catch (error) {
      console.error('❌ Error fetching user data by ID:', error);
      return null;
    }
  }

  /**
   * Atomically claim a token: validates and marks it as used in a single UPDATE.
   * Returns token data if successfully claimed, null if already used/expired/missing.
   * Eliminates the race condition between validateToken() and markTokenAsUsed().
   */
  static async claimToken(token: string): Promise<ValidatedTokenResult | null> {
    try {
      const result = await query(`
        UPDATE approval_tokens
        SET is_used = true, used_at = NOW()
        WHERE token = $1
          AND is_used = false
          AND expires_at > NOW()
        RETURNING user_type, user_id, action_type
      `, [token]);

      if (result.rows.length === 0) {
        return null; // Already used, expired, or not found
      }

      const row = result.rows[0];
      return {
        isValid: true,
        user_type: row.user_type,
        user_id: row.user_id,
        action_type: row.action_type,
      };
    } catch (error) {
      console.error('❌ Token claim error:', error);
      return null;
    }
  }

  /**
   * Mark token as used
   */
  static async markTokenAsUsed(token: string, usedBy?: number): Promise<boolean> {
    try {
      const result = await query(`
        UPDATE approval_tokens 
        SET is_used = true, used_at = NOW(), used_by = $2
        WHERE token = $1 AND is_used = false
        RETURNING token_id
      `, [token, usedBy || null]);

      return result.rows.length > 0;

    } catch (error) {
      console.error('❌ Error marking token as used:', error);
      return false;
    }
  }

  /**
   * Get token statistics
   */
  static async getTokenStats(): Promise<{
    total: number;
    used: number;
    expired: number;
    active: number;
  }> {
    try {
      const result = await query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_used THEN 1 ELSE 0 END) as used,
          SUM(CASE WHEN expires_at < NOW() AND NOT is_used THEN 1 ELSE 0 END) as expired,
          SUM(CASE WHEN expires_at >= NOW() AND NOT is_used THEN 1 ELSE 0 END) as active
        FROM approval_tokens
      `);

      const stats = result.rows[0];
      return {
        total: parseInt(stats.total) || 0,
        used: parseInt(stats.used) || 0,
        expired: parseInt(stats.expired) || 0,
        active: parseInt(stats.active) || 0
      };

    } catch (error) {
      console.error('❌ Error getting token stats:', error);
      return { total: 0, used: 0, expired: 0, active: 0 };
    }
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await query(`
        DELETE FROM approval_tokens 
        WHERE expires_at < NOW() AND is_used = false
        RETURNING token_id
      `);

      const deletedCount = result.rows.length;
      console.log(`🧹 Cleaned up ${deletedCount} expired tokens`);
      
      return deletedCount;

    } catch (error) {
      console.error('❌ Error cleaning up expired tokens:', error);
      return 0;
    }
  }

  /**
   * Invalidate all tokens for a specific user
   */
  static async invalidateUserTokens(userType: 'vendor' | 'administrator', userId: number): Promise<boolean> {
    try {
      await query(`
        UPDATE approval_tokens 
        SET is_used = true, used_at = NOW()
        WHERE user_type = $1 AND user_id = $2 AND is_used = false
      `, [userType, userId]);

      console.log(`🚫 Invalidated all tokens for ${userType} ${userId}`);
      return true;

    } catch (error) {
      console.error('❌ Error invalidating user tokens:', error);
      return false;
    }
  }
} 