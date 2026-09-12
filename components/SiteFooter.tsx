export default function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-auto flex min-w-0 flex-row flex-wrap items-center justify-between gap-1 pt-3 pb-2 text-xs text-outline">
			<p className="shrink-0 py-1">© {year} Rinne</p>
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
		</footer>
	);
}
