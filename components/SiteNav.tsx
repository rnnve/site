'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

function HomeIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.5 11.5 12 4l8.5 7.5" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.5 10.5V19a1 1 0 0 0 1 1H10v-5h4v5h2.5a1 1 0 0 0 1-1v-8.5" />
		</svg>
	);
}

function MusicIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12" />
			<circle cx="7" cy="18" r="2.5" />
			<circle cx="17" cy="16" r="2.5" />
		</svg>
	);
}

const MIN_PENDING_MS = 450;

const iconLink =
	'nav-icon-link inline-flex h-7 w-7 items-center justify-center rounded-lg text-on-surface-variant transition duration-200 ease-out hover:text-on-surface hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function PageSwitcher({
	homeActive,
	musicActive,
	onGo,
	vertical = false,
}: {
	homeActive: boolean;
	musicActive: boolean;
	onGo: (href: string) => void;
	vertical?: boolean;
}) {
	const indicatorPosition = musicActive
		? vertical
			? 'translate-y-[2rem]'
			: 'translate-x-[2rem]'
		: vertical
			? 'translate-y-0'
			: 'translate-x-0';

	return (
		<div
			className={`relative bg-surface-container-high/30 p-0.5 ${
				vertical ? 'flex flex-col items-center gap-1 rounded-xl' : 'flex items-center gap-1 rounded-lg'
			}`}
		>
			<span
				aria-hidden="true"
				className={`absolute rounded-md bg-primary-container shadow-sm shadow-scrim/40 transition-transform duration-300 ease-out ${
					vertical ? 'left-0.5 top-0.5 h-7 w-7' : 'inset-y-0.5 left-0.5 w-7'
				} ${indicatorPosition}`}
			/>
			<Link
				href="/"
				title="Home"
				aria-label="Home"
				aria-current={homeActive ? 'page' : undefined}
				onClick={() => onGo('/')}
				className={`${iconLink} relative ${homeActive ? 'text-on-primary-container' : ''}`}
			>
				<HomeIcon className="h-4 w-4" />
			</Link>
			<Link
				href="/music"
				title="Music"
				aria-label="Music"
				aria-current={musicActive ? 'page' : undefined}
				onClick={() => onGo('/music')}
				className={`${iconLink} relative ${musicActive ? 'text-on-primary-container' : ''}`}
			>
				<MusicIcon className="h-4 w-4" />
			</Link>
		</div>
	);
}

export default function SiteNav() {
	const pathname = usePathname() || '/';
	const [pending, setPending] = useState(false);
	const pendingRef = useRef(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			pendingRef.current = false;
			setPending(false);
		}, MIN_PENDING_MS);
		return () => clearTimeout(timer);
	}, [pathname]);

	const homeActive = pathname === '/';
	const musicActive = pathname === '/music' || pathname.startsWith('/music/');

	function go(href: string) {
		if (href === pathname || pendingRef.current) return;
		pendingRef.current = true;
		setPending(true);
	}

	return (
		<>
			<nav className="sticky top-0 z-50 mt-2 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:hidden">
				<div
					className={`relative mx-auto flex w-full max-w-4xl min-w-0 items-center justify-between overflow-visible rounded-xl border border-outline-variant bg-surface-container-high/80 px-1.5 py-0.5 shadow-lg shadow-scrim/40 backdrop-blur-md sm:px-2.5 sm:py-1 ${
						pending ? 'nav-shell-pending' : ''
					}`}
				>
{pending && (
					<div className="pointer-events-none fixed left-1/2 top-[max(0.5rem,env(safe-area-inset-top))] z-[60] -translate-x-1/2 lg:hidden">
						<div className="nav-loading-spinner" aria-hidden="true" />
					</div>
				)}
					<Link
						href="/"
						onClick={() => go('/')}
						className="relative z-10 inline-flex h-7 items-center rounded-lg px-1.5 text-sm font-bold text-on-surface transition hover:bg-surface-container-high/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
					>
						Rinne
					</Link>

					<div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center">
						<div className="pointer-events-auto">
							<PageSwitcher homeActive={homeActive} musicActive={musicActive} onGo={go} />
						</div>
					</div>

					<span className="invisible inline-flex h-7 items-center px-1.5 text-sm font-bold" aria-hidden="true">
						Rinne
					</span>
				</div>
			</nav>

			<nav aria-label="Site" className="hidden lg:block">
				<div className="fixed left-2 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-high/80 px-1.5 py-2 shadow-lg shadow-scrim/40 backdrop-blur-md">
					{pending && (
						<div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2">
							<div className="nav-loading-spinner" aria-hidden="true" />
						</div>
					)}
					<PageSwitcher vertical homeActive={homeActive} musicActive={musicActive} onGo={go} />
				</div>
			</nav>
		</>
	);
}