-- ============================================================
-- Migration: add subscription pricing and diocese parish count
-- ============================================================

-- businesses: track the vendor's billing amount and cycle at registration time
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS subscription_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS billing_cycle       TEXT;  -- 'monthly' | 'annual'

-- organizations: track the store's billing amount, cycle, and diocese parish count
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS subscription_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS billing_cycle       TEXT,  -- 'monthly' | 'annual'
  ADD COLUMN IF NOT EXISTS parish_count        INTEGER DEFAULT 1;

-- Verify
SELECT 'businesses'   AS tbl, column_name, data_type FROM information_schema.columns
  WHERE table_name = 'businesses'   AND column_name IN ('subscription_amount','billing_cycle')
UNION ALL
SELECT 'organizations' AS tbl, column_name, data_type FROM information_schema.columns
  WHERE table_name = 'organizations' AND column_name IN ('subscription_amount','billing_cycle','parish_count')
ORDER BY tbl, column_name;
