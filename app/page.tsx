import AboutSection from '@/components/AboutSection';
import DiscordProfileCard from '@/components/DiscordProfileCard';
import SiteFooter from '@/components/SiteFooter';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import { I18nProvider } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function HomePage() {
	return (
		<I18nProvider>
			<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-ctp-crust text-ctp-text">
				<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
					<section
						className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain"
						aria-label="Live status"
					>
						<div className="min-w-0 rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 p-4 sm:p-5">
							<div className="min-w-0 animate-fade-up">
								<DiscordProfileCard />
							</div>
							<AboutSection />
						</div>
						<div
							className="min-w-0 animate-fade-up rounded-2xl border border-ctp-surface1 bg-ctp-surface0/80 p-4 sm:p-5"
							style={{ animationDelay: '120ms' }}
						>
							<SpotifyNowPlaying />
						</div>
					</section>
					<SiteFooter />
				</div>
			</main>
		</I18nProvider>
	);
}