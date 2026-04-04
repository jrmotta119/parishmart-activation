-- Migration: add marketplace_synced_at to track when a seller was
-- successfully pushed to the external marketplace.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS marketplace_synced_at TIMESTAMPTZ;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS marketplace_synced_at TIMESTAMPTZ;
