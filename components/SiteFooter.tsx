export default function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-auto flex min-w-0 flex-col items-center justify-between gap-1 border-t border-outline-variant/70 pb-[calc(env(safe-area-inset-bottom)+4rem)] pt-3 text-xs text-outline min-[28rem]:flex-row min-[28rem]:gap-4 md:pb-0">
			<p className="shrink-0 py-2">© {year} Rinne</p>
			<nav aria-label="External links" className="flex min-w-0 flex-wrap items-center justify-center gap-x-1">
				<a
					href="https://github.com/rnnve"
					target="_blank"
					rel="noreferrer"
					className="footer-rainbow-link inline-flex min-h-11 items-center rounded-md px-2"
				>
					GitHub
				</a>
				<span aria-hidden="true">·</span>
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
