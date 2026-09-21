'use client';

import { useEffect, useState } from 'react';

export default function SiteFooter({ className }: { className?: string }) {
	const year = new Date().getFullYear();
	const [commits, setCommits] = useState<number | null>(null);

	useEffect(() => {
		async function fetchCommits() {
			try {
				const response = await fetch('https://api.github.com/repos/rnnve/site/commits?per_page=1', {
					headers: { Accept: 'application/vnd.github+json' },
					signal: AbortSignal.timeout(4000),
				});
				if (!response.ok) return;
				const last = response.headers.get('link')?.match(/page=(\d+)>; rel="last"/)?.[1];
				if (last) setCommits(Number(last));
			} catch {
				// ignore
			}
		}
		fetchCommits();
	}, []);

	return (
		<footer className={`flex min-w-0 flex-row flex-wrap items-center justify-between gap-1 pt-3 pb-2 text-xs text-outline ${className || 'mt-auto'}`}>
			<div className="flex min-w-0 shrink-0 flex-col items-start">
				<p className="text-berry py-1">© {year} Rinne</p>
				{commits !== null && (
					<a
						href="https://github.com/rnnve/site"
						target="_blank"
						rel="noreferrer"
						className="text-blush py-1"
					>
						@rnnve/site # {commits} commits
					</a>
				)}
			</div>
			<nav aria-label="External links" className="flex min-w-0 flex-wrap items-center justify-end gap-x-1">
				<a
					href="https://haunt.gg/rnn"
					target="_blank"
					rel="noreferrer"
					className="footer-rainbow-link inline-flex min-h-11 items-center rounded-md px-2"
				>
					Links
				</a>
			</nav>
		</footer>
	);
}