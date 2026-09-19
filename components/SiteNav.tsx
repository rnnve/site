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
	item: NavItem;
	active: boolean;
	pillId: string;
	collapsed: boolean;
	isMobile: boolean;
	collapsed,
	active: boolean
	pillId: string
	const { t } = useI18n();
	const label = item.key === 'home' ? t.navHome : t.navMusic;
	const { href, Icon } = item;
}) {

	return (
		<Link
			href={href}
			aria-label={label}
			className="relative flex items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/40"
			title={label}
		>
			{active && (
					className="absolute inset-0 rounded-lg bg-white/10 border border-white/20"
					transition={springTransition}
				<motion.span
					transition={pillTransition}
				className="relative z-10 flex items-center justify-center gap-2"
				animate={{
					padding: collapsed ? '0.25rem 0.35rem' : '0.375rem 0.5rem',
				}}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.92 }}
				/>
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.95 }}
					color: active ? '#ffffff' : '#a1a1aa',
					opacity: active ? 1 : 0.7,
				transition={{ duration: 0.15, ease: 'easeOut' }}
					opacity: active ? 1 : 0.65,
					transition: 'color 0.15s ease-out, opacity 0.15s ease-out',
				}}
				<Icon className={isMobile ? 'h-5 w-5 shrink-0' : (collapsed ? 'h-4 w-4 shrink-0' : 'h-4.5 w-4.5 shrink-0')} />
				{!isMobile && !collapsed && (
					<motion.span
						initial={false}
						animate={{ opacity: 1, width: 'auto' }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
						className="overflow-hidden whitespace-nowrap text-sm font-medium"
					>
						{label}
					</motion.span>
				)}
			>
			</motion.span>
		</Link>
	);
}

function LanguageSwitcherBar() {
	const { lang, setLang } = useI18n();
	const currentLabel = lang === 'en' ? 'EN' : 'TH';

	return (
		<button
			type="button"
			onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
			aria-label={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
			className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent bg-white/5 text-white hover:bg-white/10"
		>
			{currentLabel}
		</button>
	);
}

function BurgerButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-expanded={expanded}
			aria-label={expanded ? 'Close menu' : 'Open menu'}
			className="relative flex items-center justify-center rounded-xl p-2 text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
		>
			<MenuIcon className="h-5 w-5" />
		</button>
	);
}

const containerStyle: CSSProperties = {
	background: 'rgba(10, 10, 10, 0.82)',
	backdropFilter: 'blur(24px)',
	WebkitBackdropFilter: 'blur(24px)',
	borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
	boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
};

const springTransition = {
	type: 'spring' as const,
	stiffness: 500,
	damping: 30,
	mass: 0.5,
};

export default function SiteNav() {
	const pathname = usePathname() || '/';
	const [isMobile, setIsMobile] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		const handleScroll = (e?: Event) => {
			if (isMobile) return;
			let currentY = 0;
			if (e?.target && e.target instanceof HTMLElement) {
				currentY = e.target.scrollTop;
			} else {
				const scroller = document.querySelector(
					'section[aria-label="Live status"], section[aria-label="Last.fm"], main section',
				);
				currentY = scroller ? scroller.scrollTop : window.scrollY;
			}
			setScrolled(currentY > 15);
		};

		if (!isMobile) {
			handleScroll();
			window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
		}
		return () => {
			window.removeEventListener('scroll', handleScroll, { capture: true });
		};
	}, [pathname, isMobile]);

	useEffect(() => {
		setScrolled(false);
		setMobileMenuOpen(false);
	}, [pathname]);

	const collapsed = !isMobile && scrolled;
	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

	if (isMobile) {
		return (
			<MotionConfig reducedMotion="user">
				<nav
					aria-label="Main navigation"
					className="fixed top-0 left-0 right-0 z-50"
				>
					{!scrolled ? (
						<motion.div
							layout
							transition={springTransition}
							className="flex items-center justify-between"
							style={{
								...containerStyle,
								padding: '0.5rem 1rem',
								borderRadius: 0,
							}}
						>
							<div className="flex items-center gap-1">
								{items.map((item) => (
									<NavButton
										key={item.href}
										item={item}
										active={isActive(item.href)}
										pillId="nav-pill"
										collapsed={false}
										isMobile={true}
									/>
								))}
							</div>
							<LanguageSwitcherBar />
						</motion.div>
					) : (
						<motion.div
							layout
							transition={springTransition}
							className="flex items-center justify-between"
							style={{
								...containerStyle,
								padding: '0.5rem 1rem',
								borderRadius: 0,
							}}
						>
							<BurgerButton onClick={() => setMobileMenuOpen(true)} expanded={false} />
							<div className="flex-1" />
							<LanguageSwitcherBar />
						</motion.div>
					)}
					{scrolled && mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={springTransition}
							className="fixed top-16 left-0 right-0 z-40 px-4 pt-4"
						>
							<motion.div
								layout
								transition={springTransition}
								className="flex flex-col items-center gap-2"
								style={{
									...containerStyle,
									padding: '1rem',
									borderRadius: 16,
									border: '1px solid rgba(255, 255, 255, 0.1)',
									borderTop: 'none',
									boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
								}}
							>
								{items.map((item) => (
									<NavButton
										key={item.href}
										item={item}
										active={isActive(item.href)}
										pillId="nav-pill"
										collapsed={false}
										isMobile={true}
				<motion.div
					layout
					transition={springTransition}
					className="flex items-center justify-between"
					style={{
						...containerStyle,
						padding: '0.625rem 1.5rem',
						borderRadius: 0,
									/>
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