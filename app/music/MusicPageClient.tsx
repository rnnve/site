'use client';

import { useEffect, useState } from 'react';
import { LiveProvider } from '@/components/LiveProvider';
import MusicContent from './MusicContent';
import { getFastInitialData, getFullInitialData, getCachedDataSync } from '@/lib/live-cache';
import type { LiveInitialData, LiveLastFmView } from '@/lib/integrations';

const ALL_VIEWS: readonly LiveLastFmView[] = ['recent', 'toptracks', 'topartists', 'info'];

interface MusicPageClientProps {
  initialData: LiveInitialData;
}

export default function MusicPageClient({ initialData }: MusicPageClientProps) {
  const [cachedData, setCachedData] = useState<LiveInitialData | null>(() => getCachedDataSync());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!cachedData) {
      getFastInitialData().then((data) => {
        if (data) setCachedData(data);
      });
    }
    getFullInitialData();
  }, [cachedData]);

  const dataToUse = mounted ? (cachedData ?? initialData) : initialData;

  return (
    <LiveProvider initialData={dataToUse} views={ALL_VIEWS}>
      <MusicContent />
    </LiveProvider>
  );
}