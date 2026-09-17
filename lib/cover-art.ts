interface DeezerSearchResponse {
	data?: Array<{
		album?: { cover_medium?: string; cover?: string };
		picture_medium?: string;
		picture?: string;
	}>;
}

interface ITunesSearchResponse {
	results?: Array<{
		artworkUrl100?: string;
		artworkUrl60?: string;
	}>;
}

const FETCH_TIMEOUT_MS = 2_500;
const POSITIVE_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const NEGATIVE_CACHE_TTL_MS = 60 * 60 * 1_000;

type CacheEntry = { url: string | null; expiresAt: number };

/** In-memory cover cache so repeated polls don't re-hit upstream APIs. */
const coverCache = new Map<string, CacheEntry>();

async function fetchJson<T>(url: string, userAgent = 'site/1.0'): Promise<T | null> {
	try {
		const response = await fetch(url, {
			headers: { 'User-Agent': userAgent },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
		if (!response.ok) return null;
		return (await response.json()) as T;
	} catch {
		return null;
	}
}

/**
 * Resolves a track/album cover quickly without API keys. Deezer is the
 * primary source, iTunes is the track fallback.
 */
