ALTER TABLE super_admins
  ADD COLUMN IF NOT EXISTS created_by_admin_id INTEGER REFERENCES super_admins(super_admin_id) ON DELETE SET NULL;
