'use client';

import type { SpotifyNowPlaying } from '@/lib/integrations';
import Skeleton from '@/components/Skeleton';
import { useLive } from '@/components/LiveProvider';

function SpotifyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
		</svg>
	);
}

export default function SpotifyNowPlayingCard() {
	const { spotify, spotifyStopped, spotifyError } = useLive();

	if (spotifyStopped) {
		return (
			<div className="flex w-full min-w-0 items-center gap-3 sm:gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high/70 text-on-surface-variant sm:h-14 sm:w-14">
					<SpotifyIcon className="h-5 w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="relative flex h-2 w-2">
							<span className="relative inline-flex h-2 w-2 rounded-full bg-outline/60" />
						</span>
						<span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Spotify</span>
					</div>
					<p className="mt-1 truncate text-sm font-semibold text-on-surface-variant">No song playing</p>
					<p className="truncate text-xs text-on-surface-variant">Nothing scrobbling right now</p>
				</div>
			</div>
		);
	}

	if (spotifyError) {
		return (
			<div className="w-full min-w-0 text-sm text-on-surface-variant">
				<span className="font-semibold text-on-surface-variant">Spotify</span>
				<p className="mt-1">Unable to load: {spotifyError}</p>
			</div>
		);
	}

	if (!spotify) {
		return (
			<div className="flex w-full min-w-0 items-center gap-3 sm:gap-4">
				<Skeleton className="h-12 w-12 shrink-0 rounded-lg sm:h-14 sm:w-14" />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<Skeleton className="h-2 w-2 rounded-full" />
						<Skeleton className="h-3 w-28 rounded" />
					</div>
					<Skeleton className="mt-2 h-3.5 w-3/4 rounded" />
					<Skeleton className="mt-2 h-3 w-1/2 rounded" />
					<div className="mt-3 h-1 w-full rounded-full skeleton" />
				</div>
			</div>
		);
	}

	const data = spotify as SpotifyNowPlaying;

	return (
		<a
			href={data.trackUrl}
			target="_blank"
			rel="noreferrer"
			className="flex w-full min-w-0 items-center gap-3 text-on-surface no-underline transition hover:opacity-90 sm:gap-4"
		>
			{data.albumImageUrl ? (
				<img
					src={data.albumImageUrl}
					alt={`${data.album} cover`}
					width={56}
					height={56}
					fetchPriority="high"
					decoding="async"
					className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
				/>
			) : (
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark text-on-primary sm:h-14 sm:w-14">
					<SpotifyIcon className="h-6 w-6" />
				</div>
			)}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
					</span>
					<SpotifyIcon className="h-4 w-4 text-accent" />
					<span className="text-xs font-medium uppercase tracking-wider text-accent">
						Currently Playing
					</span>
				</div>
				<p className="mt-1 truncate text-sm font-semibold text-on-surface">{data.title}</p>
				<p className="truncate text-xs text-on-surface-variant">
					{data.artist} — <span className="text-on-surface-variant">{data.album}</span>
				</p>
			</div>
		</a>
	);
}