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
			<body className="bg-ctp-crust font-sans">
				<nav className="sticky top-0 z-50 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] py-2.5 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:py-3">
					<div className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 px-4 py-2.5 shadow-lg shadow-ctp-mantle/40 backdrop-blur-md sm:px-5 sm:py-3">
						<a href="/" className="text-sm font-bold text-ctp-text">
							Rinne
						</a>
						<div className="flex items-center gap-3">
							<a
								href="https://github.com/rnnve"
								target="_blank"
								rel="noreferrer"
								className="text-xs text-ctp-subtext0 transition hover:text-ctp-text"
							>
								GitHub
							</a>
							<a
								href="https://haunt.gg/rnn"
								target="_blank"
								rel="noreferrer"
								className="text-xs text-ctp-subtext0 transition hover:text-ctp-text"
							>
								Links
							</a>
						</div>
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
