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
	recentRefreshMs = 10_000,
	refreshIntervalMs = 60_000,
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
				<h3 className="text-xs font-semibold uppercase tracking-wider text-ctp-overlay1">Last.fm</h3>
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