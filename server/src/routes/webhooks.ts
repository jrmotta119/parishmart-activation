import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import type { JobResult } from '../services/imageProcessingService';

const router = express.Router();

/**
 * POST /api/webhook/image-processing
 * Receives the completed job result from ImaMod and stores
 * the processed image URLs back in businessmedia / storemedia.
 *
 * seller_id format:
 *   "V-{businessId}"  → businessmedia table (vendor)
 *   "S-{orgId}"       → storemedia table (store/parish)
 */
router.post('/image-processing', async (req: Request, res: Response) => {
  // Acknowledge immediately so ImaMod doesn't retry
  res.status(200).json({ received: true });

  const payload = req.body as JobResult;
  const { job_id, status, results, error } = payload;

  // seller_id is nested inside results in the ImaMod response
  const seller_id = results?.seller_id;

  console.log(`📥 ImaMod webhook received — job: ${job_id}, seller: ${seller_id}, status: ${status}`);

  if (!seller_id) {
    console.error('ImaMod webhook: missing results.seller_id');
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
  } catch (err) {
    console.error(`❌ Error handling ImaMod webhook for ${seller_id}:`, err);
  }
});

export default router;
