import DiscordProfileCard from '@/components/DiscordProfileCard';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';

export const dynamic = 'force-dynamic';

export default function HomePage() {
	const year = new Date().getFullYear();

	return (
		<main className="min-h-dvh bg-ctp-crust text-ctp-text">
			<div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pt-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-6 sm:pt-12">
				<section className="flex flex-col gap-4 sm:gap-6">
					<div className="animate-fade-up">
						<SpotifyNowPlaying />
					</div>
					<div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
						<DiscordProfileCard />
					</div>
				</section>
				<footer className="mt-auto flex flex-col items-center gap-1 text-xs text-ctp-overlay0">
					<p>© {year} Rinne</p>
					<p className="flex items-center gap-1.5">
						<a
							href="https://github.com/rnnve"
							target="_blank"
							rel="noreferrer"
							className="text-ctp-subtext0 transition hover:text-ctp-text"
						>
							GitHub
						</a>
						<span aria-hidden="true">·</span>
						<span>Site</span>
					</p>
				</footer>
			</div>
		</main>
	);
}
