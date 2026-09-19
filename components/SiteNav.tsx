'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties, type ComponentType } from 'react';
import { useI18n } from '@/lib/i18n';
import { motion, MotionConfig } from 'framer-motion';

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

function MenuIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	);
	key: string;
}
	href: string
	Icon: ComponentType<{ className?: string }>
}

const items: NavItem[] = [
	{ label: 'Home', href: '/', Icon: HomeIcon },
	{ label: 'Music', href: '/music', Icon: MusicIcon },
];

const containerStyle: CSSProperties = {
	background: 'rgba(0,0,0,0.8)',
	backdropFilter: 'blur(24px)',
	WebkitBackdropFilter: 'blur(24px)',
	border: '1px solid rgba(255,255,255,0.08)',
	boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
};

const pillTransition = {
	type: 'spring' as const,
	stiffness: 600,
	damping: 24,
	mass: 0.4,
};

function NavButton({
	item,
	active,
	pillId,
}: {
	item: NavItem
	active: boolean
	pillId: string
}) {
	const { label, href, Icon } = item;

	return (
		<Link
			href={href}
			aria-label={label}
			title={label}
			className="relative flex h-8 w-8 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:h-9 md:w-9"
		>
			{active && (
				<motion.span
					layoutId={pillId}
					className="absolute inset-0 rounded-lg border border-white/50"
					transition={pillTransition}
				/>
			)}
			<motion.span
				className="relative z-10 flex h-full w-full items-center justify-center"
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.95 }}
				transition={{ duration: 0.15, ease: 'easeOut' }}
				style={{
					color: active ? '#ffffff' : '#8E8E93',
					opacity: active ? 1 : 0.65,
					transition: 'color 0.15s ease-out, opacity 0.15s ease-out',
				}}
			>
				<Icon className="h-4 w-4 md:h-5 md:w-5" />
			</motion.span>
		</Link>
	);
}

export default function SiteNav() {
	const pathname = usePathname() || '/';

	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

	return (
		<MotionConfig reducedMotion="user">
			<nav
				aria-label="Main navigation"
				className="fixed top-1/2 left-5 z-50 hidden -translate-y-1/2 md:block"
			>
				<div className="flex flex-col gap-0.5 rounded-xl p-1.5" style={containerStyle}>
					{items.map((item) => (
						<NavButton key={item.href} item={item} active={isActive(item.href)} pillId="nav-pill" />
					))}
				</div>
			</nav>

			<nav
				aria-label="Main navigation"
				className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 md:hidden"
			>
				<div className="flex gap-0.5 rounded-xl p-1 md:p-1.5" style={containerStyle}>
					{items.map((item) => (
						<NavButton key={item.href} item={item} active={isActive(item.href)} pillId="nav-pill-mobile" />
					))}
				</div>
			</nav>
		</MotionConfig>
	);
}