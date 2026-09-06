import { useEffect, useState } from 'react';
import type { DiscordActivity, DiscordResponse, DiscordUserData } from '../lib/integrations';

interface DiscordProfileCardProps {
	endpoint?: string;
	refreshIntervalMs?: number;
}

const MEDIA_EXTERNAL_PREFIX = 'mp:external/';

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
			className="flex h-5 w-5 items-center justify-center rounded bg-zinc-700 text-[10px] font-bold text-zinc-300"
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
				<p className="truncate text-xs font-semibold text-zinc-200">{activity.name}</p>
				{activity.details && <p className="truncate text-xs text-zinc-400">{activity.details}</p>}
				{activity.state && <p className="truncate text-xs text-zinc-500">{activity.state}</p>}
			</div>
			{elapsed && <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">{elapsed}</span>}
		</li>
	);
}

export default function DiscordProfileCard({
	endpoint = '/api/discord',
	refreshIntervalMs = 30_000,
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
			<div className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Discord</span>
				<p className="mt-1">Unable to load: {error}</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Discord</span>
				<p className="mt-1">Loading profile…</p>
			</div>
		);
	}

	return (
		<div className="w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/60">
			<div className="px-4 py-4">
				<div className="flex items-center gap-3">
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
						<h3 className="truncate text-base font-bold text-white">{user.displayName}</h3>
						<span className="block text-sm text-zinc-500">@{user.username}</span>
						{user.customStatus && (
							<p className="mt-0.5 truncate text-sm text-zinc-300">“{user.customStatus}”</p>
						)}
						{user.boostBadge && (
							<p className="mt-0.5 text-xs text-zinc-400">Boosting {user.guildName}</p>
						)}
					</div>
				</div>
				{user.activities.length > 0 && (
					<ul className="mt-3 divide-y divide-zinc-800/70 border-t border-zinc-800">
						{user.activities.map((activity) => (
							<ActivityLine key={activity.applicationId ?? activity.name} activity={activity} />
						))}
					</ul>
				)}
			</div>
		</div>
	);
}