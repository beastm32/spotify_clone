import React, { useState, useEffect } from 'react';
import { Plus, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { UploadModal } from '../components/UploadModal';

interface Playlist {
  id: string;
  name: string;
  created_at: string;
}

export function Library() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPlaylists(data);
      }
    };

    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const { data, error } = await supabase
      .from('playlists')
      .insert([
        { name: newPlaylistName, user_id: user?.id }
      ])
      .select()
      .single();

    if (!error && data) {
      setPlaylists([data, ...playlists]);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Upload Music
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-zinc-800 text-white rounded-full px-4 py-2 hover:bg-zinc-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Playlist
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreatePlaylist} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="New Playlist Name"
              className="flex-1 input"
            />
            <button
              type="submit"
              className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-zinc-700 text-white rounded px-4 py-2 hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-zinc-800 p-4 rounded-lg flex items-center gap-4 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <div className="bg-zinc-700 p-3 rounded">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-gray-400">Playlist</p>
            </div>
          </div>
        ))}
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          // Optionally refresh the tracks list if shown in the library
        }}
      />
    </div>
  );
}