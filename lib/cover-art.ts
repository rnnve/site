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
