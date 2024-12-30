import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Track {
  id: string;
  title: string;
  artist: string;
  file_url: string;
}

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const searchTracks = async () => {
      if (!searchQuery.trim()) {
        setTracks([]);
        return;
      }

      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%`)
        .limit(20);

      if (!error && data) {
        setTracks(data);
      }
    };

    const timeoutId = setTimeout(searchTracks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="p-8">
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs or artists"
          className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-800 border-zinc-700 text-white focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between hover:bg-zinc-700 transition-colors"
          >
            <div>
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-gray-400">{track.artist}</p>
            </div>
            <audio controls src={track.file_url} className="max-w-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}