import { getInitialLiveData } from '@/lib/initial-live';
import { LiveProvider } from '@/components/LiveProvider';
import type { LiveLastFmView } from '@/lib/integrations';

interface LiveProviderWithDataProps {
	children: React.ReactNode;
	views: readonly LiveLastFmView[];
}

export async function LiveProviderWithData({ children, views }: LiveProviderWithDataProps) {
	const initialData = await getInitialLiveData(views);
	return (
		<LiveProvider initialData={initialData} views={views}>
			{children}
		</LiveProvider>
	);
