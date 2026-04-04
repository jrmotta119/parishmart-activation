/**
 * externalApiAuth middleware
 * Validates inbound requests from external partners (e.g. the marketplace)
 * using the same HMAC-SHA256 canonical signing scheme as the outbound
 * marketplace API calls in marketplaceService.ts.
 *
 * Canonical string: METHOD\nPATH\nTIMESTAMP\nNONCE\nSHA256(body)
 * X-Signature = HMAC-SHA256(canonical, MARKETPLACE_EXTERNAL_API_SECRET).hex
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const EXTERNAL_API_KEY    = process.env.MARKETPLACE_EXTERNAL_API_KEY    || '';
const EXTERNAL_API_SECRET = process.env.MARKETPLACE_EXTERNAL_API_SECRET || '';
const MAX_CLOCK_SKEW_SECONDS = 5 * 60; // 5 minutes

export function externalApiAuth(req: Request, res: Response, next: NextFunction): void {
  if (!EXTERNAL_API_KEY || !EXTERNAL_API_SECRET) {
    console.error('FATAL: MARKETPLACE_EXTERNAL_API_KEY / MARKETPLACE_EXTERNAL_API_SECRET not configured');
    res.status(500).json({ success: false, error: 'Server configuration error' });
    return;
  }

  const apiKey    = req.headers['x-api-key']   as string | undefined;
  const timestamp = req.headers['x-timestamp'] as string | undefined;
  const nonce     = req.headers['x-nonce']     as string | undefined;
  const signature = req.headers['x-signature'] as string | undefined;

  if (!apiKey || !timestamp || !nonce || !signature) {
    res.status(401).json({ success: false, error: 'Missing authentication headers' });
    return;
  }

  // 403 for unrecognised API key
  if (apiKey !== EXTERNAL_API_KEY) {
    res.status(403).json({ success: false, error: 'Unknown API key' });
    return;
  }

  // Replay protection: reject timestamps older than 5 minutes
  const nowSeconds = Math.floor(Date.now() / 1000);
  const tsSeconds  = parseInt(timestamp, 10);
  if (isNaN(tsSeconds) || Math.abs(nowSeconds - tsSeconds) > MAX_CLOCK_SKEW_SECONDS) {
    res.status(401).json({ success: false, error: 'Request timestamp expired' });
    return;
  }

  // Reconstruct canonical string — mirrors buildHeaders() in marketplaceService.ts
  // Use originalUrl (strip query string) so the path matches what the caller signed
  const path       = req.originalUrl.split('?')[0];
  const bodyString = req.body && Object.keys(req.body).length > 0
    ? JSON.stringify(req.body)
    : '';
  const bodyHash   = crypto.createHash('sha256').update(bodyString).digest('hex');

  const canonical = [req.method.toUpperCase(), path, timestamp, nonce, bodyHash].join('\n');

  const expectedHex = crypto
    .createHmac('sha256', EXTERNAL_API_SECRET)
    .update(canonical)
    .digest('hex');

  // Timing-safe comparison (pattern from webhooks.ts lines 62-64)
  const expectedBuf  = Buffer.from(expectedHex);
  const signatureBuf = Buffer.from(signature);

  if (
    signatureBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(signatureBuf, expectedBuf)
  ) {
    console.warn(`External API: rejected request — invalid signature for key ${apiKey}`);
    res.status(401).json({ success: false, error: 'Invalid signature' });
    return;
  }

  next();
}
