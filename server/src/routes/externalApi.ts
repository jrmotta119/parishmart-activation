/**
 * External API — Seller Status Endpoints
 * Called by the marketplace to query vendor/store status.
 *
 * All routes require HMAC-SHA256 authentication via externalApiAuth middleware.
 *
 * marketplace_status values:
 *   "pending"  — not yet approved (or rejected)
 *   "approved" — approved by admin, not yet synced to marketplace
 *   "synced"   — successfully pushed to marketplace (marketplace_synced_at is set)
 */

import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db/connection';
import { externalApiAuth } from '../middleware/externalApiAuth';
import { HTTP_STATUS } from '@parishmart/shared';

const router = express.Router();

const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(externalApiLimiter);
router.use(externalApiAuth);

// ─── Helpers ─────────────────────────────────────────────────────────────────

type MarketplaceStatus = 'pending' | 'approved' | 'synced';

function deriveMarketplaceStatus(
  approvalStatus: string,
  syncedAt: string | null
): MarketplaceStatus {
  if (syncedAt !== null)             return 'synced';
  if (approvalStatus === 'approved') return 'approved';
  return 'pending';
}

function shapeVendor(row: any) {
  return {
    id:                    row.id,
    type:                  'vendor' as const,
    name:                  row.name,
    email:                 row.email,
    subscription_type:     row.subscription_type,
    approval_status:       row.approval_status,
    marketplace_status:    deriveMarketplaceStatus(row.approval_status, row.marketplace_synced_at),
    approved_at:           row.approved_at,
    marketplace_synced_at: row.marketplace_synced_at,
    logo_url:              row.logo_url   ?? null,
    banner_url:            row.banner_url ?? null,
  };
}

function shapeStore(row: any) {
  return {
    id:                    row.id,
    type:                  'store' as const,
    name:                  row.name,
    email:                 row.email,
    subscription_type:     row.subscription_type,
    approval_status:       row.approval_status,
    marketplace_status:    deriveMarketplaceStatus(row.approval_status, row.marketplace_synced_at),
    approved_at:           row.approved_at,
    marketplace_synced_at: row.marketplace_synced_at,
    logo_url:              row.logo_url   ?? null,
    banner_url:            row.banner_url ?? null,
  };
}

// ─── SQL ─────────────────────────────────────────────────────────────────────

const VENDOR_SELECT = `
  SELECT
    v.vendor_id                                 AS id,
    b.business_name                             AS name,
    v.email,
    b.current_subscription_type                 AS subscription_type,
    v.approval_status,
    v.created_at                                AS approved_at,
    b.marketplace_synced_at,
    (SELECT bm.processed_media_url FROM businessmedia bm
     WHERE bm.business_id = b.business_id AND bm.media_type = 'logo'
       AND bm.processed_media_url IS NOT NULL
     ORDER BY bm.media_order LIMIT 1)           AS logo_url,
    (SELECT bm.processed_media_url FROM businessmedia bm
     WHERE bm.business_id = b.business_id AND bm.media_type = 'banner'
       AND bm.processed_media_url IS NOT NULL
     ORDER BY bm.media_order LIMIT 1)           AS banner_url
  FROM vendors v
  LEFT JOIN businesses b ON b.vendor_id = v.vendor_id
`;

const STORE_SELECT = `
  SELECT
    o.organization_id                           AS id,
    o.name,
    a.email,
    o.current_subscription_type                 AS subscription_type,
    a.approval_status,
    a.created_at                                AS approved_at,
    o.marketplace_synced_at,
    (SELECT sm.processed_media_url FROM storemedia sm
     WHERE sm.organization_id = o.organization_id AND sm.media_type = 'logo'
       AND sm.processed_media_url IS NOT NULL
     ORDER BY sm.media_order LIMIT 1)           AS logo_url,
    (SELECT sm.processed_media_url FROM storemedia sm
     WHERE sm.organization_id = o.organization_id AND sm.media_type = 'banner'
       AND sm.processed_media_url IS NOT NULL
     ORDER BY sm.media_order LIMIT 1)           AS banner_url
  FROM organizations o
  LEFT JOIN administrators a ON a.admin_id = (
    SELECT admin_id FROM administrators
    WHERE organization_id = o.organization_id
    ORDER BY created_at ASC LIMIT 1
  )
`;

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * GET /api/external/vendors
 * List all vendors with their marketplace status.
 */
router.get('/vendors', async (req: Request, res: Response) => {
  try {
    const result = await query(`${VENDOR_SELECT} ORDER BY v.vendor_id ASC`);
    res.json({ success: true, data: result.rows.map(shapeVendor) });
  } catch (error) {
    console.error('❌ External API: failed to fetch vendors:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve vendors' });
  }
});

/**
 * GET /api/external/vendors/:id
 * Get a single vendor by vendor_id.
 */
router.get('/vendors/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid vendor ID' });
  }
  try {
    const result = await query(`${VENDOR_SELECT} WHERE v.vendor_id = $1`, [id]);
    if (!result.rows.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'Vendor not found' });
    }
    res.json({ success: true, data: shapeVendor(result.rows[0]) });
  } catch (error) {
    console.error('❌ External API: failed to fetch vendor:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve vendor' });
  }
});

/**
 * GET /api/external/stores
 * List all stores with their marketplace status.
 */
router.get('/stores', async (req: Request, res: Response) => {
  try {
    const result = await query(`${STORE_SELECT} ORDER BY o.organization_id ASC`);
    res.json({ success: true, data: result.rows.map(shapeStore) });
  } catch (error) {
    console.error('❌ External API: failed to fetch stores:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve stores' });
  }
});

/**
 * GET /api/external/stores/:id
 * Get a single store by organization_id.
 */
router.get('/stores/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid store ID' });
  }
  try {
    const result = await query(`${STORE_SELECT} WHERE o.organization_id = $1`, [id]);
    if (!result.rows.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'Store not found' });
    }
    res.json({ success: true, data: shapeStore(result.rows[0]) });
  } catch (error) {
    console.error('❌ External API: failed to fetch store:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to retrieve store' });
  }
});

export default router;
