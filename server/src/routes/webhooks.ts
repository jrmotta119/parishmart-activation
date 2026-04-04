import crypto from 'crypto';
import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import type { JobResult } from '../services/imageProcessingService';
import { MarketplaceService } from '../services/marketplaceService';

const router = express.Router();

/**
 * Reproduce Python's json.dumps(obj, sort_keys=True) in JavaScript.
 * Python's default separators are (', ', ': ') so we match those exactly.
 * This is needed to verify ImaMod's HMAC signature, which is computed on
 * the sort_keys string rather than the compact wire body.
 */
function pythonJsonDumps(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(pythonJsonDumps).join(', ') + ']';
  }
  if (typeof obj === 'object') {
    const pairs = Object.keys(obj)
      .sort()
      .map(k => JSON.stringify(k) + ': ' + pythonJsonDumps(obj[k]));
    return '{' + pairs.join(', ') + '}';
  }
  return JSON.stringify(obj);
}

/**
 * POST /api/webhook/image-processing
 * Receives the completed job result from ImaMod and stores
 * the processed image URLs back in businessmedia / storemedia.
 *
 * seller_id format:
 *   "V-{businessId}"  → businessmedia table (vendor)
 *   "S-{orgId}"       → storemedia table (store/parish)
 *
 * ImaMod signs with:
 *   X-Webhook-Signature: HMAC-SHA256(json.dumps(payload, sort_keys=True), WEBHOOK_SECRET).hexdigest()
 * We re-serialize the parsed body with sort_keys ordering to reproduce the same string.
 */
router.post('/image-processing', async (req: Request, res: Response) => {
  // Verify HMAC-SHA256 signature sent by ImaMod
  const secret = process.env.IMAMOD_WEBHOOK_SECRET;
  if (!secret) {
    console.error('FATAL: IMAMOD_WEBHOOK_SECRET is not configured — rejecting webhook request');
    return res.status(500).json({ error: 'Webhook not configured' });
  }
  const signature = req.headers['x-webhook-signature'] as string;
  if (!signature) {
    console.warn('ImaMod webhook: missing X-Webhook-Signature header');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Re-serialize exactly as Python's json.dumps(payload, sort_keys=True)
  const canonicalBody = pythonJsonDumps(req.body);
  const expectedBuf = Buffer.from(
    crypto.createHmac('sha256', secret).update(canonicalBody).digest('hex')
  );
  const sigBuf = Buffer.from(signature);
  const valid = sigBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(sigBuf, expectedBuf);
  if (!valid) {
    console.warn('ImaMod webhook: rejected request with invalid signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Acknowledge immediately so ImaMod doesn't retry
  res.status(200).json({ received: true });

  const payload = req.body as JobResult;
  const { job_id, status, results, error } = payload;

  // seller_id is nested inside results in the ImaMod response
  const seller_id = results?.seller_id;

  console.log(`📥 ImaMod webhook received — job: ${job_id}, seller: ${seller_id}, status: ${status}`);

  if (!seller_id || typeof seller_id !== 'string') {
    console.error('ImaMod webhook: missing or invalid results.seller_id');
    return;
  }

  // Parse seller_id prefix to determine table and ID
  const vendorMatch = seller_id.match(/^V-(\d+)$/);
  const storeMatch  = seller_id.match(/^S-(\d+)$/);

  if (!vendorMatch && !storeMatch) {
    console.error(`ImaMod webhook: unrecognised seller_id format: ${seller_id}`);
    return;
  }

  const isVendor    = !!vendorMatch;
  const entityId    = parseInt(isVendor ? vendorMatch![1] : storeMatch![1], 10);
  const mediaTable  = isVendor ? 'businessmedia'  : 'storemedia';
  const entityTable = isVendor ? 'businesses'      : 'organizations';
  const idColumn    = isVendor ? 'business_id'     : 'organization_id';
  const pkColumn    = isVendor ? 'business_id'     : 'organization_id';

  try {
    if (status === 'failed') {
      await query(
        `UPDATE ${mediaTable} SET processing_status = 'failed'
         WHERE ${idColumn} = $1 AND media_type IN ('logo', 'banner')`,
        [entityId]
      );
      console.warn(`⚠️ ImaMod job ${job_id} failed for ${seller_id}: ${error}`);
      return;
    }

    if (status !== 'completed' || !results) {
      console.warn(`ImaMod webhook: job ${job_id} status is '${status}', skipping update`);
      return;
    }

    // Update logo processed URL  (results.logo.url)
    if (results.logo?.url) {
      await query(
        `UPDATE ${mediaTable}
         SET processed_media_url = $1, processing_status = 'done'
         WHERE ${idColumn} = $2 AND media_type = 'logo'`,
        [results.logo.url, entityId]
      );
      console.log(`✅ Updated processed logo for ${seller_id}`);
    }

    // Update banner processed URL  (results.banner.url) — first banner row
    if (results.banner?.url) {
      await query(
        `UPDATE ${mediaTable}
         SET processed_media_url = $1, processing_status = 'done'
         WHERE media_id = (
           SELECT media_id FROM ${mediaTable}
           WHERE ${idColumn} = $2 AND media_type = 'banner'
           ORDER BY media_order ASC LIMIT 1
         )`,
        [results.banner.url, entityId]
      );
      console.log(`✅ Updated processed banner for ${seller_id}`);
    }

    // Store the complete ImaMod results as JSONB — includes banner dimensions,
    // logo type, merchandise URLs, etc. The marketplace API will read from here.
    await query(
      `UPDATE ${entityTable} SET processed_results = $1 WHERE ${pkColumn} = $2`,
      [JSON.stringify(results), entityId]
    );

    console.log(`✅ ImaMod webhook fully processed for ${seller_id} (logo, banner, merchandise stored)`);

    // Trigger marketplace seller sync (non-blocking)
    // TODO: implement full sync once marketplace create-seller API docs are received
    const sellerType = isVendor ? 'vendor' : 'store';
    MarketplaceService.syncSeller(seller_id, sellerType).catch(err => {
      console.error(`⚠️ Marketplace sync failed for ${seller_id} (non-fatal):`, err);
    });

  } catch (err) {
    console.error(`❌ Error handling ImaMod webhook for ${seller_id}:`, err);
  }
});

export default router;
