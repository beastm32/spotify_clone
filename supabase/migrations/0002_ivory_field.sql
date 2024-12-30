/*
  # Add admin role and policies

  1. Changes
    - Add admin column to auth.users
    - Update RLS policies to give admins full access
    - Add policy for admins to manage all tracks
    - Add policy for admins to manage all playlists
*/

-- Add admin column to users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update track policies for admin access
CREATE POLICY "Admins can manage all tracks"
    ON tracks
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.is_admin = true
        )
    );

-- Update playlist policies for admin access
CREATE POLICY "Admins can manage all playlists"
    ON playlists
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.is_admin = true
        )
    );

-- Update playlist_tracks policies for admin access
CREATE POLICY "Admins can manage all playlist tracks"
    ON playlist_tracks
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.is_admin = true
        )
    );