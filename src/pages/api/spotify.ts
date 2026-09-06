import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import type { SpotifyNowPlaying } from '../../lib/integrations';

export const prerender = false;

export const GET: APIRoute = async () => {
	const endpoint = env.SPOTIFY_API_URL || 'https://spotify.mapleji.xyz/api/spotify';

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(endpoint, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: `Spotify API responded with ${response.status}` }),
				{ status: response.status, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const data = (await response.json()) as SpotifyNowPlaying;
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1',
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Spotify API request timed out'
				: 'Failed to fetch current Spotify track';
		return new Response(JSON.stringify({ error: message }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};