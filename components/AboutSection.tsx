'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import rehypeRainbow from '@/lib/rehype-rainbow';
import { dictionaries, langs, useI18n } from '@/lib/i18n';

function discordify(markdown: string): string {
	return markdown
		.replace(/__([^_]+)__/g, '<u>$1</u>')
		.replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>');
}

export default function AboutSection() {
	const { lang, t } = useI18n();

	return (
		<section className="mt-4 border-t border-outline-variant/70 pt-4" aria-label={t.aboutHeading}>
			<h2 className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
				{t.aboutHeading}
			</h2>
			<div className="grid min-w-0">
				{langs.map(({ code }) => (
					<div
						key={code}
						className={
							lang === code
								? 'col-start-1 row-start-1 min-w-0 animate-fade-in'
								: 'col-start-1 row-start-1 invisible'
						}
						aria-hidden={lang !== code}
					>
						<ReactMarkdown
							components={{
								p: ({ children }) => (
									<p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{children}</p>
								),
								a: ({ href, children }) => (
									<a
										href={href}
										target="_blank"
										rel="noreferrer"
										className="font-semibold text-on-surface underline decoration-on-surface-variant/50 underline-offset-2 transition hover:decoration-on-surface"
									>
										{children}
									</a>
								),
								strong: ({ children }) => (
									<strong className="font-semibold text-on-surface">{children}</strong>
								),
								em: ({ children }) => <em className="text-on-surface">{children}</em>,
								code: ({ children }) => (
									<code className="rounded bg-surface-container-high/50 px-1 py-0.5 font-mono text-[0.85em]">
										{children}
									</code>
								),
							}}
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw, rehypeRainbow]}
						>
							{discordify(dictionaries[code].about)}
						</ReactMarkdown>
					</div>
				))}
			</div>
		</section>
	);
}