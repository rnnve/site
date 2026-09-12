'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import rehypeRainbow from '@/lib/rehype-rainbow';
import { langs, useI18n } from '@/lib/i18n';

function discordify(markdown: string): string {
	return markdown
		.replace(/__([^_]+)__/g, '<u>$1</u>')
		.replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>');
}

export default function AboutSection() {
	const { lang, setLang, t } = useI18n();

	return (
		<section className="mt-4 border-t border-outline-variant/70 pt-4" aria-label={t.aboutHeading}>
			<div key={lang} className="min-w-0 animate-fade-in">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
						{t.aboutHeading}
					</h2>
					<div
						className="flex items-center gap-0.5 rounded-xl bg-surface-container-high/30 p-0.5"
						role="group"
						aria-label="Language"
					>
						{langs.map(({ code, label }) => (
							<button
								key={code}
								type="button"
								onClick={() => setLang(code)}
								aria-pressed={lang === code}
								className={`min-h-7 rounded-lg px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
									lang === code
										? 'bg-surface-container-high text-on-surface'
										: 'text-on-surface-variant hover:text-on-surface'
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>
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
					{discordify(t.about)}
				</ReactMarkdown>
			</div>
		</section>
	);
}