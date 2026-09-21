'use client';

import { I18nProvider } from './I18nProvider';
import SiteNav from './SiteNav';
import { DocumentLanguageSync } from './DocumentLanguageSync';

function NavContent() {
  return (
    <>
      <DocumentLanguageSync />
      <SiteNav />
    </>
  );
}

export default function NavIsland() {
  return (
    <I18nProvider>
      <NavContent />
    </I18nProvider>
