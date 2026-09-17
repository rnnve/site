'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const OFFSET = 12;

export default function CursorTooltip() {
	const [label, setLabel] = useState<string | null>(null);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [clamped, setClamped] = useState({ left: 0, top: 0 });
