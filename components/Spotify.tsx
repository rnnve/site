"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { placementClass, mobileVariant, type Placement } from "@/lib/placement";

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
  placement?: Placement;
  /** Same as `placement`, applied only on mobile (below the `lg` breakpoint). */
  "mobile-placement"?: Placement;
}

export function Spotify({ className, placement, "mobile-placement": mobilePlacement }: SpotifyProps) {
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
      if (measure.offsetWidth > container.clientWidth + 1) {
        setMarquee(true);
        setMarqueeDuration(Math.max(4, (measure.offsetWidth + 32) / 40));
      } else {
        setMarquee(false);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [track?.name, track?.artist]);

  useEffect(() => {
    let mounted = true;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const fetchTrack = async (attempt = 0) => {
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
        if (!mounted) return;
        // Retry quickly before giving up so a transient upstream error
        // doesn't blank the widget.
        if (attempt < 2) {
          retry = setTimeout(() => fetchTrack(attempt + 1), 1500);
          return;
        }
        // Keep showing the last known track; only fall back to
        // "not playing" if nothing ever loaded.
        setTrack((prev) => prev ?? { isPlaying: false });
        setLoading(false);
      }
    };

    fetchTrack();
    const id = setInterval(fetchTrack, 10000);

    return () => {
      mounted = false;
      if (retry) clearTimeout(retry);
      clearInterval(id);
    };
  }, []);

  // Hide while we don't yet know what's playing, so nothing flashes on load.
  if (loading) {
    return null;
  }

  // Nothing playing → render nothing at all.
  if (!track || !track.isPlaying) {
    return null;
  }

  return (
    <a
      href={track.trackUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("max-lg:mx-auto max-lg:max-w-[min(28rem,100%)] group flex items-center gap-2 p-1.5 max-sm:p-1 min-w-0 rounded-md transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink", placementClass(placement), mobileVariant(placementClass(mobilePlacement)), className)}
    >
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt={`${track.name} album art`}
          className="h-8 w-8 shrink-0 rounded object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
      <div ref={marqueeRef} className="relative min-w-0 flex-1 overflow-hidden">
        <span
          ref={measureRef}
          aria-hidden="true"
          className="invisible absolute left-0 top-0 whitespace-nowrap font-medium text-zinc-100 text-sm sm:text-base"
        >
          {track.name}
          <span className="font-normal text-zinc-400"> · {track.artist}</span>
        </span>
        {marquee ? (
          <div
            className="spotify-marquee flex w-max whitespace-nowrap"
            style={{ "--marquee-duration": `${marqueeDuration}s` } as React.CSSProperties}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                aria-hidden={i === 1}
                className="pr-8 font-medium text-zinc-100 text-sm sm:text-base"
              >
                {track.name}
                <span className="font-normal text-zinc-400"> · {track.artist}</span>
              </span>
            ))}
          </div>
        ) : (
          <h3 className="truncate font-medium text-zinc-100 text-sm sm:text-base">
            {track.name}
            <span className="font-normal text-zinc-400"> · {track.artist}</span>
          </h3>
        )}
      </div>
    </a>
  );
}