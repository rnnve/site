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
			className="fixed top-3.5 right-4 z-50 sm:top-5"
			role="group"
			aria-label="Language"
		>
			<div style={containerStyle} className="flex items-center gap-0.5 rounded-xl p-0.5">
				{langs.map(({ code, label }) => (
					<button
						key={code}
						type="button"
