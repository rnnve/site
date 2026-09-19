'use client';

import Skeleton from '@/components/Skeleton';
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
type LastFmView = 'recent' | 'toptracks' | 'topartists';
	type LastFmRecentTracksResponse,

const VIEWS: { id: LastFmView; label: string }[] = [
	{ id: 'toptracks', label: 'Top Tracks' },
	{ id: 'topartists', label: 'Top Artists' },
	{ id: 'recent', label: 'Recent' },
	{ id: 'info', label: 'Stats' },
];

type ViewData = {
	recent: LastFmRecentTracksResponse;
	toptracks: LastFmTopTracksResponse;
	topartists: LastFmTopArtistsResponse;
	info: LastFmUserInfoResponse;
};

interface LastFmWidgetProps {
	initialView?: LastFmView;
	onViewChange?: (view: LastFmView) => void;
	onUserInfo?: (user: LastFmUserInfo | null) => void;
}

function Rank({ rank }: { rank?: string }) {
	return (
		<span className="w-5 shrink-0 text-center text-[11px] font-semibold tabular-nums text-outline">
			{rank ?? ''}
		</span>
	);
}

function TrackImage({
	image,
	art,
	alt,
	priority = false,
}: {
	image: LastFmImage;
	art?: string;
	alt: string;
	priority?: boolean;
}) {
	const [currentSrc, setCurrentSrc] = useState<string | null>(null);
	
	// Use Spotify CDN when available (fastest), fallback to Last.fm small
	const spotifySrc = art;
	const lastfmSmall = lastfmImage(image, 'small');
	const lastfmMedium = lastfmImage(image, 'medium');
	
	const primarySrc = spotifySrc || lastfmSmall;
	const upgradeSrc = spotifySrc || lastfmMedium;
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (primarySrc && !isLastFmPlaceholder(primarySrc)) {
			setCurrentSrc(primarySrc);
			// Upgrade to higher quality in background
			if (upgradeSrc !== primarySrc && !isLastFmPlaceholder(upgradeSrc)) {
				const img = new Image();
				img.onload = () => setCurrentSrc(upgradeSrc);
				img.src = upgradeSrc;
			}
		}
	}, [primarySrc, upgradeSrc]);
		setFailed(false);
	if (!currentSrc || isLastFmPlaceholder(currentSrc) || failed) {

		return (
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface-container-high text-[10px] font-bold text-on-surface-variant">
				{alt.charAt(0)}
			</div>
		);
	}
	return (
			src={currentSrc}
			srcSet={upgradeSrc && upgradeSrc !== primarySrc && !isLastFmPlaceholder(upgradeSrc) 
				? `${primarySrc} 32w, ${upgradeSrc} 64w` 
				: undefined}
			sizes="36px"
		<img
			alt=""
			loading={priority ? 'eager' : 'lazy'}
			fetchPriority={priority ? 'high' : 'auto'}
			decoding="async"
			onError={() => setFailed(true)}
			width={36}
			className="h-9 w-9 shrink-0 rounded bg-surface-container-high object-cover transition-opacity duration-150"
			style={{ opacity: currentSrc === primarySrc && upgradeSrc !== primarySrc ? 0.8 : 1 }}
			height={36}
		/>
	);
}
function PlayCount({ count, t }: { count: string; t: ReturnType<typeof useI18n>['t'] }) {

	return (
			title={t.lastfmPlays.replace('{count}', count)}
		<span
			className="max-w-16 shrink-0 truncate text-[10px] tabular-nums text-on-surface-variant sm:max-w-24 sm:text-[11px]"
			{count}<span className="hidden min-[23rem]:inline"> {t.lastfmPlays.replace('{count}', '')}</span>
		>
		</span>
	);
}

function TrackRow({ track, priority }: { track: LastFmTrack; priority?: boolean }) {
	const nowPlaying = lastfmNowPlaying(track);

	return (
		<a
			href={track.url}
			target="_blank"
			rel="noreferrer"
			className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg py-2 text-on-surface no-underline transition hover:bg-surface-container-high/50 focus-visible:outline-2 focus-visible:outline-accent sm:gap-3"
		>
			<TrackImage image={track.image} art={track.spotifyImage} alt={track.name} priority={priority} />
			<div className="min-w-0 flex-1">
				<p className={`truncate text-xs font-semibold ${nowPlaying ? 'text-accent' : 'text-on-surface'}`}>
					{nowPlaying ? '▶ ' : ''}
					{track.name}
				</p>
				<p className="truncate text-[11px] text-on-surface-variant">
					{track.artist['#text']}
					{track.album?.['#text'] ? ` — ${track.album['#text']}` : ''}
				</p>
			</div>
		</a>
	);
}

function TopTrackRow({ track, priority }: { track: LastFmTopTrack; priority?: boolean }) {
	return (
		<a
			href={track.url}
			target="_blank"
			rel="noreferrer"
			className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg py-2 text-on-surface no-underline transition hover:bg-surface-container-high/50 focus-visible:outline-2 focus-visible:outline-accent sm:gap-3"
		>
			<Rank rank={track['@attr']?.rank} />
			<TrackImage image={track.image} art={track.spotifyImage} alt={track.name} priority={priority} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-on-surface">{track.name}</p>
				<p className="truncate text-[11px] text-on-surface-variant">{track.artist?.name}</p>
			<PlayCount count={track.playcount} t={useI18n().t} />
			</div>
		</a>
	);
}

function TopArtistRow({ artist, priority }: { artist: LastFmTopArtist; priority?: boolean }) {
	return (
		<a
			href={artist.url}
			target="_blank"
			rel="noreferrer"
			className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg py-2 text-on-surface no-underline transition hover:bg-surface-container-high/50 focus-visible:outline-2 focus-visible:outline-accent sm:gap-3"
		>
			<Rank rank={artist['@attr']?.rank} />
			<TrackImage image={artist.image} art={artist.spotifyImage} alt={artist.name} priority={priority} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-on-surface">{artist.name}</p>
			<PlayCount count={artist.playcount} t={useI18n().t} />
			</div>
		</a>
	);
}
function ViewTabs({ view, setView, t }: { view: LastFmView; setView: (v: LastFmView) => void; t: ReturnType<typeof useI18n>['t'] }) {
	const VIEWS: { id: LastFmView; label: string }[] = [
		{ id: 'toptracks', label: t.lastfmViews.toptracks },
		{ id: 'topartists', label: t.lastfmViews.topartists },
		{ id: 'recent', label: t.lastfmViews.recent },
	];
		<div className="-mx-1 shrink-0 bg-surface pb-2 pt-0.5">
			<div className="flex w-full min-w-0 flex-wrap gap-1.5 px-1">
export default function LastFmWidget({ initialView = 'toptracks', onViewChange, onUserInfo }: LastFmWidgetProps) {
	const { t } = useI18n();
	const [view, setView] = useState<LastFmView>(initialView);
				{VIEWS.map(({ id, label }) => (
	const registeredYear = user.registered?.unixtime
		? new Date(Number(user.registered.unixtime) * 1000).getUTCFullYear()
		: null;

	return (
		<div className="min-w-0 py-3">
			<div className="grid min-w-0 grid-cols-2 gap-2">
				<Stat label="Scrobbles" value={user.playcount} />
				<Stat label="Tracks" value={user.track_count} />
				<Stat label="Artists" value={user.artist_count} />
				<Stat label="Albums" value={user.album_count} />
			</div>
			{registeredYear && (
				<p className="mt-3 text-[11px] text-outline">Last.fm member since {registeredYear}</p>
			)}
		</div>
	);
}

export default function LastFmWidget() {
	const [view, setView] = useState<LastFmView>('toptracks');
	const { lastfm, lastfmError } = useLive();

	const viewData = lastfm[view];
	const viewError = lastfmError[view];

	const recentData = view === 'recent' ? (viewData as ViewData['recent'] | undefined) : undefined;
	const topTracksData = view === 'toptracks' ? (viewData as ViewData['toptracks'] | undefined) : undefined;
	const topArtistsData =
	// Keep fetching info view for user stats (shown in header)
	const infoData = (lastfm as Record<string, unknown>)['info'] as ViewData['info'] | undefined;

	useEffect(() => {
		onViewChange?.(view);
	}, [view, onViewChange]);

	useEffect(() => {
		onUserInfo?.(infoData?.user ?? null);
	}, [infoData, onUserInfo]);

	// Preload only first 5 images (small size for instant load)
	useEffect(() => {
		if (!viewData) return;
		const tracks = view === 'recent'
			? (viewData as ViewData['recent'])?.recenttracks?.track?.slice(0, 5)
			: view === 'toptracks'
				? (viewData as ViewData['toptracks'])?.toptracks?.track?.slice(0, 5)
				: (viewData as ViewData['topartists'])?.topartists?.artist?.slice(0, 5);
		tracks?.forEach((item) => {
			const spotifySrc = item.spotifyImage;
			const smallSrc = spotifySrc || (item.image ? lastfmImage(item.image, 'small') : null);
			if (smallSrc && !isLastFmPlaceholder(smallSrc)) {
		view === 'topartists' ? (viewData as ViewData['topartists'] | undefined) : undefined;

	return (
		<div className="flex w-full min-w-0 flex-col">
			<div className="-mx-1 shrink-0 bg-surface pb-2 pt-0.5">
				<div className="flex w-full min-w-0 flex-wrap gap-1.5 px-1">
					{VIEWS.map(({ id, label }) => (
						<button
							key={id}
							type="button"
							onClick={() => setView(id)}
							className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
								view === id
									? 'bg-primary-container text-on-primary-container'
									: 'bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>
			<div className="min-w-0">
				{viewError && !viewData && (
					<p key={view} className="animate-fade-in text-xs text-on-surface-variant">
						<span className="font-semibold text-on-surface-variant">Unable to load:</span> {viewError}
					</p>
				)}
				{!viewData && !viewError && (
					<div
						key={view}
						className="animate-fade-in space-y-3 p-2"
						aria-busy="true"
						aria-label="Loading"
					>
						{[...Array(5)].map((_, index) => (
							<Skeleton key={index} className="h-12 w-full rounded-lg" />
						))}
					</div>
				)}
				{viewData && (
					<div key={view} className="min-w-0 animate-fade-in">
						{recentData &&
							recentData.recenttracks.track.map((track, index) => (
								<TrackRow
									key={track.url + track.date?.uts + index}
									track={track}
									priority={index < 5}
								/>
							))}
						{topTracksData &&
							topTracksData.toptracks.track.map((track, index) => (
								<TopTrackRow key={track.url} track={track} priority={index < 5} />
							))}
						{topArtistsData &&
							topArtistsData.topartists.artist.map((artist, index) => (
								<TopArtistRow key={artist.url} artist={artist} priority={index < 5} />
							))}
						{infoData?.user && <StatsView user={infoData.user} />}
					</div>
				)}
			</div>
		</div>
	);
}
