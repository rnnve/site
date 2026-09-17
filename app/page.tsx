import { Suspense } from 'react';
import AboutSection from '@/components/AboutSection';
import DiscordProfileCard from '@/components/DiscordProfileCard';
import SiteFooter from '@/components/SiteFooter';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import { LiveProvider } from '@/components/LiveProvider';
import { LiveProviderWithData } from '@/components/LiveProviderWithData';
import { I18nProvider } from '@/lib/i18n';

const HOME_VIEWS = ['recent'] as const;

function HomeContent() {
	return (
		<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface text-on-surface">
			<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
				<section
					className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
					aria-label="Live status"
				>
					<div className="my-auto flex min-w-0 flex-col gap-4">
						<div className="min-w-0 rounded-2xl border border-outline-variant bg-surface-container/80 p-4 sm:p-5">
							<div className="min-w-0">
								<DiscordProfileCard />
							</div>
							<AboutSection />
						</div>
						<div className="min-w-0 rounded-2xl border border-outline-variant bg-surface-container/80 p-4 sm:p-5">
							<SpotifyNowPlaying />
						</div>
					</div>
				</section>
				<Suspense fallback={<div className="mt-auto min-h-16" aria-hidden="true" />}>
					<SiteFooter />
				</Suspense>
			</div>
		</main>
	);
}
export default function HomePage() {
	return (
		<I18nProvider>
			<Suspense
				fallback={
					<LiveProvider views={HOME_VIEWS}>
						<HomeContent />
					</LiveProvider>
				}
			>
				<LiveProviderWithData views={HOME_VIEWS}>
					<HomeContent />
				</LiveProviderWithData>
			</Suspense>
		</I18nProvider>
