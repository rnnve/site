import { getEnv } from '@/lib/env';
import type { SpotifyNowPlaying } from '@/lib/integrations';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function fetchUpstream(endpoint: string, attempt: number) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15_000);
	try {
		const res = await fetch(endpoint, { signal: controller.signal });
		clearTimeout(timeout);
		return res;
	} catch (error) {
		clearTimeout(timeout);
		if (attempt === 0 && (error instanceof Error && (error.name === 'AbortError' || error.message?.includes('fetch failed') || error.message?.includes('ECONNRESET')))) {
			console.warn(`[api/spotify] retrying after: ${error.message}`);
			await new Promise((r) => setTimeout(r, 400));
			return fetchUpstream(endpoint, 1);
		}
		throw error;
	}
}

export async function GET() {
	const endpoint = getEnv('SPOTIFY_API_URL') || 'https://spotify.mapleji.xyz/api/spotify';

	try {
		const res = await fetchUpstream(endpoint, 0);

		if (!res.ok) {
			console.error(`[api/spotify] upstream ${res.status}`);
			return Response.json({ error: `Spotify API responded with ${res.status}` }, { status: res.status });
		}

		const data = (await res.json()) as SpotifyNowPlaying;
		return Response.json(data, { headers: { 'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1' } });
	} catch (error) {
		console.error('[api/spotify] fetch failed:', error);
		return Response.json({ error: 'Failed to fetch current Spotify track' }, { status: 502 });
	}
}