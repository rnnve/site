import { getEnv } from '@/lib/env';
import type { SpotifyNowPlaying } from '@/lib/integrations';

export const dynamic = 'force-dynamic';

export async function GET() {
	const endpoint = getEnv('SPOTIFY_API_URL') || 'https://spotify.mapleji.xyz/api/spotify';

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(endpoint, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return Response.json(
				{ error: `Spotify API responded with ${response.status}` },
				{ status: response.status },
			);
		}

		const data = (await response.json()) as SpotifyNowPlaying;
		return Response.json(data, {
			headers: {
				'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1',
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Spotify API request timed out'
				: 'Failed to fetch current Spotify track';
		return Response.json({ error: message }, { status: 502 });
	}
}
