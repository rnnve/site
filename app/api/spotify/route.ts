import { getEnv } from '@/lib/env';
import { fetchV4, reportDns } from '@/lib/fetch-v4';
import type { SpotifyNowPlaying } from '@/lib/integrations';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function getUpstream(attempt: number): Promise<SpotifyNowPlaying> {
	const endpoint = getEnv('SPOTIFY_API_URL') || 'https://spotify.mapleji.xyz/api/spotify';
	try {
		const res = await fetchV4(endpoint);

		if (!res.ok) {
			console.error(`[api/spotify] upstream ${res.status}`);
			throw new Error(`Upstream responded with ${res.status}`);
		}

		return (await res.json()) as SpotifyNowPlaying;
	} catch (error) {
		console.error(`[api/spotify] attempt ${attempt} failed:`, (error as Error).message, '| dns:', await reportDns(endpoint));
		if (attempt === 0) {
			await new Promise((r) => setTimeout(r, 400));
			return getUpstream(1);
		}
		throw error;
	}
}

export async function GET() {
	try {
		const data = await getUpstream(0);
		return Response.json(data, { headers: { 'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1' } });
	} catch (error) {
		return Response.json({ error: 'Failed to fetch current Spotify track' }, { status: 502 });
	}
}