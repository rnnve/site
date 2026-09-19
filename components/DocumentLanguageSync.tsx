'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export function DocumentLanguageSync() {
	const { lang } = useI18n();

	useEffect(() => {
		document.documentElement.lang = lang;
		if (lang === 'th') {
			document.documentElement.classList.add('lang-th');
		} else {
