'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'th';

export const langs: readonly { code: Lang; label: string }[] = [
	{ code: 'en', label: 'EN' },
	{ code: 'th', label: 'TH' },
] as const;

export const dictionaries = {
  en: {
		aboutHeading: 'About',
		about: 'I’m **Rinne** (or Maple), a developer who loves building ==silly things==. Most of my time goes into silly projects, listening to Spotify, hanging out in Discord. Also most of my projects are on my [GitHub](https://github.com/rnnve).',
	},
	th: {
		aboutHeading: 'เกี่ยวกับ',
		about: 'เรารินเนะหรือเมเปิ้ล (Rinne, Maple) เป็นนักพัฒนาที่ชอบสร้างสรรค์สิ่งต่างๆ และฟังเพลงไปด้วย เราช้เวลาส่วนใหญ่ไปกับการเขียนโค้ด (ที่ให้ AI ช่วยเขียน เพราะไม่มีเวลาในการเขียนเอง) ฟังเพลงบน Spotify และคุยใน Discord กับเพื่อนๆ และผลงานของเราอยู่บน [GitHub](https://github.com/rnnve)',
	},
} as const;

export type Dictionary = (typeof dictionaries)[Lang];

const STORAGE_KEY = 'site-lang';

function readStoredLang(): Lang {
	if (typeof window === 'undefined') return 'en';
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return stored === 'en' || stored === 'th' ? stored : 'en';
}

interface I18nContextValue {
	lang: Lang;
	setLang: (lang: Lang) => void;
	t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [lang, setLangState] = useState<Lang>('en');

	useEffect(() => {
		setLangState(readStoredLang());
	}, []);

	function setLang(next: Lang) {
		setLangState(next);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(STORAGE_KEY, next);
		}
	}

	return (
		<I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n(): I18nContextValue {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
	return ctx;
}
