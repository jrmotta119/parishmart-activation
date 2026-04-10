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

export interface MarketplaceState {
  id: number;
  name: string;
  abbreviation: string;
  country_id: number;
}

export interface MarketplaceCity {
  id: number;
  name: string;
  slug: string;
  state_id: number;
  zip_code: string | null;
}

export interface MarketplacePlan {
  name: string;
  slug: string;
  description: string;
  type: 'vendor' | 'partner';
  is_active: boolean;
}

export interface MarketplaceStore {
  id: number;
  name: string;
  tipo: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function baseUrl(): string {
  if (!MARKETPLACE_BASE_URL) throw new Error('MARKETPLACE_API_URL is not configured');
  return MARKETPLACE_BASE_URL.replace(/\/+$/, '');
}

function assertCredentials(): void {
  if (!MARKETPLACE_API_KEY || !MARKETPLACE_API_SECRET) {
    throw new Error('MARKETPLACE_API_KEY / MARKETPLACE_API_SECRET are not configured');
  }
}

async function getJson<T>(path: string, extraHeaders?: Record<string, string>): Promise<T> {
  assertCredentials();
  const url = `${baseUrl()}${path}`;
  // Sign only the path component — query strings must not be included in the canonical string
  const pathForSigning = path.split('?')[0];
  const headers = { ...buildHeaders('GET', pathForSigning), ...(extraHeaders || {}) };
  console.log(`[marketplace] GET ${url}`, extraHeaders && Object.keys(extraHeaders).length ? `headers=${JSON.stringify(extraHeaders)}` : '');
  const res = await fetch(url, { method: 'GET', headers });
  console.log(`[marketplace] response status=${res.status} ok=${res.ok}`);
  if (!res.ok) {
    const text = await res.text();
    console.error(`[marketplace] error body: ${text}`);
    throw new Error(`Marketplace GET ${path} failed (${res.status}): ${text}`);
  }
  const data = await res.json() as { success: boolean; data: T };
  console.log(`[marketplace] success=${data.success} data length=${Array.isArray(data.data) ? (data.data as unknown[]).length : typeof data.data}`);
  if (!data.success) throw new Error(`Marketplace GET ${path} returned success=false`);
  return data.data;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class MarketplaceService {
  /** Fetch published countries. */
  static async getCountries(): Promise<MarketplaceCountry[]> {
    return getJson<MarketplaceCountry[]>('/api/v1/external-api/countries');
  }

  /**
   * Fetch states for a country.
   * @param countryId  External country ID (defaults to 1 = United States on their end)
   */
  static async getStates(countryId?: number): Promise<MarketplaceState[]> {
    const extra: Record<string, string> = countryId !== undefined ? { Country_id: String(countryId) } : {};
    return getJson<MarketplaceState[]>('/api/v1/external-api/states', extra);
  }

  /**
   * Fetch cities for a state.
   * @param stateId  External state ID (required by their API)
   */
  static async getCities(stateId: number): Promise<MarketplaceCity[]> {
    return getJson<MarketplaceCity[]>(`/api/v1/external-api/cities?state_id=${stateId}`);
  }

  /**
   * Fetch active membership plans.
   * @param type  "vendor" or "partner" — omit to get all
   */
  static async getMembershipPlans(type?: 'vendor' | 'partner'): Promise<MarketplacePlan[]> {
    const extra: Record<string, string> = type ? { type } : {};
    return getJson<MarketplacePlan[]>('/api/v1/external-api/membership-plans', extra);
  }

  /**
   * Fetch published stores.
   * @param tipo  Comma-separated tipo numbers e.g. "1,2" (1=parish, 2=cause)
   */
  static async getStores(tipo?: string): Promise<MarketplaceStore[]> {
    const extra: Record<string, string> = tipo ? { tipo } : {};
    return getJson<MarketplaceStore[]>('/api/v1/external-api/stores', extra);
  }

  /**
   * Push an approved seller (vendor or store) to the marketplace.
   * TODO: implement once create-seller endpoint docs are received.
   */
  static async syncSeller(sellerId: string, sellerType: 'vendor' | 'store'): Promise<void> {
    console.log(`📋 Marketplace seller sync pending for ${sellerType} ${sellerId} — awaiting create-seller API docs`);
  }
}
