import { Suspense } from 'react';
import HomeContent from './HomeContent';
import { LiveProvider } from '@/components/LiveProvider';
import { LiveProviderWithData } from '@/components/LiveProviderWithData';

const HOME_VIEWS = ['recent'] as const;

export default function HomePage() {
	return (
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
	);
}
