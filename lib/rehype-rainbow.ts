import { visit } from 'unist-util-visit';
import type { Element, Root, Text } from 'hast';

const RAINBOW = /==([^=]+)==/g;

export default function rehypeRainbow() {
	return (tree: Root) => {
		visit(tree, 'text', (node, index, parent) => {
			if (parent === undefined || parent === null || index === undefined || index === null) return;
			RAINBOW.lastIndex = 0;
			if (!RAINBOW.test(node.value)) return;

			const parts = node.value.split(RAINBOW);
			const nodes: (Text | Element)[] = parts.map((value, i) =>
				i % 2 === 1
					? {
							type: 'element',
							tagName: 'span',
							properties: { className: ['text-rainbow'] },
							children: [{ type: 'text', value }],
						}
					: { type: 'text', value },
			);

			parent.children.splice(index, 1, ...nodes);
			return index + nodes.length;
		});
	};
}