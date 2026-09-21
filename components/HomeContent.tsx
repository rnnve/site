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
      <div className="mx-auto flex min-h-0 w-full max-w-4xl min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:gap-5 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-6">
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          aria-label="Live status"
        >
          <div className="my-auto flex min-w-0 flex-col gap-4">
            <div className="min-w-0 rounded-2xl border border-outline-variant bg-surface-container/80 p-4 sm:p-5">
              <div className="min-w-0">
                <DiscordProfileCard />
              </div>
              <AboutSection />
            </div>
            <div className="min-w-0 rounded-2xl border border-outline-variant bg-surface-container/80 p-4 sm:p-5">
              <SpotifyNowPlaying />
            </div>
          </div>
        </section>
        <SiteFooter />
