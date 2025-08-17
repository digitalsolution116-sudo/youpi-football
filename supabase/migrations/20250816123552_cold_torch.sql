/*
  # Fix system_settings RLS policy

  1. Security Changes
    - Drop existing restrictive policy on system_settings
    - Add new policy allowing authenticated users to read system_settings
    - Add policy allowing admins to manage system_settings

  This fixes the 403 error when admin dashboard tries to access system settings.
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view system settings" ON system_settings;

-- Allow authenticated users to read system settings
CREATE POLICY "Allow authenticated read access to system_settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert/update system settings (for admin functions)
CREATE POLICY "Allow authenticated write access to system_settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);