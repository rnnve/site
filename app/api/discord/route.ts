import { getEnv } from '@/lib/env';
import type { DiscordResponse } from '@/lib/integrations';

export const dynamic = 'force-dynamic';

export async function GET() {
	const endpoint = getEnv('DISCORD_API_URL') || 'https://api.mapleji.xyz/v2/discord/user/1';

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(endpoint, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return Response.json(
				{ error: `Discord API responded with ${response.status}` },
				{ status: response.status },
			);
		}

		const data = (await response.json()) as DiscordResponse;
		return Response.json(data, {
			headers: {
				'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1',
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Discord API request timed out'
				: 'Failed to fetch Discord profile';
		return Response.json({ error: message }, { status: 502 });
	}
}
