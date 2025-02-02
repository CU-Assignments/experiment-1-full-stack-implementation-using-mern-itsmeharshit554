/*
  # Initial Schema Setup

  1. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  Note: Authentication is handled by Supabase Auth, no need for a users table
*/

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);