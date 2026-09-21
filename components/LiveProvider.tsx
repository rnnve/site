'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type {
  DiscordResponse,
  DiscordUserData,
  LiveInitialData,
  LiveLastFmData,
  LiveLastFmView,
  SpotifyNowPlaying,
} from '@/lib/integrations';

const ALL_VIEWS: readonly LiveLastFmView[] = ['recent', 'toptracks', 'topartists', 'info'];

const DISCORD_INTERVAL_MS = 5_000;
const SPOTIFY_INTERVAL_MS = 5_000;
const RECENT_INTERVAL_MS = 5_000;
const OTHER_INTERVAL_MS = 10_000;
const TRACK_COUNT = 10;

interface LiveContextValue {
  discord: DiscordUserData | null;
  discordError: string | null;
  spotify: SpotifyNowPlaying | null;
  spotifyStopped: boolean;
  spotifyError: string | null;
  lastfm: Partial<Record<LiveLastFmView, LiveLastFmData>>;
  lastfmError: Partial<Record<LiveLastFmView, string>>;
}

interface LiveProviderProps {
  children: React.ReactNode;
  /** Data fetched during SSR so the first paint shows real content. */
  initialData?: LiveInitialData;
  /** Last.fm views this page observes (filters which views are fetched/polled). */
  views?: readonly LiveLastFmView[];
}

const LiveContext = createContext<LiveContextValue | null>(null);

async function getJson(url: string): Promise<{ body: unknown; error: string | null }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Request failed with ${response.status}`);
    }
    return { body: await response.json(), error: null };
  } catch (error) {
    return { body: null, error: error instanceof Error ? error.message : 'Request failed' };
  }
}

export function LiveProvider({ children, initialData, views }: LiveProviderProps) {
  const activeViews = views ?? ALL_VIEWS;

  const [discord, setDiscord] = useState<DiscordUserData | null>(initialData?.discord ?? null);
  const [discordError, setDiscordError] = useState<string | null>(null);
  const [spotify, setSpotify] = useState<SpotifyNowPlaying | null>(initialData?.spotify ?? null);
  const [spotifyStopped, setSpotifyStopped] = useState(initialData?.spotifyStopped ?? false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [lastfm, setLastfm] = useState<Partial<Record<LiveLastFmView, LiveLastFmData>>>(
    initialData?.lastfm ?? {},
  );
  const [lastfmError, setLastfmError] = useState<Partial<Record<LiveLastFmView, string>>>(
    initialData?.lastfmError ?? {},
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    async function loadDiscord() {
      const { body, error } = await getJson('/api/discord');
      if (error) {
        setDiscordError(error);
        return;
      }
      const json = body as DiscordResponse | { error?: string };
      const jsonError = (json as { error?: string }).error;
      if (jsonError) {
        setDiscordError(jsonError);
        return;
      }
      if (!(json as DiscordResponse).success) {
        setDiscordError('Discord API returned unsuccessful response');
        return;
      }
      setDiscord((json as DiscordResponse).data);
      setDiscordError(null);
    }

    async function loadSpotify() {
      const { body, error } = await getJson('/api/spotify');
      if (error) {
        setSpotifyError(error);
        return;
      }
      const json = body as SpotifyNowPlaying | { error?: string };
      const jsonError = (json as { error?: string }).error;
      if (jsonError) {
        setSpotifyError(jsonError);
        return;
      }
      if (!(json as SpotifyNowPlaying).isPlaying) {
        setSpotifyStopped(true);
        setSpotify(null);
        setSpotifyError(null);
        return;
      }
      setSpotifyStopped(false);
      setSpotify(json as SpotifyNowPlaying);
      setSpotifyError(null);
    }

    async function loadLastfmView(view: LiveLastFmView) {
      const { body, error } = await getJson(`/api/lastfm?view=${view}&limit=${TRACK_COUNT}`);
      if (error) {
        setLastfmError((current) => (current[view] !== error ? { ...current, [view]: error } : current));
        return;
      }
      const json = body as LiveLastFmData & { error?: number | string; message?: string };
      if (json.error) {
        const message = json.message ?? String(json.error);
        setLastfmError((current) => (current[view] !== message ? { ...current, [view]: message } : current));
        return;
      }
      setLastfm((current) => ({ ...current, [view]: json }));
      setLastfmError((current) => (current[view] ? { ...current, [view]: undefined } : current));
    }

    const loadAll = () => {
      void loadDiscord();
      void loadSpotify();
      void Promise.all(activeViews.map((view) => loadLastfmView(view)));
    };

    const onVisible = () => {
      if (!document.hidden) loadAll();
    };
    document.addEventListener('visibilitychange', onVisible);

    const discordTimer = setInterval(loadDiscord, DISCORD_INTERVAL_MS);
    const spotifyTimer = setInterval(loadSpotify, SPOTIFY_INTERVAL_MS);
    const recentTimer = activeViews.includes('recent')
      ? setInterval(() => void loadLastfmView('recent'), RECENT_INTERVAL_MS)
      : undefined;
    const otherViews = activeViews.filter((view) => view !== 'recent');
    const otherTimer = otherViews.length
      ? setInterval(
          () => void Promise.all(otherViews.map((view) => loadLastfmView(view))),
          OTHER_INTERVAL_MS,
        )
      : undefined;

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(discordTimer);
      clearInterval(spotifyTimer);
      if (recentTimer) clearInterval(recentTimer);
      if (otherTimer) clearInterval(otherTimer);
    };
  }, [activeViews]);

  return (
    <LiveContext.Provider
      value={{ discord, discordError, spotify, spotifyStopped, spotifyError, lastfm, lastfmError }}
    >
      {children}
    </LiveContext.Provider>
  );
}

export function useLive(): LiveContextValue {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error('useLive must be used within a LiveProvider');
  return ctx;
}