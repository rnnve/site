"use client";

import { useEffect, useRef, useState } from "react";
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

  const marqueeRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [marquee, setMarquee] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState(12);

  useEffect(() => {
    const check = () => {
      const container = marqueeRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;
      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      if (isMobile && measure.offsetWidth > container.clientWidth + 1) {
        setMarquee(true);
        setMarqueeDuration(Math.max(4, (measure.offsetWidth + 32) / 40));
      } else {
        setMarquee(false);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [track?.name]);

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
      <div className={cn("flex items-center gap-4 p-4 max-sm:gap-2 max-sm:p-0", className)}>
        <div className="animate-pulse h-16 w-16 max-sm:h-8 max-sm:w-8 rounded bg-zinc-800" />
        <div className="space-y-2 flex-1 max-sm:hidden">
          <div className="animate-pulse h-5 w-48 bg-zinc-800 rounded" />
          <div className="animate-pulse h-4 w-32 bg-zinc-700 rounded" />
        </div>
      </div>
    );
  }

  if (!track || !track.isPlaying) {
    return (
      <div className={cn("flex items-center gap-4 p-4 text-zinc-400 max-sm:gap-2 max-sm:p-0", className)}>
        <svg className="h-16 w-16 max-sm:h-8 max-sm:w-8 text-zinc-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d={siSpotify.path} />
        </svg>
        <div>
          <p className="font-medium text-zinc-100 max-sm:hidden">Not playing</p>
          <p className="text-sm max-sm:text-xs">Nothing playing on my Spotify</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={track.trackUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex items-center gap-4 p-4 max-sm:gap-2 max-sm:p-2 bg-zinc-900/50 rounded-lg", className)}
    >
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt={`${track.name} album art`}
          className="h-16 w-16 max-sm:h-8 max-sm:w-8 rounded object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div ref={marqueeRef} className="relative min-w-0 overflow-hidden">
          <span
            ref={measureRef}
            aria-hidden="true"
            className="invisible absolute left-0 top-0 whitespace-nowrap font-medium text-zinc-100 max-sm:text-xs"
          >
            {track.name}
          </span>
          {marquee ? (
            <div
              className="spotify-marquee flex w-max whitespace-nowrap"
              style={{ "--marquee-duration": `${marqueeDuration}s` } as React.CSSProperties}
            >
              <span className="pr-8 font-medium text-zinc-100 max-sm:text-xs">{track.name}</span>
              <span aria-hidden="true" className="pr-8 font-medium text-zinc-100 max-sm:text-xs">
                {track.name}
              </span>
            </div>
          ) : (
            <h3 className="truncate font-medium text-zinc-100 max-sm:text-xs">
              {track.name}
            </h3>
          )}
        </div>
        <p className="truncate text-sm max-sm:text-xs text-zinc-400">{track.artist}</p>
        {track.album && (
          <p className="truncate text-sm text-zinc-500 max-sm:hidden">{track.album}</p>
        )}

      </div>
    </a>
  );
}