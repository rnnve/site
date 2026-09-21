'use client';

import { I18nProvider } from './I18nProvider';
import { LiveProvider } from './LiveProvider';
import DiscordProfileCard from './DiscordProfileCard';
import AboutSection from './AboutSection';
import SpotifyNowPlaying from './SpotifyNowPlaying';
import SiteFooter from './SiteFooter';
import type { LiveInitialData, LiveLastFmView } from '@/lib/integrations';
import { DocumentLanguageSync } from './DocumentLanguageSync';

interface HomeContentProps {
  initialData?: LiveInitialData;
  views?: readonly LiveLastFmView[];
}

function HomeInner() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface text-on-surface">
