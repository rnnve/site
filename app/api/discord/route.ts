import { getEnv } from '@/lib/env';
import type { DiscordResponse } from '@/lib/integrations';

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
			console.warn(`[api/discord] retrying after: ${error.message}`);
			await new Promise((r) => setTimeout(r, 400));
			return fetchUpstream(endpoint, 1);
		}
		throw error;
	}
}

export async function GET() {
	const endpoint = getEnv('DISCORD_API_URL') || 'https://api.mapleji.xyz/v2/discord/user/1';

	try {
		const res = await fetchUpstream(endpoint, 0);

		if (!res.ok) {
			console.error(`[api/discord] upstream ${res.status}`);
			return Response.json({ error: `Discord API responded with ${res.status}` }, { status: res.status });
		}

		const data = (await res.json()) as DiscordResponse;
		return Response.json(data, { headers: { 'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=1' } });
	} catch (error) {
		console.error('[api/discord] fetch failed:', error);
		return Response.json({ error: 'Failed to fetch Discord profile' }, { status: 502 });
	}
}