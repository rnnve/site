'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const OFFSET = 12;

export default function CursorTooltip() {
	const [label, setLabel] = useState<string | null>(null);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [clamped, setClamped] = useState({ left: 0, top: 0 });
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
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
				setLabel(null);
			}
		}

		function onLeave() {
			setLabel(null);
		}

		document.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('mouseleave', onLeave);
		return () => {
			document.removeEventListener('pointermove', onMove);
			document.removeEventListener('mouseleave', onLeave);
		};
	}, []);

	useLayoutEffect(() => {
		if (!label || !ref.current) {
			setClamped({ left: pos.x, top: pos.y });
			return;
		}
		const { clientWidth: w, clientHeight: h } = ref.current;
		const left = pos.x + OFFSET;
		const top = pos.y + OFFSET;
		setClamped({
			left: left + w > window.innerWidth - 8 ? Math.max(8, pos.x - OFFSET - w) : left,
			top: top + h > window.innerHeight - 8 ? Math.max(8, pos.y - OFFSET - h) : top,
		});
	}, [label, pos]);

	return (
		<>
			{label && (
				<div
					ref={ref}
					role="tooltip"
					className="pointer-events-none fixed z-[100] max-w-56 truncate rounded-lg border border-outline-variant bg-surface-container-high/95 px-2.5 py-1 text-xs text-on-surface shadow-lg shadow-scrim/50 backdrop-blur-md"
					style={{
						left: clamped.left,
						top: clamped.top,
					}}
				>
					{label}
				</div>
			)}
		</>
	);
}