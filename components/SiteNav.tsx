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

type OutlineBox = {
	w: number;
	h: number;
	rx: number;
	stroke: number;
	left: number;
	top: number;
};

const STROKE = 2;

const iconLink =
	'nav-icon-link inline-flex h-8 w-8 items-center justify-center rounded-lg text-ctp-subtext0 transition duration-200 ease-out hover:bg-ctp-surface1/70 hover:text-ctp-text hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export default function SiteNav() {
	const pathname = usePathname() || '/';
	const [pending, setPending] = useState(false);
	const [outline, setOutline] = useState<OutlineBox | null>(null);
	const shellRef = useRef<HTMLDivElement>(null);
	const pendingRef = useRef(false);

	useEffect(() => {
		pendingRef.current = false;
		setPending(false);
	}, [pathname]);

	useEffect(() => {
		const el = shellRef.current;
		if (!el || typeof ResizeObserver === 'undefined') return;

		const update = () => {
			const styles = getComputedStyle(el);
			const borderLeft = Number.parseFloat(styles.borderLeftWidth) || 1;
			const borderTop = Number.parseFloat(styles.borderTopWidth) || 1;
			const radius = Number.parseFloat(styles.borderTopLeftRadius || '16') || 16;
			const w = el.offsetWidth;
			const h = el.offsetHeight;
			const inset = STROKE / 2;
			// Centerline of stroke on the outer border box; clamp so ends stay convex pills.
			const outerR = Math.min(radius, w / 2, h / 2);
			const rx = Math.max(0, Math.min(outerR - inset, (w - STROKE) / 2, (h - STROKE) / 2));
			setOutline({ w, h, rx, stroke: STROKE, left: -borderLeft, top: -borderTop });
		};

		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const homeActive = pathname === '/';
	const musicActive = pathname === '/music' || pathname.startsWith('/music/');

	function go(href: string) {
		if (href === pathname || pendingRef.current) return;
		pendingRef.current = true;
		setPending(true);
	}

	return (
		<nav className="sticky top-0 z-50 mt-2 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
			<div
				ref={shellRef}
				className={`relative mx-auto flex w-full max-w-4xl min-w-0 items-center justify-between overflow-visible rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 px-3 py-1.5 shadow-lg shadow-ctp-mantle/40 backdrop-blur-md sm:px-4 sm:py-2 ${
					pending ? 'nav-shell-pending' : ''
				}`}
			>
				{pending && outline && (
					<svg
						className="pointer-events-none absolute z-20 overflow-visible"
						width={outline.w}
						height={outline.h}
						viewBox={`0 0 ${outline.w} ${outline.h}`}
						style={{ left: outline.left, top: outline.top }}
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="nav-border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="var(--catppuccin-color-mauve)" />
								<stop offset="50%" stopColor="var(--catppuccin-color-pink)" />
								<stop offset="100%" stopColor="var(--catppuccin-color-lavender)" />
							</linearGradient>
						</defs>
						{/* Native rounded rect = always convex; matches computed border-radius. */}
						<rect
							className="nav-border-chase-path"
							x={outline.stroke / 2}
							y={outline.stroke / 2}
							width={outline.w - outline.stroke}
							height={outline.h - outline.stroke}
							rx={outline.rx}
							ry={outline.rx}
							fill="none"
							stroke="url(#nav-border-grad)"
							strokeWidth={outline.stroke}
							pathLength={1}
						/>
					</svg>
				)}
				<Link
					href="/"
					onClick={() => go('/')}
					className="relative z-10 inline-flex h-8 items-center rounded-lg px-2 text-sm font-bold text-ctp-text transition hover:bg-ctp-surface1/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					Rinne
				</Link>

				<div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center">
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

				<span className="invisible inline-flex h-8 items-center px-2 text-sm font-bold" aria-hidden="true">
					Rinne
				</span>
			</div>
		</nav>
	);
}
