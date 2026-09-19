'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import LastFmWidget from '@/components/LastFmWidget';
import SiteFooter from '@/components/SiteFooter';
import { useI18n } from '@/lib/i18n';
import type { LastFmUserInfo } from '@/lib/integrations';

function Stat({ label, value }: { label: string; value: string }) {
	const [displayValue, setDisplayValue] = useState(0);
	const targetValue = Number(value.replace(/,/g, ''));

	useEffect(() => {
		if (!targetValue) {
			setDisplayValue(0);
			return;
		}

		const duration = 1200;
		const startTime = Date.now();
		const startValue = 0;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.floor(startValue + (targetValue - startValue) * eased);

			setDisplayValue(current);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setDisplayValue(targetValue);
			}
		};

		requestAnimationFrame(animate);
	}, [targetValue]);

	// Format with commas
	const formatted = displayValue.toLocaleString();

