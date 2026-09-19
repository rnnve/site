'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import LastFmWidget from '@/components/LastFmWidget';
import SiteFooter from '@/components/SiteFooter';
import { useI18n } from '@/lib/i18n';
import type { LastFmUserInfo } from '@/lib/integrations';

function Stat({ label, value }: { label: string; value: string }) {
