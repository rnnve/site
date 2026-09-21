import MusicPageClient from './MusicPageClient';
import { getInitialLiveData } from '@/lib/initial-live';
import type { LiveLastFmView } from '@/lib/integrations';

const ALL_VIEWS: readonly LiveLastFmView[] = ['recent', 'toptracks', 'topartists', 'info'];

export default async function MusicPage() {
  const initialData = await getInitialLiveData(ALL_VIEWS);
  return <MusicPageClient initialData={initialData} />;
}