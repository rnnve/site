import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';
import { augmentSpotifyImages } from '../../lib/spotify-search';
import { resolveLastFmImages } from '../../lib/lastfm-images';
import type {
	LastFmRecentTracksResponse,
	LastFmTopArtistsResponse,
	LastFmTopTracksResponse,
	LastFmUserInfoResponse,
} from '../../lib/integrations';

export const prerender = false;

const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/';

const VIEWS = ['recent', 'toptracks', 'topartists', 'info'] as const;
type LastFmView = (typeof VIEWS)[number];

const METHOD_BY_VIEW: Record<LastFmView, string> = {
	recent: 'user.getrecenttracks',
	toptracks: 'user.gettoptracks',
	topartists: 'user.gettopartists',
	info: 'user.getinfo',
};

const DEFAULT_LIMIT_BY_VIEW: Record<LastFmView, string> = {
	recent: '10',
	toptracks: '10',
	topartists: '10',
	info: '1',
};

export const GET: APIRoute = async ({ url }) => {
	const apiKey = env.LASTFM_API_KEY || '';
	const username = env.LASTFM_USERNAME || '';

	if (!apiKey || !username) {
		return new Response(
			JSON.stringify({
				error: 'LASTFM_API_KEY and LASTFM_USERNAME must be configured',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		);
	}

	const rawView = url.searchParams.get('view');
	const view: LastFmView = (VIEWS as readonly string[]).includes(rawView ?? '')
		? (rawView as LastFmView)
		: 'recent';

	const params = new URLSearchParams({
		method: METHOD_BY_VIEW[view],
		user: username,
		api_key: apiKey,
		format: 'json',
	});

	if (view !== 'info') {
		params.set('limit', url.searchParams.get('limit') ?? DEFAULT_LIMIT_BY_VIEW[view]);
	}

	if (view === 'toptracks' || view === 'topartists') {
		params.set('period', 'overall');
	}

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		const response = await fetch(`${LASTFM_URL}?${params}`, { signal: controller.signal });
		clearTimeout(timeout);

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: `Last.fm API responded with ${response.status}` }),
				{ status: response.status, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const data = (await response.json()) as {
			error?: number;
			message?: string;
		} & (
			| LastFmRecentTracksResponse
			| LastFmTopTracksResponse
			| LastFmTopArtistsResponse
			| LastFmUserInfoResponse
		);

		if (data.error) {
			return new Response(
				JSON.stringify({ error: data.message ?? `Last.fm error ${data.error}` }),
				{ status: 502, headers: { 'Content-Type': 'application/json' } },
			);
		}

		const clientId = env.SPOTIFY_CLIENT_ID || '';
		const clientSecret = env.SPOTIFY_CLIENT_SECRET || '';
		if ('recenttracks' in data && Array.isArray(data.recenttracks.track)) {
			if (clientId && clientSecret) {
				await augmentSpotifyImages(data.recenttracks.track, 'track', clientId, clientSecret);
			}
		} else if ('toptracks' in data && Array.isArray(data.toptracks.track)) {
			if (clientId && clientSecret) {
				await augmentSpotifyImages(data.toptracks.track, 'track', clientId, clientSecret);
			}
			await resolveLastFmImages(data.toptracks.track, 'track', apiKey);
		} else if ('topartists' in data && Array.isArray(data.topartists.artist)) {
			if (clientId && clientSecret) {
				await augmentSpotifyImages(data.topartists.artist, 'artist', clientId, clientSecret);
			}
			await resolveLastFmImages(data.topartists.artist, 'artist', apiKey);
		}

		const maxAge = view === 'recent' ? 10 : 60;

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Last.fm API request timed out'
				: 'Failed to fetch Last.fm data';
		return new Response(JSON.stringify({ error: message }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};