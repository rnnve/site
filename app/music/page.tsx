import SiteFooter from '@/components/SiteFooter';
import { LiveProvider } from '@/components/LiveProvider';
import { LiveProviderWithData } from '@/components/LiveProviderWithData';
export const metadata = {
import type { LiveLastFmView, LastFmUserInfoResponse } from '@/lib/integrations';
import { getInitialLiveData } from '@/lib/initial-live';

	title: 'Music · Rinne',
	<main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface text-on-surface">
		<div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
			<section
				className="no-scrollbar flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain"
				aria-label="Last.fm"
			>
				<div className="m-auto flex w-full min-w-0 flex-col gap-4">
					<header className="min-w-0">
						<h1 className="text-lg font-semibold text-on-surface sm:text-xl">Music</h1>
						<p className="mt-1 text-sm text-on-surface-variant">Last.fm listening history</p>
					</header>
					<LastFmWidget />
				</div>
			</section>
			<Suspense fallback={<div className="mt-auto min-h-16" aria-hidden="true" />}>
				<SiteFooter />
			</Suspense>
		</div>
	</main>
	);
}
export default function MusicPage() {
	return (
		<Suspense
			fallback={
				<LiveProvider views={ALL_VIEWS}>
					<MusicContent />
				</LiveProvider>
			}
		>
			<LiveProviderWithData views={ALL_VIEWS}>
				<MusicContent />
			</LiveProviderWithData>
		</Suspense>
	);
import MusicContent from './MusicContent';
}
