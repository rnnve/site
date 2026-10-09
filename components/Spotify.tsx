"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { siSpotify } from "simple-icons";

interface SpotifyTrack {
  isPlaying: boolean;
  name?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  progress?: number;
  duration?: number;
  trackUrl?: string;
}

interface SpotifyProps {
  className?: string;
}

export function Spotify({ className }: SpotifyProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTrack = async () => {
      try {
        const response = await fetch("/api/spotify", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        if (mounted) {
          setTrack(data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setTrack({ isPlaying: false });
          setLoading(false);
        }
      }
    };

    fetchTrack();
    const id = setInterval(fetchTrack, 10000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-4 p-4", className)}>
        <div className="animate-pulse h-16 w-16 rounded bg-zinc-800" />
        <div className="space-y-2 flex-1">
          <div className="animate-pulse h-5 w-48 bg-zinc-800 rounded" />
          <div className="animate-pulse h-4 w-32 bg-zinc-700 rounded" />
        </div>
      </div>
    );
  }

  if (!track || !track.isPlaying) {
    return (
      <div className={cn("flex items-center gap-4 p-4 text-zinc-400", className)}>
        <svg className="h-16 w-16 text-zinc-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d={siSpotify.path} />
        </svg>
        <div>
          <p className="font-medium text-zinc-100">Not playing</p>
          <p className="text-sm">Nothing playing on my Spotify</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={track.trackUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg", className)}
    >
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt={`${track.name} album art`}
          className="h-16 w-16 rounded object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-medium text-zinc-100 group-hover:text-green-400 transition-colors">
          {track.name}
        </h3>
        <p className="truncate text-sm text-zinc-400">{track.artist}</p>
        {track.album && (
          <p className="truncate text-sm text-zinc-500">{track.album}</p>
        )}

      </div>
    </a>
  );
}