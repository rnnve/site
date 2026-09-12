'use client';

import ReactMarkdown from 'react-markdown';

import rehypeRainbow from '@/lib/rehype-rainbow';
import { langs, useI18n } from '@/lib/i18n';

export default function AboutSection() {
	const { lang, setLang, t } = useI18n();

	return (
		<section className="mt-4 border-t border-ctp-surface1/70 pt-4" aria-label={t.aboutHeading}>
			<div key={lang} className="min-w-0 animate-fade-in">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-xs font-medium uppercase tracking-wider text-ctp-overlay1">
						{t.aboutHeading}
					</h2>
					<div
						className="flex items-center gap-0.5 rounded-xl bg-ctp-surface1/30 p-0.5"
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
										? 'bg-ctp-surface1 text-ctp-text'
										: 'text-ctp-subtext0 hover:text-ctp-text'
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
							<p className="mt-2 text-sm leading-relaxed text-ctp-subtext0">{children}</p>
						),
						a: ({ href, children }) => (
							<a
								href={href}
								target="_blank"
								rel="noreferrer"
								className="font-semibold text-ctp-text underline decoration-ctp-overlay1/50 underline-offset-2 transition hover:decoration-ctp-text"
							>
								{children}
							</a>
						),
						strong: ({ children }) => (
							<strong className="font-semibold text-ctp-text">{children}</strong>
						),
						em: ({ children }) => <em className="text-ctp-text">{children}</em>,
						code: ({ children }) => (
							<code className="rounded bg-ctp-surface1/50 px-1 py-0.5 font-mono text-[0.85em]">
								{children}
							</code>
						),
					}}
					rehypePlugins={[rehypeRainbow]}
				>
					{t.about}
				</ReactMarkdown>
			</div>
		</section>
	);
}