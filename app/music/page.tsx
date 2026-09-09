import LastFmWidget from '@/components/LastFmWidget';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Music · Rinne',
	description: 'Last.fm recent tracks, top tracks, artists and stats.',
};

export default function MusicPage() {
	return (
		<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
				<header className="min-w-0 shrink-0 animate-fade-up">
					<h1 className="text-lg font-semibold text-ctp-text sm:text-xl">Music</h1>
					<p className="mt-1 text-sm text-ctp-subtext0">Last.fm listening history</p>
				</header>
				<section
					className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden animate-fade-up"
					style={{ animationDelay: '80ms' }}
					aria-label="Last.fm"
				>
					<LastFmWidget />
				</section>
				<SiteFooter />
			</div>
		</main>
	);
}
