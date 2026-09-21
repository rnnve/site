import { getEnv } from '@/lib/env';

export const prerender = false;

export async function GET() {
  const apiUrl = import.meta.env.PUBLIC_SITE_URL || 'https://maplenan.org';

  const catalog = {
    title: 'Rinne API Catalog',
    description: 'Public API endpoints for the Rinne status site',
    version: '1.0.0',
    baseUrl: apiUrl,
    endpoints: {
      discord: {
        method: 'GET',
        path: '/api/discord',
        description: 'Get Discord user profile, status, and activities',
        response: 'DiscordResponse',
        cache: 'public, s-maxage=1, stale-while-revalidate=1',
      },
      spotify: {
        method: 'GET',
        path: '/api/spotify',
        description: 'Get currently playing Spotify track',
        response: 'SpotifyNowPlaying',
        cache: 'public, s-maxage=1, stale-while-revalidate=1',
      },
      lastfm: {
        method: 'GET',
        path: '/api/lastfm',
        description: 'Get Last.fm listening data',
        parameters: {
          view: {
            type: 'string',
            enum: ['recent', 'toptracks', 'topartists', 'info'],
            default: 'recent',
            description: 'Which Last.fm view to return',
          },
          limit: {
            type: 'string',
            description: 'Number of items to return (default varies by view)',
          },
        },
        response: 'LastFmData',
        cache: 'public, s-maxage=5, stale-while-revalidate=5 (recent) / s-maxage=60, stale-while-revalidate=60 (others)',
      },
    },
    externalApis: {
      discord: getEnv('DISCORD_API_URL') || 'https://api.mapleji.xyz/v2/discord/user/1',
      spotify: getEnv('SPOTIFY_API_URL') || 'https://spotify.mapleji.xyz/api/spotify',
      lastfm: 'https://ws.audioscrobbler.com/2.0/',
    },
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}