export default function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-auto flex min-w-0 flex-col gap-1 border-t border-outline-variant/70 pt-3 pb-2 text-xs text-outline">
			<nav aria-label="External links" className="flex min-w-0 flex-wrap items-center justify-end gap-x-1">
				<a
					href="https://github.com/rnnve"
					target="_blank"
					rel="noreferrer"
					className="footer-rainbow-link inline-flex min-h-11 items-center rounded-md px-2"
				>
					GitHub
				</a>
				<a
					href="https://haunt.gg/rnn"
					target="_blank"
					rel="noreferrer"
					className="footer-rainbow-link inline-flex min-h-11 items-center rounded-md px-2"
				>
					Links
				</a>
			</nav>
			<p className="shrink-0 pb-1 text-left">© {year} Rinne</p>
		</footer>
	);
}
