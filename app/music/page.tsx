import LastFmWidget from '@/components/LastFmWidget';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Music · Rinne',
	description: 'Last.fm recent tracks, top tracks, artists and stats.',
};

export default function MusicPage() {
	return (
		<main className="min-h-dvh bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pt-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-6 sm:pt-12">
				<header className="animate-fade-up">
					<h1 className="text-lg font-semibold text-ctp-text">Music</h1>
					<p className="mt-1 text-sm text-ctp-subtext0">Last.fm listening history</p>
				</header>
				<section className="animate-fade-up" style={{ animationDelay: '80ms' }}>
					<LastFmWidget />
				</section>
			</div>
		</main>
	);
}
