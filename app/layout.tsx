import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Chakra_Petch } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SiteNav from '@/components/SiteNav';
import { DocumentLanguageSync } from '@/components/DocumentLanguageSync';
import { I18nProvider } from '@/lib/i18n';
import '@/styles/global.css';

const chakraPetch = Chakra_Petch({
	subsets: ['thai', 'latin'],
	variable: '--font-chakra-petch',
	display: 'swap',
	weight: ['400', '500', '600', '700'],
});

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
	'https://lastfm-img.freetls.fastly.net',
	'https://is1-ssl.mzstatic.com',
	'https://cdn-images.dzcdn.net',
	'https://cdn.discordapp.com',
	'https://media.discordapp.net',
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${chakraPetch.variable}`}>
			<head>
				{preconnects.map((href) => (
					<link key={href} rel="preconnect" href={href} crossOrigin="anonymous" />
				))}
			</head>
			<body className="flex h-dvh min-w-0 flex-col overflow-hidden bg-surface font-sans">
				<I18nProvider>
					<DocumentLanguageSync />
					<SiteNav />
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-14">{children}</div>
				</I18nProvider>
				<Analytics />
				<SpeedInsights />
				<Script
					defer
					src="/hub/p.js"
					data-site="prt_jjudtdtrznlr4buly6yo"
					data-api="/hub/e"
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
