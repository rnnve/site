import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import type { DiscordResponse } from '../../lib/integrations';

export const prerender = false;

export const GET: APIRoute = async () => {
	const endpoint = getEnv('DISCORD_API_URL') || 'https://api.mapleji.xyz/v2/discord/user/1';

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(endpoint, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: `Discord API responded with ${response.status}` }),
				{ status: response.status, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const data = (await response.json()) as DiscordResponse;
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1',
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Discord API request timed out'
				: 'Failed to fetch Discord profile';
		return new Response(JSON.stringify({ error: message }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
