'use client';

import { I18nProvider } from './I18nProvider';
import { LiveProvider } from './LiveProvider';
import MusicContent from './MusicContent';
import type { LiveInitialData, LiveLastFmView } from '@/lib/integrations';
import { DocumentLanguageSync } from './DocumentLanguageSync';

interface MusicIslandProps {
  initialData?: LiveInitialData;
  views?: readonly LiveLastFmView[];
}
