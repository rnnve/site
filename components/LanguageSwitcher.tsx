'use client';

import { useI18n, langs } from '@/lib/i18n';
import type { CSSProperties } from 'react';

const containerStyle: CSSProperties = {
	background: 'rgba(10, 10, 10, 0.82)',
	backdropFilter: 'blur(24px)',
	WebkitBackdropFilter: 'blur(24px)',
	border: '1px solid rgba(255, 255, 255, 0.1)',
	boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
};

export default function LanguageSwitcher() {
	const { lang, setLang } = useI18n();

	return (
		<div
