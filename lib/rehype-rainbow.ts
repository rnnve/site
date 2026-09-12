import type { Root } from 'hast';

type Text = { type: 'text'; value: string };
type Element = {
	type: 'element';
	tagName: string;
	properties: Record<string, unknown>;
	children: (Text | Element)[];
};
type AnyNode = { type: string; children?: AnyNode[]; value?: unknown };

interface SingleRule {
	re: RegExp;
	className: string;
}

interface SplitMarker {
	open: string;
	close: string;
	className: string;
}

const SINGLE_RULES: SingleRule[] = [
	{ re: /==([^=]+)==/g, className: 'text-rainbow' },
	{ re: /%%([^%]+)%%/g, className: 'text-graphite' },
];

const SPLIT_MARKERS: SplitMarker[] = [
	{ open: '==', close: '==', className: 'text-rainbow' },
	{ open: '%%', close: '%%', className: 'text-graphite' },
];

function text(value: string): Text {
	return { type: 'text', value };
}

function span(className: string, children: AnyNode[]): Element {
	return {
		type: 'element',
		tagName: 'span',
		properties: { className: [className] },
		children: children as Element['children'],
	};
}

function transformText(value: string): { nodes: AnyNode[] } | null {
	let changed = false;
	let parts: AnyNode[] = [text(value)];

	for (const { re, className } of SINGLE_RULES) {
		const next: AnyNode[] = [];
		for (const node of parts) {
			if (node.type !== 'text' || typeof node.value !== 'string') {
				next.push(node);
				continue;
			}
			const v = node.value;
			re.lastIndex = 0;
			if (!re.test(v)) {
				next.push(node);
				continue;
			}
			changed = true;
			const segments = v.split(re);
			segments.forEach((segment, i) => {
				if (i % 2 === 1) {
					next.push(span(className, [text(segment)]));
				} else if (segment) {
					next.push(text(segment));
				}
			});
		}
		parts = next;
	}

	return changed ? { nodes: parts } : null;
}

function transformOrText(value: string): AnyNode[] {
	const result = transformText(value);
	return result ? result.nodes : [text(value)];
}

function openerIndex(value: string, open: string): number {
	const idx = value.length - open.length;
	if (idx < 0 || value.slice(idx) !== open) return -1;
	if (idx === 0) return 0;
	return /\s/.test(value[idx - 1]) ? idx : -1;
}

const TAIL_OK = /[\s.,;:!?)\]"'%\u2013\u2014\u2026]/;

function closerTail(value: string, close: string): string | null {
	if (!value.startsWith(close)) return null;
	const rest = value.slice(close.length);
	if (!rest) return '';
	return TAIL_OK.test(rest[0]) ? rest : null;
}

function processChildren(input: AnyNode[]): AnyNode[] {
	const out: AnyNode[] = [];
	let i = 0;

	while (i < input.length) {
		const node = input[i];
		const value = node.type === 'text' && typeof node.value === 'string' ? node.value : null;

		if (typeof value === 'string') {
			const marker = SPLIT_MARKERS.find((m) => openerIndex(value, m.open) >= 0);
			if (marker) {
				const start = openerIndex(value, marker.open);
				const prefix = value.slice(0, start);
				const group: AnyNode[] = [];
				let j = i + 1;
				let rest: string | null = null;
				let closed = false;

				while (j < input.length) {
					const candidate = input[j];
					const cv = candidate.type === 'text' && typeof candidate.value === 'string' ? candidate.value : null;
					if (typeof cv === 'string') {
						const tail = closerTail(cv, marker.close);
						if (tail !== null) {
							closed = true;
							rest = tail;
							j++;
							break;
						}
					}
					group.push(candidate);
					j++;
				}

				if (closed) {
					if (prefix) out.push(...transformOrText(prefix));
					if (group.length) out.push(span(marker.className, processChildren(group)));
					if (rest) out.push(...transformOrText(rest));
					i = j;
					continue;
				}
			}
		}

		if (typeof value === 'string') {
			const result = transformText(value);
			if (result) {
				out.push(...result.nodes);
				i++;
				continue;
			}
		}

		if (node.children && node.children.length) {
			out.push({ ...node, children: processChildren(node.children) });
		} else {
			out.push(node);
		}
		i++;
	}

	return out;
}

export default function rehypeRainbow() {
	return (tree: Root) => {
		tree.children = processChildren(tree.children) as Root['children'];
	};
}