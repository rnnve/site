'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
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

const iconLink =
	'nav-icon-link inline-flex h-8 w-8 items-center justify-center rounded-lg text-ctp-subtext0 transition duration-200 ease-out hover:bg-ctp-surface1/70 hover:text-ctp-text hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export default function SiteNav() {
	const pathname = usePathname() || '/';
	const [pending, setPending] = useState(false);
	const [, startTransition] = useTransition();

	useEffect(() => {
		setPending(false);
	}, [pathname]);

	const homeActive = pathname === '/';
	const musicActive = pathname === '/music' || pathname.startsWith('/music/');

	function go(href: string) {
		if (href === pathname) return;
		setPending(true);
		startTransition(() => {
			/* Link handles navigation; pending clears on pathname change */
		});
	}

	return (
		<nav className="sticky top-0 z-50 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
			{pending && (
				<div
					className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
					aria-hidden="true"
				>
					<div className="nav-route-progress h-full w-1/3 rounded-full bg-accent" />
				</div>
			)}
			<div className="relative mx-auto flex w-full max-w-4xl min-w-0 items-center justify-between rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 px-3 py-1.5 shadow-lg shadow-ctp-mantle/40 backdrop-blur-md sm:px-4 sm:py-2">
				<Link
					href="/"
					onClick={() => go('/')}
					className="inline-flex h-8 items-center rounded-lg px-2 text-sm font-bold text-ctp-text transition hover:bg-ctp-surface1/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					Rinne
				</Link>

				<div className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center">
					<div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-ctp-surface1/30 p-0.5">
						<Link
							href="/"
							title="Home"
							aria-label="Home"
							aria-current={homeActive ? 'page' : undefined}
							onClick={() => go('/')}
							className={`${iconLink} ${homeActive ? 'nav-icon-link-active bg-ctp-surface1 text-accent' : ''}`}
						>
							<HomeIcon className="h-4 w-4" />
						</Link>
						<Link
							href="/music"
							title="Music"
							aria-label="Music"
							aria-current={musicActive ? 'page' : undefined}
							onClick={() => go('/music')}
							className={`${iconLink} ${musicActive ? 'nav-icon-link-active bg-ctp-surface1 text-accent' : ''}`}
						>
							<MusicIcon className="h-4 w-4" />
						</Link>
					</div>
				</div>

				{/* spacer keeps brand balanced while icons stay centered */}
				<span className="invisible inline-flex h-8 items-center px-2 text-sm font-bold" aria-hidden="true">
					Rinne
				</span>
			</div>
		</nav>
	);
}
