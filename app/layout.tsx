import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SiteNav from '@/components/SiteNav';
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
			<body className="flex h-dvh min-w-0 flex-col overflow-hidden bg-ctp-crust font-sans">
				<SiteNav />
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
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
