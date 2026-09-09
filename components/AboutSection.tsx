'use client';

import { langs, useI18n } from '@/lib/i18n';

export default function AboutSection() {
	const { lang, setLang, t } = useI18n();

	return (
		<section className="mt-4 border-t border-ctp-surface1/70 pt-4" aria-label={t.aboutHeading}>
			<div className="flex items-start justify-between gap-3">
				<div key={lang} className="min-w-0 animate-fade-in">
					<h2 className="text-xs font-medium uppercase tracking-wider text-ctp-overlay1">
						{t.aboutHeading}
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-ctp-subtext0">
						{t.aboutParts.map((part, index) =>
							typeof part === 'string' ? (
								part
							) : (
								<a
									key={index}
									href="https://github.com/rnnve"
									target="_blank"
									rel="noreferrer"
									className="font-semibold text-ctp-text underline decoration-ctp-overlay1/50 underline-offset-2 transition hover:decoration-ctp-text"
								>
									GitHub
								</a>
							),
						)}
					</p>
				</div>
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
		</section>
	);
}