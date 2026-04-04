-- ============================================================
-- Migration: free subscription tier + legal terms acceptance
-- ============================================================

-- 1. Allow 'free' in both subscription enums
ALTER TYPE subscription_type              ADD VALUE IF NOT EXISTS 'free';
ALTER TYPE organization_subscription_type ADD VALUE IF NOT EXISTS 'free';

-- 2. Terms acceptance — vendor side
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS terms_accepted    BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

-- 3. Terms acceptance — store/administrator side
ALTER TABLE administrators
  ADD COLUMN IF NOT EXISTS terms_accepted    BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

-- Verify
SELECT table_name, column_name, data_type
  FROM information_schema.columns
 WHERE (table_name = 'vendors'        AND column_name IN ('terms_accepted','terms_accepted_at'))
    OR (table_name = 'administrators' AND column_name IN ('terms_accepted','terms_accepted_at'))
 ORDER BY table_name, column_name;
