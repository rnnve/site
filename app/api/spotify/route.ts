import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_URL = "https://spotify.maplenan.org/api/spotify";
const MAX_ATTEMPTS = 3;

async function fetchUpstream(): Promise<Response | null> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(UPSTREAM_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; site-v2/1.0)",
        },
        cache: "no-store",
      });
      if (response.ok) return response;
    } catch {
      // ignore and retry
    }
    // Brief backoff before the next attempt.
    await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
  }
  return null;
}

export async function GET(_request: NextRequest) {
  try {
    const response = await fetchUpstream();

    if (!response) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from API" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const track = data.result ?? data;
    return NextResponse.json({
      isPlaying: track.isPlaying ?? false,
      name: track.title ?? track.name,
      artist: track.artist,
      album: track.album,
      albumArt: track.albumImageUrl ?? track.albumArt,
      progress: track.progressMs ?? track.progress,
      duration: track.durationMs ?? track.duration,
      trackUrl: track.trackUrl,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch from API" },
      { status: 500 }
    );
  }
}