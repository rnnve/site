import DiscordProfileCard from '@/components/DiscordProfileCard';
import SiteFooter from '@/components/SiteFooter';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';

export const dynamic = 'force-dynamic';

export default function HomePage() {
	return (
		<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
				<section
					className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain sm:flex-row sm:items-start sm:gap-5"
					aria-label="Live status"
				>
					<div className="min-w-0 flex-1 animate-fade-up">
						<DiscordProfileCard />
					</div>
					<div className="min-w-0 flex-1 animate-fade-up" style={{ animationDelay: '120ms' }}>
						<SpotifyNowPlaying />
					</div>
				</section>
				<SiteFooter />
			</div>
		</main>
	);
}
