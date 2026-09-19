'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import LastFmWidget from '@/components/LastFmWidget';
import SiteFooter from '@/components/SiteFooter';
import { useI18n } from '@/lib/i18n';
import type { LastFmUserInfo } from '@/lib/integrations';

function Stat({ label, value }: { label: string; value: string }) {
	const [displayValue, setDisplayValue] = useState(0);
	const targetValue = Number(value.replace(/,/g, ''));

	useEffect(() => {
		if (!targetValue) {
			setDisplayValue(0);
			return;
		}

		const duration = 1200;
		const startTime = Date.now();
		const startValue = 0;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.floor(startValue + (targetValue - startValue) * eased);

			setDisplayValue(current);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setDisplayValue(targetValue);
			}
		};

		requestAnimationFrame(animate);
	}, [targetValue]);

	// Format with commas
	const formatted = displayValue.toLocaleString();

	return (
		<div className="min-w-0 flex-1 rounded-lg bg-surface-container-high/60 px-4 py-3 flex flex-col items-center">
			<span className="text-base font-bold tabular-nums text-on-surface sm:text-xl">{formatted}</span>
			<span className="text-[11px] text-on-surface-variant">{label}</span>
		</div>
	);
}

function StatsHeader({ user, t }: { user: LastFmUserInfo; t: ReturnType<typeof useI18n>['t'] }) {
	return (
		<div className="w-full -mx-1 px-1">
			<div className="flex min-w-0 gap-2">
				<Stat label={t.lastfmStats.scrobbles} value={user.playcount} />
				<Stat label={t.lastfmStats.tracks} value={user.track_count} />
				<Stat label={t.lastfmStats.artists} value={user.artist_count} />
				<Stat label={t.lastfmStats.albums} value={user.album_count} />
			</div>
		</div>
	);
}

interface MusicContentProps {
	initialUserInfo?: LastFmUserInfo | null;
}

export default function MusicContent({ initialUserInfo = null }: MusicContentProps) {
	const { t } = useI18n();
	const [view, setView] = useState<'recent' | 'toptracks' | 'topartists'>('toptracks');
	const [userInfo, setUserInfo] = useState<LastFmUserInfo | null>(initialUserInfo);

	return (
	<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface text-on-surface">
		<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
			<section
				className="no-scrollbar flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain"
				aria-label={t.lastfmLabel}
			>
				<div className="m-auto flex w-full min-w-0 flex-col gap-4">
					<header className="min-w-0">
						<h1 className="text-lg font-semibold text-on-surface sm:text-xl">{t.navMusic}</h1>
						<p className="mt-1 text-sm text-on-surface-variant">{t.lastfmListeningHistory}</p>
						{userInfo && (
							<div className="mt-4 animate-fade-in">
								<StatsHeader user={userInfo} t={t} />
							</div>
						)}
					</header>
					<LastFmWidget
						initialView={view}
						onViewChange={setView}
