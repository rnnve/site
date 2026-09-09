import DiscordProfileCard from '@/components/DiscordProfileCard';
import SiteFooter from '@/components/SiteFooter';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';

export const dynamic = 'force-dynamic';

export default function HomePage() {
	return (
		<main className="min-h-dvh min-w-0 bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-4xl min-w-0 flex-col gap-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-6 sm:px-6 sm:pt-7 sm:pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-10">
				<section className="flex min-w-0 flex-col gap-4 sm:gap-6" aria-label="Live status">
					<div className="min-w-0 animate-fade-up">
						<SpotifyNowPlaying />
					</div>
					<div className="min-w-0 animate-fade-up" style={{ animationDelay: '120ms' }}>
						<DiscordProfileCard />
					</div>
				</section>
				<SiteFooter />
			</div>
		</main>
	);
}
