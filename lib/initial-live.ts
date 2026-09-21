import { getEnv } from '@/lib/env';
import type {
  DiscordResponse,
  LiveInitialData,
  LiveLastFmData,
  LiveLastFmView,
  SpotifyNowPlaying,
} from '@/lib/integrations';

const INITIAL_TIMEOUT_MS = 2_000;
const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/';
const TRACK_COUNT = 10;

const METHOD_BY_VIEW: Record<LiveLastFmView, string> = {
  recent: 'user.getrecenttracks',
  toptracks: 'user.gettoptracks',
  topartists: 'user.gettopartists',
  info: 'user.getinfo',
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(INITIAL_TIMEOUT_MS) });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchLastfmView(view: LiveLastFmView): Promise<LiveLastFmData | null> {
  const apiKey = getEnv('LASTFM_API_KEY');
  const username = getEnv('LASTFM_USERNAME');
  if (!apiKey || !username) return null;

  const params = new URLSearchParams({
    method: METHOD_BY_VIEW[view],
    user: username,
    api_key: apiKey,
    format: 'json',
  });
  if (view !== 'info') params.set('limit', String(TRACK_COUNT));
  if (view === 'toptracks' || view === 'topartists') params.set('period', 'overall');

  const data = await fetchJson<LiveLastFmData>(`${LASTFM_URL}?${params}`);
  if (!data || (data as LiveLastFmData & { error?: unknown }).error) return null;
  return data;
}

/**
 * Fetches a snapshot of live data during the server render so the first
 * HTML paint contains real content instead of skeletons. Each fetch is
 * bounded and independent: a slow/failing upstream only affects itself.
 */
export async function getInitialLiveData(views: readonly LiveLastFmView[]): Promise<LiveInitialData> {
  const [discordJson, spotifyJson, ...lastfmViews] = await Promise.all([
    fetchJson<DiscordResponse>(getEnv('DISCORD_API_URL') ?? 'https://api.mapleji.xyz/v2/discord/user/1'),
    fetchJson<SpotifyNowPlaying>(
      getEnv('SPOTIFY_API_URL') ?? 'https://spotify.mapleji.xyz/api/spotify',
    ),
    ...views.map((view) => fetchLastfmView(view)),
  ]);

  const lastfm: LiveInitialData['lastfm'] = {};
  views.forEach((view, index) => {
    const data = lastfmViews[index];
    if (data) lastfm[view] = data;
  });

  return {
    discord: discordJson?.success ? discordJson.data : null,
    spotify: spotifyJson?.isPlaying ? spotifyJson : null,
    spotifyStopped: spotifyJson ? !spotifyJson.isPlaying : false,
    lastfm,
    lastfmError: {},
  };
}