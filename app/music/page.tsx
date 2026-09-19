import { Suspense } from 'react';
import MusicContent from './MusicContent';
import { LiveProvider } from '@/components/LiveProvider';
import { LiveProviderWithData } from '@/components/LiveProviderWithData';
import type { LiveLastFmView, LastFmUserInfoResponse } from '@/lib/integrations';
import { getInitialLiveData } from '@/lib/initial-live';

export const metadata = {
	title: 'Music · Rinne',
	description: 'Last.fm recent tracks, top tracks, artists and stats.',
};

const ALL_VIEWS = ['recent', 'toptracks', 'topartists', 'info'] as const;

export default async function MusicPage() {
	const initialData = await getInitialLiveData(ALL_VIEWS);
	const initialUserInfo = (initialData.lastfm.info as LastFmUserInfoResponse | undefined)?.user ?? null;

	return (
		<Suspense
			fallback={
				<LiveProvider views={ALL_VIEWS}>
					<MusicContent />
				</LiveProvider>
			}
		>
			<LiveProvider initialData={initialData} views={ALL_VIEWS}>
				<MusicContent initialUserInfo={initialUserInfo} />
			</LiveProvider>
		</Suspense>
	);
}