/*
  # Initial Schema Setup for Spotify Clone

  1. New Tables
    - users (handled by Supabase Auth)
    - tracks
      - id (uuid, primary key)
      - title (text)
      - artist (text)
      - user_id (uuid, references auth.users)
      - file_url (text)
      - created_at (timestamp)
    - playlists
      - id (uuid, primary key)
      - name (text)
      - user_id (uuid, references auth.users)
      - created_at (timestamp)
    - playlist_tracks
      - id (uuid, primary key)
      - playlist_id (uuid, references playlists)
      - track_id (uuid, references tracks)
      - added_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Tracks table
CREATE TABLE tracks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    artist text NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    file_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all tracks"
    ON tracks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own tracks"
    ON tracks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Playlists table
CREATE TABLE playlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own playlists"
    ON playlists FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playlists"
    ON playlists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Playlist tracks junction table
CREATE TABLE playlist_tracks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id uuid REFERENCES playlists ON DELETE CASCADE NOT NULL,
    track_id uuid REFERENCES tracks ON DELETE CASCADE NOT NULL,
    added_at timestamptz DEFAULT now(),
    UNIQUE(playlist_id, track_id)
);

ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their playlist tracks"
    ON playlist_tracks FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM playlists
            WHERE playlists.id = playlist_tracks.playlist_id
            AND playlists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tracks to their playlists"
    ON playlist_tracks FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM playlists
            WHERE playlists.id = playlist_tracks.playlist_id
            AND playlists.user_id = auth.uid()
        )
    );