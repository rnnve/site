'use client';

import { useEffect, useState } from 'react';
import type { DiscordActivity, DiscordResponse, DiscordUserData } from '@/lib/integrations';

interface DiscordProfileCardProps {
	endpoint?: string;
	refreshIntervalMs?: number;
}

const MEDIA_EXTERNAL_PREFIX = 'mp:external/';

function DiscordIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.947 2.418-2.157 2.418z" />
		</svg>
	);
}

function activityIconUrl(activity: DiscordActivity): string | null {
	if (!activity.icon) return null;
	if (activity.icon.startsWith(MEDIA_EXTERNAL_PREFIX)) {
		return `https://media.discordapp.net/external/${activity.icon.slice(MEDIA_EXTERNAL_PREFIX.length)}`;
	}
	return `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.icon}.png`;
}

function ActivityIcon({ activity }: { activity: DiscordActivity }) {
	if (activity.emoji) {
		return <span aria-hidden="true">{activity.emoji}</span>;
	}
	const iconUrl = activityIconUrl(activity);
	if (iconUrl) {
		return (
			<img
				src={iconUrl}
				alt=""
				width={20}
				height={20}
				className="h-5 w-5 rounded"
			/>
		);
	}
	return (
		<span
			className="flex h-5 w-5 items-center justify-center rounded bg-ctp-surface1 text-[10px] font-bold text-ctp-subtext1"
			aria-hidden="true"
		>
			{activity.name.charAt(0)}
		</span>
	);
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	if (minutes > 0) return `${minutes}m ${seconds}s`;
	return `${seconds}s`;
}

function activityRunTime(activity: DiscordActivity): string {
	const timestamps = activity.timestamps;
	if (!timestamps?.start) return '';
	const elapsed = Date.now() - timestamps.start;
	return elapsed > 0 ? formatDuration(elapsed) : '';
}

function ActivityLine({ activity }: { activity: DiscordActivity }) {
	const [elapsed, setElapsed] = useState(activityRunTime(activity));

	useEffect(() => {
		setElapsed(activityRunTime(activity));
		const timer = setInterval(() => setElapsed(activityRunTime(activity)), 1000);
		return () => clearInterval(timer);
	}, [activity]);

	return (
		<li className="flex items-start gap-3 py-2">
			<ActivityIcon activity={activity} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-ctp-text">{activity.name}</p>
				{activity.details && <p className="truncate text-xs text-ctp-subtext0">{activity.details}</p>}
				{activity.state && <p className="truncate text-xs text-ctp-overlay1">{activity.state}</p>}
			</div>
			{elapsed && <span className="shrink-0 text-[11px] tabular-nums text-ctp-overlay1">{elapsed}</span>}
		</li>
	);
}

export default function DiscordProfileCard({
	endpoint = '/api/discord',
	refreshIntervalMs = 1_000,
}: DiscordProfileCardProps) {
	const [user, setUser] = useState<DiscordUserData | null>(null);
	const [error, setError] = useState<string | null>(null);

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
				const json = (await response.json()) as DiscordResponse | { error: string };
				if (cancelled) return;

				if ('error' in json) {
					setError(json.error);
					return;
				}
				if (!json.success) {
					throw new Error('Discord API returned unsuccessful response');
				}

				setUser(json.data);
				setError(null);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load Discord profile');
			}
		}

		void load();
		const timer = setInterval(() => void load(), refreshIntervalMs);
		const onVisible = () => {
			if (!document.hidden) void load();
		};
		document.addEventListener('visibilitychange', onVisible);

		return () => {
			cancelled = true;
			clearInterval(timer);
			document.removeEventListener('visibilitychange', onVisible);
		};
	}, [endpoint, refreshIntervalMs]);

	if (error) {
		return (
			<div className="w-full min-w-0 text-sm text-ctp-subtext0">
				<span className="font-semibold text-ctp-overlay1">Discord</span>
				<p className="mt-1">Unable to load: {error}</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="w-full min-w-0 text-sm text-ctp-subtext0">
				<span className="font-semibold text-ctp-overlay1">Discord</span>
				<p className="mt-1">Loading profile…</p>
			</div>
		);
	}

	return (
		<div className="w-full min-w-0">
				<div className="flex items-center gap-2">
					<DiscordIcon className="h-4 w-4 text-ctp-overlay1" />
					<span className="text-xs font-medium uppercase tracking-wider text-ctp-overlay1">Discord</span>
				</div>
				<div className="mt-3 flex items-center gap-3">
					<img
						src={user.avatar}
						alt={user.displayName}
						width={52}
						height={52}
						loading="lazy"
						decoding="async"
						className="h-13 w-13 shrink-0 rounded-full object-cover"
					/>
					<div className="min-w-0">
						<h3 className="truncate text-base font-bold text-ctp-text">{user.displayName}</h3>
						<span className="block text-sm text-ctp-overlay1">@{user.username}</span>
						{user.customStatus && (
							<p className="mt-0.5 truncate text-sm text-ctp-subtext1">“{user.customStatus}”</p>
						)}
						{user.boostBadge && (
							<p className="mt-0.5 text-xs text-ctp-subtext0">Boosting {user.guildName}</p>
						)}
					</div>
				</div>
				{user.activities.length > 0 && (
					<ul className="mt-3 divide-y divide-ctp-surface1/70 border-t border-ctp-surface1/70">
						{user.activities.map((activity) => (
							<ActivityLine key={activity.applicationId ?? activity.name} activity={activity} />
						))}
					</ul>
				)}
		</div>
	);
}
