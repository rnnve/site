export interface SpotifyNowPlaying {
	isPlaying: boolean;
	title: string;
	artist: string;
	album: string;
	albumImageUrl: string;
	progressMs: number;
	durationMs: number;
	trackUrl: string;
}

export interface DiscordActivity {
	name: string;
	type: string;
	details: string | null;
	state: string | null;
	emoji: string | null;
	applicationId: string;
	icon: string | null;
	timestamps: {
		start: number | null;
		end: number | null;
	} | null;
}

export interface DiscordSpotify {
	song: string;
	artist: string;
	album: string;
	cover: string;
	startedAt: number;
	endsAt: number;
}

export interface DiscordUserData {
	id: string;
	username: string;
	displayName: string;
	globalName: string;
	avatar: string;
	banner: string;
	accentColor: string;
	badges: string[];
	premiumType: number | null;
	premiumBadge: string | null;
	boostBadge: string | null;
	boostedSince: string | null;
	status: string;
	customStatus: string | null;
	spotify: DiscordSpotify | null;
	activities: DiscordActivity[];
	mobile: boolean;
	desktop: boolean;
	web: boolean;
	guildId: string;
	guildName: string;
	createdAt: string;
	updatedAt: number;
}

export interface DiscordResponse {
	success: boolean;
	data: DiscordUserData;
}

export interface DiscordActivityRunTime {
	start: number | null;
	end: number | null;
}

interface LastFmTrackDate {
	uts: string;
	'#text': string;
}

export interface LastFmTrack {
	name: string;
	mbid: string;
	url: string;
	artist: {
		'#text': string;
		mbid: string;
	};
	album: {
		'#text': string;
		mbid: string;
	};
	image: Array<{
		size: string;
		'#text': string;
	}>;
	/** Resolved album cover hosted on Spotify's CDN (i.scdn.co). */
	spotifyImage?: string;
	date?: LastFmTrackDate;
	'@attr'?: {
		nowplaying: string;
	};
}

export interface LastFmRecentTracksResponse {
	recenttracks: {
		track: LastFmTrack[];
		'@attr': {
			user: string;
			page: string;
			perPage: string;
			totalPages: string;
			total: string;
		};
	};
	error?: number;
	message?: string;
}

export const LASTFM_IMAGE = {
	small: 'small',
	medium: 'medium',
	large: 'large',
	extralarge: 'extralarge',
} as const;

export type LastFmImage = Array<{ size: string; '#text': string }>;

/** Hashes Last.fm uses for its generic "no cover" placeholder images. */
export const LASTFM_PLACEHOLDER_HASHES = [
	'2a96cbd8b46e442fc41c2b86b821562f',
	'8181483806820e0ca3bcf25a86b6e4f8',
] as const;

export function isLastFmPlaceholder(url: string): boolean {
	return !url || LASTFM_PLACEHOLDER_HASHES.some((hash) => url.includes(hash));
}

export interface LastFmTopTrack {
	name: string;
	url: string;
	playcount: string;
	artist?: { name: string; url?: string };
	image: LastFmImage;
	/** Resolved album cover hosted on Spotify's CDN (i.scdn.co). */
	spotifyImage?: string;
	'@attr'?: { rank: string };
}

export interface LastFmTopTracksResponse {
	toptracks: {
		track: LastFmTopTrack[];
		'@attr': { user: string };
	};
	error?: number;
	message?: string;
}

export interface LastFmTopArtist {
	name: string;
	url: string;
	playcount: string;
	image: LastFmImage;
	/** Resolved artist image hosted on Spotify's CDN (i.scdn.co). */
	spotifyImage?: string;
	'@attr'?: { rank: string };
}

export interface LastFmTopArtistsResponse {
	topartists: {
		artist: LastFmTopArtist[];
		'@attr': { user: string };
	};
	error?: number;
	message?: string;
}

export interface LastFmUserInfo {
	name: string;
	url: string;
	playcount: string;
	artist_count: string;
	track_count: string;
	album_count: string;
	registered?: { unixtime: string; '#text'?: string };
}

export interface LastFmUserInfoResponse {
	user?: LastFmUserInfo;
	error?: number;
	message?: string;
}

export function lastfmImage(images: LastFmImage | undefined, size: string = 'large'): string {
	if (!images?.length) return '';
	const match = images.find((img) => img.size === size);
	return match?.['#text'] ?? images[images.length - 1]?.['#text'] ?? '';
}

export function lastfmNowPlaying(track: LastFmTrack): boolean {
	return track['@attr']?.nowplaying === 'true';
}
