/*
  # Fix database policies

  1. Changes
    - Remove user_id filter from playlist select policy
    - Update playlist policies to use proper user_id checks
    - Add missing storage policies for music uploads

  2. Security
    - Ensure users can only access their own playlists
    - Allow admins to access all playlists
    - Add storage bucket policies for music files
*/

-- Drop existing playlist policies
DROP POLICY IF EXISTS "Users can view their own playlists" ON playlists;
DROP POLICY IF EXISTS "Users can insert their own playlists" ON playlists;

-- Create updated playlist policies
CREATE POLICY "Users can view their own playlists"
    ON playlists FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.is_admin = true
        )
    );

CREATE POLICY "Users can insert their own playlists"
    ON playlists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Enable storage for music files
INSERT INTO storage.buckets (id, name)
VALUES ('music', 'music')
ON CONFLICT DO NOTHING;

-- Storage policies for music files
CREATE POLICY "Anyone can read music files"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'music');

CREATE POLICY "Authenticated users can upload music files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'music');

CREATE POLICY "Users can update their own music files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'music' AND (auth.uid() = owner OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.is_admin = true
    )));