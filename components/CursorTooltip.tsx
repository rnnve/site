'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const OFFSET = 12;

export default function CursorTooltip() {
	const [label, setLabel] = useState<string | null>(null);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [clamped, setClamped] = useState({ left: 0, top: 0 });
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!window.matchMedia('(min-width: 1024px)').matches) return;

		function labelFor(href: string): string {
			try {
				const url = new URL(href, window.location.origin);
				if (url.origin === window.location.origin) {
					return url.pathname + url.search;
				}
				return href;
			} catch {
				return href;
			}
		}

		function onMove(e: PointerEvent) {
			const hovered = e.target as Element | null;
			const el = hovered?.closest?.('a[href]');
			const href = el && !el.closest('[data-tooltip="off"]') ? el.getAttribute('href') : null;
			setPos({ x: e.clientX, y: e.clientY });
			if (href) {
				setLabel(labelFor(href));
			} else {
