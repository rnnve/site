export interface MarkdownResult {
	markdown: string;
	originalTokens: number;
	markdownTokens: number;
}

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function decodeEntities(value: string): string {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

/** Converts inline HTML (text/bold/emphasis/links/images) to markdown. */
function inlineToMarkdown(html: string): string {
	let text = html;

	text = text.replace(/<br\s*\/?>/gi, '<br_space_>');
	text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, (_m, inner) => `**${inlineToMarkdown(inner)}**`);
	text = text.replace(/<b>([\s\S]*?)<\/b>/gi, (_m, inner) => `**${inlineToMarkdown(inner)}**`);
	text = text.replace(/<em>([\s\S]*?)<\/em>/gi, (_m, inner) => `_${inlineToMarkdown(inner)}_`);
	text = text.replace(/<i>([\s\S]*?)<\/i>/gi, (_m, inner) => `_${inlineToMarkdown(inner)}_`);
	text = text.replace(/<code>([\s\S]*?)<\/code>/gi, (_m, inner) => `\`${inlineToMarkdown(inner)}\``);
	text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, inner) => {
		const label = inlineToMarkdown(inner).trim();
		if (!label) return '';
		return `[${label}](${decodeEntities(href)})`;
	});
	text = text.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (_m, src) => `![image](${decodeEntities(src)})`);
	text = text.replace(/<[^>]+>/g, ' ');

	text = decodeEntities(text);
	text = text.replace(/<br_space_>/g, '\n');
	return text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}

const BLOCK_RE = /<(h[1-6]|p|li|pre|blockquote|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>|<!--[\s\S]*?--><[^>]+>|<div\b[^>]*>/gi;

/**
 * Converts a small, self-authored HTML document into structured Markdown.
 * Handles the site's own pages; not a general-purpose HTML-to-Markdown converter.
 */
export function htmlToMarkdown(html: string): MarkdownResult {
	const originalTokens = Math.round(html.length / 4);

	const titleMatch = html.match(/<meta name="title" content="([^"]*)">/) ??
		html.match(/<meta property="og:title" content="([^"]*)">/) ??
		html.match(/<title>([^<]*)<\/title>/);
	const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/) ??
		html.match(/<meta property="og:description" content="([^"]*)">/);

	const frontmatter: string[] = [];
	const title = titleMatch?.[1] ? decodeEntities(escapeXml(titleMatch[1])) : null;
	if (title) frontmatter.push(`---\ntitle: ${title}`);
	const description = descriptionMatch?.[1] ? decodeEntities(escapeXml(descriptionMatch[1])) : null;
	if (description) frontmatter.push(`description: ${description}`);

	const head = frontmatter.length
		? `${frontmatter.join('\n')}\n---\n\n`
		: '';

	const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');

	const lines: string[] = [];
	let sawBlock = false;

	const sections = body.match(BLOCK_RE) ?? [];

	const push = (line: string) => {
		if (!line) return;
		lines.push(line);
		sawBlock = true;
	};

	for (const section of sections) {
		const heading = section.match(/^<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>$/i);
		if (heading) {
			const level = Number(heading[1]);
			const text = inlineToMarkdown(heading[2]).replace(/\n/g, ' ');
			push(`${'#'.repeat(level)} ${text}`);
			continue;
		}
		const listItem = section.match(/^<li\b[^>]*>([\s\S]*?)<\/li>$/i);
		if (listItem) {
			const text = inlineToMarkdown(listItem[1])
				.split('\n')
				.map((l) => l.trim())
				.join(' ');
			push(`- ${text}`);
			continue;
		}
		const pre = section.match(/^<pre\b[^>]*>([\s\S]*?)<\/pre>$/i);
		if (pre) {
			const text = inlineToMarkdown(pre[1]);
			push('```\n' + text.replace(/\n+$/, '') + '\n```');
			continue;
		}
		const blockquote = section.match(/^<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>$/i);
		if (blockquote) {
			const text = inlineToMarkdown(blockquote[1]).replace(/\n/g, ' ');
			push(`> ${text}`);
			continue;
		}
		const para = section.match(/^<p\b[^>]*>([\s\S]*?)<\/p>$/i);
		if (para) {
			const text = inlineToMarkdown(para[1]).replace(/\n/g, ' ');
			push(text);
			continue;
		}
		const divOpen = section.match(/^<div\b[^>]*>$/i);
		if (divOpen) {
			continue;
		}
	}

	// Fall back to a stripped full-text pass so nothing meaningful is lost.
	if (!sawBlock) {
		const text = inlineToMarkdown(body);
		if (text) lines.push(text);
	}

	const markdown = head + lines.join('\n\n').trim() + '\n';
	const markdownTokens = Math.round(markdown.length / 4);
	return { markdown, originalTokens, markdownTokens };
}