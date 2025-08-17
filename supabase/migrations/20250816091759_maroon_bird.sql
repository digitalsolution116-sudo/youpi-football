/*
  # Add INSERT policy for matches table

  1. Security Changes
    - Add policy to allow authenticated users to insert matches
    - This enables admin functionality for match creation
    - Policy allows INSERT operations for authenticated users

  2. Notes
    - Required for admin dashboard match creation functionality
    - Maintains security while enabling necessary admin operations
*/

-- Add policy to allow authenticated users to insert matches
CREATE POLICY "Allow authenticated users to insert matches"
  ON public.matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);