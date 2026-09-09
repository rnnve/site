import { getEnv } from '@/lib/env';
import { augmentSpotifyImages } from '@/lib/spotify-search';
import { resolveLastFmImages } from '@/lib/lastfm-images';
import type {
	LastFmRecentTracksResponse,
	LastFmTopArtistsResponse,
	LastFmTopTracksResponse,
	LastFmUserInfoResponse,
} from '@/lib/integrations';

export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
	const apiKey = getEnv('LASTFM_API_KEY') || '';
	const username = getEnv('LASTFM_USERNAME') || '';

	if (!apiKey || !username) {
		return Response.json(
			{ error: 'LASTFM_API_KEY and LASTFM_USERNAME must be configured' },
			{ status: 500 },
		);
	}

	const url = new URL(request.url);
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
			return Response.json(
				{ error: `Last.fm API responded with ${response.status}` },
				{ status: response.status },
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
			return Response.json(
				{ error: data.message ?? `Last.fm error ${data.error}` },
				{ status: 502 },
			);
		}

		const clientId = getEnv('SPOTIFY_CLIENT_ID') || '';
		const clientSecret = getEnv('SPOTIFY_CLIENT_SECRET') || '';
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

		const maxAge = view === 'recent' ? 5 : 60;

		return Response.json(data, {
			headers: {
				'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
			},
		});
	} catch (error) {
		const message =
			error instanceof Error && error.name === 'AbortError'
				? 'Last.fm API request timed out'
				: 'Failed to fetch Last.fm data';
		return Response.json({ error: message }, { status: 502 });
	}
}
