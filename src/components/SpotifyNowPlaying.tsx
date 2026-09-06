import { useEffect, useState } from 'react';
import type { SpotifyNowPlaying } from '../lib/integrations';

interface SpotifyNowPlayingCardProps {
	endpoint?: string;
	refreshIntervalMs?: number;
}

function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function SpotifyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
		</svg>
	);
}

export default function SpotifyNowPlayingCard({
	endpoint = '/api/spotify',
	refreshIntervalMs = 1_000,
}: SpotifyNowPlayingCardProps) {
	const [data, setData] = useState<SpotifyNowPlaying | null>(null);
	const [stopped, setStopped] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [elapsedMs, setElapsedMs] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			if (typeof document !== 'undefined' && document.hidden) return;
			try {
				const response = await fetch(endpoint);
				if (!response.ok) {
					const body = (await response.json().catch(() => null)) as { error?: string } | null;
					throw new Error(body?.error ?? `Request failed with ${response.status}`);
				}
				const json = (await response.json()) as SpotifyNowPlaying | { error: string };
				if (cancelled) return;

				if ('error' in json) {
					setError(json.error);
					return;
				}

				if (!json.isPlaying) {
					setStopped(true);
					setData(null);
					setError(null);
					return;
				}

				setStopped(false);
				setData(json);
				setElapsedMs(Math.min(json.progressMs, json.durationMs));
				setError(null);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load Spotify data');
			}
		}

		void load();

		const loadingTimer = setInterval(() => void load(), refreshIntervalMs);
		const elapsedTimer = setInterval(() => {
			setElapsedMs((ms) => Math.min(ms + 1000, data?.durationMs ?? ms + 1000));
		}, 1000);
		const onVisible = () => {
			if (!document.hidden) void load();
		};
		document.addEventListener('visibilitychange', onVisible);

		return () => {
			cancelled = true;
			clearInterval(loadingTimer);
			clearInterval(elapsedTimer);
			document.removeEventListener('visibilitychange', onVisible);
		};
	}, [endpoint, refreshIntervalMs, data?.durationMs]);

	if (stopped) {
		return (
			<div className="flex w-full items-center gap-4 rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-4">
				<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-ctp-surface1/70 text-ctp-overlay1">
					<SpotifyIcon className="h-5 w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="relative flex h-2 w-2">
							<span className="relative inline-flex h-2 w-2 rounded-full bg-ctp-overlay2/60" />
						</span>
						<span className="text-xs font-medium uppercase tracking-wider text-ctp-overlay1">Spotify</span>
					</div>
					<p className="mt-1 truncate text-sm font-semibold text-ctp-subtext1">No song playing</p>
					<p className="truncate text-xs text-ctp-overlay1">Nothing scrobbling right now</p>
					<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ctp-surface1" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-4 text-sm text-ctp-subtext0">
				<span className="font-semibold text-ctp-overlay1">Spotify</span>
				<p className="mt-1">Unable to load: {error}</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex w-full items-center gap-4 rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-4">
				<div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-ctp-surface1" />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 animate-pulse rounded-full bg-ctp-surface2" />
						<span className="h-3 w-28 animate-pulse rounded bg-ctp-surface2" />
					</div>
					<p className="mt-2 h-3.5 w-3/4 animate-pulse rounded bg-ctp-surface1" />
					<p className="mt-2 h-3 w-1/2 animate-pulse rounded bg-ctp-surface1" />
					<div className="mt-3 h-1 w-full animate-pulse rounded-full bg-ctp-surface1" />
				</div>
			</div>
		);
	}

	const progressPercent = data.durationMs > 0 ? (elapsedMs / data.durationMs) * 100 : 0;

	return (
		<a
			href={data.trackUrl}
			target="_blank"
			rel="noreferrer"
			className="flex w-full items-center gap-4 rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-4 text-ctp-text no-underline transition hover:bg-ctp-surface1"
		>
			{data.albumImageUrl ? (
				<img
					src={data.albumImageUrl}
					alt={`${data.album} cover`}
					width={56}
					height={56}
					fetchPriority="high"
					decoding="async"
					className="h-14 w-14 shrink-0 rounded-lg object-cover"
				/>
			) : (
				<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark text-ctp-text">
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
				<p className="mt-1 truncate text-sm font-semibold text-ctp-text">{data.title}</p>
				<p className="truncate text-xs text-ctp-subtext0">
					{data.artist} — <span className="text-ctp-overlay1">{data.album}</span>
				</p>
				<div className="mt-2 flex items-center gap-2">
					<div className="h-1 w-full overflow-hidden rounded-full bg-ctp-surface1">
						<div
							className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					<span className="shrink-0 text-[10px] tabular-nums text-ctp-overlay1">
						{formatTime(elapsedMs)} / {formatTime(data.durationMs)}
					</span>
				</div>
			</div>
		</a>
	);
}