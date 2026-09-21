import type { LiveInitialData, LiveLastFmView } from '@/lib/integrations';
import { getInitialLiveData } from '@/lib/initial-live';

const ALL_VIEWS: readonly LiveLastFmView[] = ['recent', 'toptracks', 'topartists', 'info'];
const FAST_VIEWS: readonly LiveLastFmView[] = ['recent'];

let cachedData: LiveInitialData | null = null;
let loadingPromise: Promise<LiveInitialData> | null = null;
let fullLoadingPromise: Promise<LiveInitialData> | null = null;

export async function getFastInitialData(): Promise<LiveInitialData | null> {
  if (cachedData) return cachedData;
  
  if (!loadingPromise) {
    loadingPromise = getInitialLiveData(FAST_VIEWS).then((data) => {
      cachedData = data;
      return data;
    });
  }
  
  return loadingPromise;
}

export async function getFullInitialData(): Promise<LiveInitialData | null> {
  if (cachedData?.lastfm.toptracks && cachedData?.lastfm.topartists && cachedData?.lastfm.info) {
    return cachedData;
  }
  
  if (!fullLoadingPromise) {
    fullLoadingPromise = getInitialLiveData(ALL_VIEWS).then((data) => {
      cachedData = { ...cachedData, ...data };
      return cachedData!;
    });
  }
  
  return fullLoadingPromise;
}

export function getCachedDataSync(): LiveInitialData | null {
  return cachedData;
}

export function clearCache() {
  cachedData = null;
  loadingPromise = null;
  fullLoadingPromise = null;
}