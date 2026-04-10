/**
 * /api/external-data/*
 *
 * Public proxy endpoints that forward reference-data requests to the external
 * marketplace API (Adverweb) with HMAC auth handled server-side.
 *
 * These endpoints require NO admin authentication — they are called directly
 * by the onboarding registration forms.
 *
 * Responses are cached in memory to avoid hammering the external API:
 *   - countries / states / cities  → 6 hours
 *   - membership-plans / stores    → 30 minutes
 */

import express, { Request, Response } from 'express';
import { MarketplaceService } from '../services/marketplaceService';

const router = express.Router();

// ─── Simple in-memory TTL cache ───────────────────────────────────────────────

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

async function getCached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expiresAt > now) {
    console.log(`[external-data] cache HIT  key=${key}`);
    return entry.data as T;
  }
  console.log(`[external-data] cache MISS key=${key} — calling marketplace API`);
  const data = await fetcher();
  const count = Array.isArray(data) ? data.length : '(non-array)';
  console.log(`[external-data] cache SET  key=${key} items=${count} ttl=${ttlMs / 1000}s`);
  cache.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

const SIX_HOURS  = 6 * 60 * 60 * 1000;
const THIRTY_MIN = 30 * 60 * 1000;

// ─── Routes ──────────────────────────────────────────────────────────────────

/** GET /api/external-data/countries */
router.get('/countries', async (_req: Request, res: Response) => {
  console.log('[external-data] GET /countries');
  try {
    const data = await getCached('countries', SIX_HOURS, () => MarketplaceService.getCountries());
    console.log(`[external-data] /countries → returning ${Array.isArray(data) ? data.length : 0} items`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ external-data/countries error:', error);
    res.status(502).json({ success: false, message: 'Failed to fetch countries from marketplace' });
  }
});

/** GET /api/external-data/states?country_id=1 */
router.get('/states', async (req: Request, res: Response) => {
  const countryId = req.query.country_id ? Number(req.query.country_id) : undefined;
  console.log(`[external-data] GET /states country_id=${countryId}`);
  try {
    const cacheKey  = `states:${countryId ?? 'default'}`;
    const data = await getCached(cacheKey, SIX_HOURS, () => MarketplaceService.getStates(countryId));
    console.log(`[external-data] /states → returning ${Array.isArray(data) ? data.length : 0} items`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ external-data/states error:', error);
    res.status(502).json({ success: false, message: 'Failed to fetch states from marketplace' });
  }
});

/** GET /api/external-data/cities?state_id=12 */
router.get('/cities', async (req: Request, res: Response) => {
  const stateId = Number(req.query.state_id);
  console.log(`[external-data] GET /cities state_id=${stateId}`);
  if (!stateId) {
    return res.status(422).json({ success: false, message: 'state_id query parameter is required' });
  }
  try {
    const cacheKey = `cities:${stateId}`;
    const data = await getCached(cacheKey, SIX_HOURS, () => MarketplaceService.getCities(stateId));
    console.log(`[external-data] /cities → returning ${Array.isArray(data) ? data.length : 0} items`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ external-data/cities error:', error);
    res.status(502).json({ success: false, message: 'Failed to fetch cities from marketplace' });
  }
});

/** GET /api/external-data/membership-plans?type=vendor|partner */
router.get('/membership-plans', async (req: Request, res: Response) => {
  const type = req.query.type as 'vendor' | 'partner' | undefined;
  console.log(`[external-data] GET /membership-plans type=${type}`);
  if (type && type !== 'vendor' && type !== 'partner') {
    return res.status(422).json({ success: false, message: 'type must be "vendor" or "partner"' });
  }
  try {
    // Fetch all plans (external API ignores the type header — filter client-side)
    const all = await getCached('plans:all', THIRTY_MIN, () => MarketplaceService.getMembershipPlans());
    const data = type ? (all as { type: string }[]).filter(p => p.type === type) : all;
    console.log(`[external-data] /membership-plans → returning ${Array.isArray(data) ? data.length : 0} items (filtered type=${type ?? 'all'})`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ external-data/membership-plans error:', error);
    res.status(502).json({ success: false, message: 'Failed to fetch membership plans from marketplace' });
  }
});

/** GET /api/external-data/stores — returns parishes (tipo=1) and causes (tipo=2) */
router.get('/stores', async (_req: Request, res: Response) => {
  console.log('[external-data] GET /stores');
  try {
    // External API ignores the tipo header filter — fetch all and filter client-side
    const all = await getCached('stores:all', THIRTY_MIN, () => MarketplaceService.getStores());
    const data = (all as { tipo: number }[]).filter(s => s.tipo === 1 || s.tipo === 2);
    console.log(`[external-data] /stores → returning ${data.length} items (filtered tipo=1,2 from ${Array.isArray(all) ? all.length : 0} total)`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ external-data/stores error:', error);
    res.status(502).json({ success: false, message: 'Failed to fetch stores from marketplace' });
  }
});

export default router;
