import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/global.css';

export const metadata: Metadata = {
	title: 'Rinne',
	description: 'Rinne — live Spotify, Discord and Last.fm status.',
	openGraph: {
		title: 'Rinne',
		description: 'Live Spotify, Discord and Last.fm status.',
	},
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon.ico' },
		],
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
};

const preconnects = [
	'https://spotify.mapleji.xyz',
	'https://api.mapleji.xyz',
	'https://ws.audioscrobbler.com',
	'https://i.scdn.co',
	'https://cdn.discordapp.com',
	'https://media.discordapp.net',
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`mocha ${GeistSans.variable} ${GeistMono.variable}`}>
			<head>
				{preconnects.map((href) => (
					<link key={href} rel="preconnect" href={href} crossOrigin="anonymous" />
				))}
			</head>
			<body className="min-h-dvh min-w-0 overflow-x-clip bg-ctp-crust font-sans">
				<nav className="sticky top-0 z-50 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
					<div className="mx-auto flex w-full max-w-4xl min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 px-3 py-1.5 shadow-lg shadow-ctp-mantle/40 backdrop-blur-md sm:px-4 sm:py-2">
						<a
							href="/"
							className="inline-flex min-h-11 min-w-11 items-center rounded-lg px-2 text-sm font-bold text-ctp-text transition hover:bg-ctp-surface1/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						>
							Rinne
						</a>
						<a
							href="/music"
							className="inline-flex min-h-11 items-center rounded-lg px-3 text-xs font-medium text-ctp-subtext0 transition hover:bg-ctp-surface1/60 hover:text-ctp-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						>
							Music
						</a>
					</div>
				</nav>
				{children}
				<Analytics />
				<SpeedInsights />
				<Script
					src="https://portus.sh/p.js"
					strategy="afterInteractive"
					data-site="prt_jjudtdtrznlr4buly6yo"
					defer
				/>
				<Script
					src="https://static.cloudflareinsights.com/beacon.min.js"
					strategy="afterInteractive"
					data-cf-beacon='{"token": "19e054ca2aae4e1d80634a3fb040be6a"}'
				/>
			</body>
		</html>
	);
}
