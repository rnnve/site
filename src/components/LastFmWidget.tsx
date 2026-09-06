import { useEffect, useState } from 'react';
import {
	lastfmImage,
	lastfmNowPlaying,
	isLastFmPlaceholder,
	type LastFmImage,
	type LastFmTopArtist,
	type LastFmTopArtistsResponse,
	type LastFmTopTrack,
	type LastFmTopTracksResponse,
	type LastFmRecentTracksResponse,
	type LastFmTrack,
	type LastFmUserInfo,
	type LastFmUserInfoResponse,
} from '../lib/integrations';

function DiscordIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.947 2.418-2.157 2.418z" />
		</svg>
	);
}

function SpotifyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
		</svg>
	);
}

interface LastFmWidgetProps {
	endpoint?: string;
	trackCount?: number;
	/** Refresh interval for the Recent view (live sync). */
	recentRefreshMs?: number;
	/** Refresh interval for Top Tracks / Top Artists / Stats. */
	refreshIntervalMs?: number;
}

type LastFmView = 'recent' | 'toptracks' | 'topartists' | 'info';

const VIEWS: { id: LastFmView; label: string }[] = [
	{ id: 'recent', label: 'Recent' },
	{ id: 'toptracks', label: 'Top Tracks' },
	{ id: 'topartists', label: 'Top Artists' },
	{ id: 'info', label: 'Stats' },
];

const ALL_VIEWS = VIEWS.map((v) => v.id);

type ViewData = {
	recent: LastFmRecentTracksResponse;
	toptracks: LastFmTopTracksResponse;
	topartists: LastFmTopArtistsResponse;
	info: LastFmUserInfoResponse;
};

type UsernameShape = {
	recenttracks?: { '@attr'?: { user?: string } };
	toptracks?: { '@attr'?: { user?: string } };
	topartists?: { '@attr'?: { user?: string } };
	user?: { name?: string };
};

function Rank({ rank }: { rank?: string }) {
	return (
		<span className="w-5 shrink-0 text-center text-[11px] font-semibold tabular-nums text-ctp-overlay0">
			{rank ?? ''}
		</span>
	);
}

function TrackImage({ image, art, alt }: { image: LastFmImage; art?: string; alt: string }) {
	const [failed, setFailed] = useState(false);
	const src = art || lastfmImage(image, 'medium');

	useEffect(() => {
		setFailed(false);
	}, [src]);

	if (!src || isLastFmPlaceholder(src) || failed) {
		return (
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ctp-surface1 text-[10px] font-bold text-ctp-overlay1">
				{alt.charAt(0)}
			</div>
		);
	}
	return (
		<img
			src={src}
			alt=""
			loading="lazy"
			decoding="async"
			onError={() => setFailed(true)}
			width={36}
			height={36}
			className="h-9 w-9 shrink-0 rounded bg-ctp-surface1 object-cover"
		/>
	);
}

function PlayCount({ count }: { count: string }) {
	return <span className="shrink-0 text-[11px] tabular-nums text-ctp-overlay1">{count} plays</span>;
}

function TrackRow({ track }: { track: LastFmTrack }) {
	const nowPlaying = lastfmNowPlaying(track);

	return (
		<a
			href={track.url}
			target="_blank"
			rel="noreferrer"
			className="flex items-center gap-3 py-2 text-ctp-text no-underline transition hover:bg-ctp-surface1/50"
		>
			<TrackImage image={track.image} art={track.spotifyImage} alt={track.name} />
			<div className="min-w-0 flex-1">
				<p className={`truncate text-xs font-semibold ${nowPlaying ? 'text-accent' : 'text-ctp-text'}`}>
					{nowPlaying ? '▶ ' : ''}
					{track.name}
				</p>
				<p className="truncate text-[11px] text-ctp-overlay1">
					{track.artist['#text']}
					{track.album?.['#text'] ? ` — ${track.album['#text']}` : ''}
				</p>
			</div>
		</a>
	);
}

function TopTrackRow({ track }: { track: LastFmTopTrack }) {
	return (
		<a
			href={track.url}
			target="_blank"
			rel="noreferrer"
			className="flex items-center gap-3 py-2 text-ctp-text no-underline transition hover:bg-ctp-surface1/50"
		>
			<Rank rank={track['@attr']?.rank} />
			<TrackImage image={track.image} art={track.spotifyImage} alt={track.name} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-ctp-text">{track.name}</p>
				<p className="truncate text-[11px] text-ctp-overlay1">{track.artist?.name}</p>
			</div>
			<PlayCount count={track.playcount} />
		</a>
	);
}

function TopArtistRow({ artist }: { artist: LastFmTopArtist }) {
	return (
		<a
			href={artist.url}
			target="_blank"
			rel="noreferrer"
			className="flex items-center gap-3 py-2 text-ctp-text no-underline transition hover:bg-ctp-surface1/50"
		>
			<Rank rank={artist['@attr']?.rank} />
			<TrackImage image={artist.image} art={artist.spotifyImage} alt={artist.name} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-ctp-text">{artist.name}</p>
			</div>
			<PlayCount count={artist.playcount} />
		</a>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5 rounded-lg bg-ctp-surface1/60 px-3 py-2.5">
			<span className="text-xl font-bold tabular-nums text-ctp-text">{value}</span>
			<span className="text-[11px] text-ctp-overlay1">{label}</span>
		</div>
	);
}

function StatsView({ user }: { user: LastFmUserInfo }) {
	const registeredYear = user.registered?.unixtime
		? new Date(Number(user.registered.unixtime) * 1000).getUTCFullYear()
		: null;

	return (
		<div className="py-3">
			<div className="grid grid-cols-2 gap-2">
				<Stat label="Scrobbles" value={user.playcount} />
				<Stat label="Tracks" value={user.track_count} />
				<Stat label="Artists" value={user.artist_count} />
				<Stat label="Albums" value={user.album_count} />
			</div>
			{registeredYear && (
				<p className="mt-3 text-[11px] text-ctp-overlay0">Last.fm member since {registeredYear}</p>
			)}
		</div>
	);
}

export default function LastFmWidget({
	endpoint = '/api/lastfm',
	trackCount = 10,
	recentRefreshMs = 5_000,
	refreshIntervalMs = 5_000,
}: LastFmWidgetProps) {
	const [view, setView] = useState<LastFmView>('recent');
	const [data, setData] = useState<Partial<ViewData>>({});
	const [errors, setErrors] = useState<Partial<Record<LastFmView, string>>>({});

	useEffect(() => {
		let cancelled = false;

		async function loadViews(views: LastFmView[]) {
			if (document.hidden) return;

			await Promise.all(
				views.map(async (v) => {
					try {
						const response = await fetch(`${endpoint}?view=${v}&limit=${trackCount}`);
						if (!response.ok) {
							const body = (await response.json().catch(() => null)) as { error?: string } | null;
							throw new Error(body?.error ?? `Request failed with ${response.status}`);
						}
						const json = (await response.json()) as ViewData[LastFmView] & {
							error?: number | string;
							message?: string;
						};
						if (cancelled) return;

						if (json.error) {
							throw new Error(json.message ?? String(json.error));
						}

						setData((current) => ({ ...current, [v]: json }));
						setErrors((current) => (current[v] ? { ...current, [v]: undefined } : current));
					} catch (err) {
						if (cancelled) return;
						setErrors((current) => ({
							...current,
							[v]: err instanceof Error ? err.message : `Failed to load ${v}`,
						}));
					}
				}),
			);
		}

		const otherViews = (['toptracks', 'topartists', 'info'] as const).filter(
			(v): v is Exclude<LastFmView, 'recent'> => v !== view,
		);

		void loadViews(ALL_VIEWS);
		const fastTimer = setInterval(() => void loadViews(['recent']), recentRefreshMs);
		const slowTimer = setInterval(() => void loadViews(otherViews), refreshIntervalMs);
		const onVisible = () => {
			if (!document.hidden) void loadViews(ALL_VIEWS);
		};
		document.addEventListener('visibilitychange', onVisible);

		return () => {
			cancelled = true;
			clearInterval(fastTimer);
			clearInterval(slowTimer);
			document.removeEventListener('visibilitychange', onVisible);
		};
	}, [endpoint, trackCount, recentRefreshMs, refreshIntervalMs, view]);

	const viewData = data[view];
	const viewError = errors[view];
	const raw = viewData as UsernameShape | undefined;
	const username = viewData
		? (raw?.recenttracks?.['@attr']?.user ??
			raw?.toptracks?.['@attr']?.user ??
			raw?.topartists?.['@attr']?.user ??
			raw?.user?.name ??
			null)
		: null;

	const recentData = view === 'recent' ? (viewData as ViewData['recent'] | undefined) : undefined;
	const topTracksData = view === 'toptracks' ? (viewData as ViewData['toptracks'] | undefined) : undefined;
	const topArtistsData =
		view === 'topartists' ? (viewData as ViewData['topartists'] | undefined) : undefined;
	const infoData = view === 'info' ? (viewData as ViewData['info'] | undefined) : undefined;

	return (
		<div className="w-full rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-xs font-semibold uppercase tracking-wider text-ctp-overlay1">Last.fm</h3>
					<div className="flex items-center gap-1.5 text-ctp-overlay0">
						<SpotifyIcon className="h-3.5 w-3.5" />
						<DiscordIcon className="h-3.5 w-3.5" />
					</div>
				</div>
				{username && <span className="text-[11px] text-ctp-overlay0">@{username}</span>}
			</div>
			<div className="mt-3 flex flex-wrap gap-1">
				{VIEWS.map(({ id, label }) => (
					<button
						key={id}
						type="button"
						onClick={() => setView(id)}
						className={`rounded-full px-3 py-1 text-xs font-medium transition ${
							view === id
								? 'bg-accent text-ctp-base'
								: 'bg-ctp-surface1/60 text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text'
						}`}
					>
						{label}
					</button>
				))}
			</div>
			{viewError && !viewData && (
				<p key={view} className="mt-3 animate-fade-in text-xs text-ctp-subtext0">
					<span className="font-semibold text-ctp-overlay1">Unable to load:</span> {viewError}
				</p>
			)}
			{!viewData && !viewError && (
				<p key={view} className="mt-3 animate-fade-in text-xs text-ctp-subtext0">
					Loading…
				</p>
			)}
			{viewData && (
				<div key={view} className="mt-2 animate-fade-in divide-y divide-ctp-surface1/70">
					{recentData &&
						recentData.recenttracks.track.map((track, index) => (
							<TrackRow key={track.url + track.date?.uts + index} track={track} />
						))}
					{topTracksData &&
						topTracksData.toptracks.track.map((track) => (
							<TopTrackRow key={track.url} track={track} />
						))}
					{topArtistsData &&
						topArtistsData.topartists.artist.map((artist) => (
							<TopArtistRow key={artist.url} artist={artist} />
						))}
					{infoData?.user && <StatsView user={infoData.user} />}
				</div>
			)}
		</div>
	);
}