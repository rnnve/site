import { NextResponse, type NextRequest } from 'next/server';
import { htmlToMarkdown } from '@/lib/markdown';

const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"';

export async function proxy(request: NextRequest) {
	// Avoid recursion when we re-fetch HTML for markdown negotiation.
	if (request.headers.get('x-markdown-passthrough') === '1') {
		return NextResponse.next();
	}

	const accept = request.headers.get('accept') ?? '';
	const wantsMarkdown = accept.includes('text/markdown');
	const path = request.nextUrl.pathname;
	const isPage =
		!path.startsWith('/api') &&
		!path.startsWith('/_next') &&
		!path.startsWith('/.well-known') &&
		!path.includes('.');

	if (wantsMarkdown && isPage) {
		const htmlUrl = request.nextUrl.clone();
		const htmlRes = await fetch(htmlUrl, {
			headers: {
				accept: 'text/html',
				'x-markdown-passthrough': '1',
			},
		});
		const html = await htmlRes.text();
		const { markdown, originalTokens, markdownTokens } = htmlToMarkdown(html);

		const headers = new Headers();
		headers.set('Content-Type', 'text/markdown; charset=utf-8');
		headers.set('Link', API_CATALOG_LINK);
		headers.set('Vary', 'Accept');
		headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
		headers.set('Content-Signal', 'ai-train=yes, search=yes, ai-input=yes');
		headers.set('X-Markdown-Tokens', String(markdownTokens));
		headers.set('X-Original-Tokens', String(originalTokens));

		return new NextResponse(markdown, {
			status: htmlRes.status,
			headers,
		});
	}

	const response = NextResponse.next();

	if (isPage) {
		if (!response.headers.get('Link')) {
			response.headers.append('Link', API_CATALOG_LINK);
		}
		const existingVary = response.headers.get('Vary');
		response.headers.set('Vary', existingVary ? `${existingVary}, Accept` : 'Accept');
		response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
		response.headers.set('Content-Signal', 'ai-train=yes, search=yes, ai-input=yes');
	}

	return response;
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt).*)'],
};
