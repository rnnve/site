import LastFmWidget from '@/components/LastFmWidget';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Music · Rinne',
	description: 'Last.fm recent tracks, top tracks, artists and stats.',
};

export default function MusicPage() {
	return (
		<main className="min-h-dvh min-w-0 bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-4xl min-w-0 flex-col gap-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-6 sm:px-6 sm:pt-7 sm:pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-10">
				<header className="min-w-0 animate-fade-up">
					<h1 className="text-lg font-semibold text-ctp-text sm:text-xl">Music</h1>
					<p className="mt-1 text-sm text-ctp-subtext0">Last.fm listening history</p>
				</header>
				<section className="min-w-0 animate-fade-up" style={{ animationDelay: '80ms' }}>
					<LastFmWidget />
				</section>
				<SiteFooter />
			</div>
		</main>
	);
}
