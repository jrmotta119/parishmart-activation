ALTER TABLE super_admins
  ADD COLUMN IF NOT EXISTS last_dashboard_view TIMESTAMPTZ;
