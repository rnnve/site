'use client';

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

const linkBase =
	'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export default function SiteNav() {
	const pathname = usePathname() || '/';
	const homeActive = pathname === '/';
	const musicActive = pathname === '/music' || pathname.startsWith('/music/');

	return (
		<nav className="sticky top-0 z-50 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
			<div className="mx-auto flex w-full max-w-4xl min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 px-3 py-1.5 shadow-lg shadow-ctp-mantle/40 backdrop-blur-md sm:px-4 sm:py-2">
				<a
					href="/"
					className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-ctp-text transition hover:bg-ctp-surface1/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					Rinne
				</a>
				<div className="flex items-center gap-1">
					<a
						href="/"
						title="Home"
						aria-label="Home"
						aria-current={homeActive ? 'page' : undefined}
						className={`${linkBase} ${
							homeActive
								? 'bg-ctp-surface1 text-accent'
								: 'text-ctp-subtext0 hover:bg-ctp-surface1/60 hover:text-ctp-text'
						}`}
					>
						<HomeIcon className="h-5 w-5" />
					</a>
					<a
						href="/music"
						title="Music"
						aria-label="Music"
						aria-current={musicActive ? 'page' : undefined}
						className={`${linkBase} ${
							musicActive
								? 'bg-ctp-surface1 text-accent'
								: 'text-ctp-subtext0 hover:bg-ctp-surface1/60 hover:text-ctp-text'
						}`}
					>
						<MusicIcon className="h-5 w-5" />
					</a>
				</div>
			</div>
		</nav>
	);
}
