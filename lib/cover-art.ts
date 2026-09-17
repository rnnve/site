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
