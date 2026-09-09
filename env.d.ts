declare namespace NodeJS {
	interface ProcessEnv {
		DISCORD_API_URL?: string;
		SPOTIFY_API_URL?: string;
		LASTFM_USERNAME?: string;
		/** Set as a secret on the host so it isn't reset on deploy. */
		LASTFM_API_KEY?: string;
		/** Optional — resolve Spotify CDN cover art for the Last.fm widget. */
		SPOTIFY_CLIENT_ID?: string;
		SPOTIFY_CLIENT_SECRET?: string;
	}
}

export {};
