import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Track {
  id: string;
  title: string;
  artist: string;
  file_url: string;
}

export function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTracks(data);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Musicify</h1>
      
      <div className="grid gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between"
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