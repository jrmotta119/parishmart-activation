/**
 * MarketplaceService
 * Client for the external marketplace API.
 *
 * Authentication: HMAC-SHA256 request signing
 *
 * Signature algorithm:
 *   canonical = METHOD + "\n" + PATH + "\n" + TIMESTAMP + "\n" + NONCE + "\n" + SHA256(body)
 *   X-Signature = HMAC-SHA256(canonical, API_SECRET).hex
 *
 * POST requests also include X-Idempotency-Key to prevent duplicate creation on retries.
 */

import crypto from 'crypto';

const MARKETPLACE_BASE_URL   = process.env.MARKETPLACE_API_URL    || '';
const MARKETPLACE_API_KEY    = process.env.MARKETPLACE_API_KEY    || '';
const MARKETPLACE_API_SECRET = process.env.MARKETPLACE_API_SECRET || '';

/**
 * Build all required auth headers for a marketplace request.
 * @param method  HTTP method in uppercase (GET, POST, etc.)
 * @param path    Exact API path WITHOUT domain (e.g. /api/v1/external-api/countries)
 * @param body    Request body object for POST requests; omit or pass null for GET
 */
function buildHeaders(method: string, path: string, body?: object | null): Record<string, string> {
  const timestamp  = Math.floor(Date.now() / 1000).toString();
  const nonce      = crypto.randomBytes(16).toString('hex');
  const bodyString = body ? JSON.stringify(body) : '';
  const bodyHash   = crypto.createHash('sha256').update(bodyString).digest('hex');

  const canonical = [method.toUpperCase(), path, timestamp, nonce, bodyHash].join('\n');

  const signature = crypto
    .createHmac('sha256', MARKETPLACE_API_SECRET)
    .update(canonical)
    .digest('hex');

  const headers: Record<string, string> = {
    'Accept':      'application/json',
    'X-Api-Key':   MARKETPLACE_API_KEY,
    'X-Timestamp': timestamp,
    'X-Nonce':     nonce,
    'X-Signature': signature,
  };

  if (method.toUpperCase() === 'POST') {
    headers['X-Idempotency-Key'] = crypto.randomUUID();
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface MarketplaceCountry {
  id: number;
  name: string;
  nationality: string;
  order: number;
  image: string | null;
  is_default: boolean;
  status: { value: string; label: string };
  created_at: string | null;
  updated_at: string | null;
  code: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class MarketplaceService {
  /**
   * Fetch the list of published countries from the marketplace.
   * Use as a connectivity / auth validation check.
   */
  static async getCountries(): Promise<MarketplaceCountry[]> {
    if (!MARKETPLACE_BASE_URL) throw new Error('MARKETPLACE_API_URL is not configured');
    if (!MARKETPLACE_API_KEY || !MARKETPLACE_API_SECRET) {
      throw new Error('MARKETPLACE_API_KEY / MARKETPLACE_API_SECRET are not configured');
    }

    const path = '/api/v1/external-api/countries';
    const res  = await fetch(`${MARKETPLACE_BASE_URL.replace(/\/+$/, '')}${path}`, {
      method:  'GET',
      headers: buildHeaders('GET', path),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Marketplace getCountries failed (${res.status}): ${text}`);
    }

    const data = await res.json() as { success: boolean; data: MarketplaceCountry[] };
    if (!data.success) throw new Error('Marketplace getCountries returned success=false');
    return data.data;
  }

  /**
   * Push an approved seller (vendor or store) to the marketplace.
   * TODO: implement once create-seller endpoint docs are received.
   */
  static async syncSeller(sellerId: string, sellerType: 'vendor' | 'store'): Promise<void> {
    console.log(`📋 Marketplace seller sync pending for ${sellerType} ${sellerId} — awaiting create-seller API docs`);
  }
}
