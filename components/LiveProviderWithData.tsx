import { getInitialLiveData } from '@/lib/initial-live';
import { LiveProvider } from '@/components/LiveProvider';
import type { LiveLastFmView } from '@/lib/integrations';

interface LiveProviderWithDataProps {
	children: React.ReactNode;
