import { isLastFmPlaceholder, type LastFmImage } from './integrations';

const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/';

type ResolvableItem = {
	name: string;
	artist?: string | { name?: string; '#text'?: string };
	image?: LastFmImage;
	spotifyImage?: string;
};

function needsImageResolution(images: LastFmImage | undefined): boolean {
	if (!images?.length) return true;
	return !images.some((img) => !isLastFmPlaceholder(img['#text']));
}

async function getResolvedImages(
	method: string,
	params: Record<string, string>,
	apiKey: string,
): Promise<LastFmImage> {
	const search = new URLSearchParams({
		method,
		api_key: apiKey,
		format: 'json',
		autocorrect: '0',
		...params,
	});
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 6000);
	try {
		const response = await fetch(`${LASTFM_URL}?${search}`, { signal: controller.signal });
		if (!response.ok) return [];
		const data = (await response.json()) as {
			track?: { album?: { image?: LastFmImage } };
			artist?: { image?: LastFmImage };
			error?: number;
		};
		if (data.error) return [];
		return method === 'track.getInfo' ? data.track?.album?.image ?? [] : data.artist?.image ?? [];
	} catch {
		return [];
	} finally {
		clearTimeout(timeout);
	}
}

function applyResolvedImages(images: LastFmImage, resolved: LastFmImage): void {
	for (const entry of resolved) {
		if (isLastFmPlaceholder(entry['#text'])) continue;
		const existing = images.find((img) => img.size === entry.size);
		if (existing) existing['#text'] = entry['#text'];
		else images.push({ size: entry.size, '#text': entry['#text'] });
	}
}

/**
 * Replaces Last.fm placeholder covers in top tracks/artists with the real
 * album/artist art from each item's `track.getInfo` / `artist.getInfo`.
 * Items that already have a real cover are skipped.
 */
export async function resolveLastFmImages(
	items: ResolvableItem[],
	type: 'track' | 'artist',
	apiKey: string,
): Promise<void> {
	await Promise.allSettled(
		items.map(async (item) => {
			if (item.spotifyImage) return;
			const images = item.image ?? [];
			if (!needsImageResolution(images)) return;

			const artist =
				typeof item.artist === 'string'
					? item.artist
					: (item.artist?.name ?? item.artist?.['#text'] ?? '');
			if (type === 'track' ? !artist.trim() : !item.name.trim()) return;

			const params: Record<string, string> = { artist };
			if (type === 'track') {
				params.track = item.name;
			}
			const resolved = await getResolvedImages(
				type === 'track' ? 'track.getInfo' : 'artist.getInfo',
				params,
				apiKey,
			);
			applyResolvedImages(images, resolved);
		}),
	);
}