import type { LastFmTrack, LastFmTopTrack, LastFmTopArtist, LastFmImage } from '@/lib/integrations';

const PLACEHOLDER_HASHES = [
  '2a96cbd8b46e442fc41c2b86b821562f',
  '8181483806820e0ca3bcf25a86b6e4f8',
] as const;

function isPlaceholder(url: string): boolean {
  return !url || PLACEHOLDER_HASHES.some((hash) => url.includes(hash));
}

function pickImage(images: LastFmImage | undefined, preferred: string): string {
  if (!images?.length) return '';
  const match = images.find((img) => img.size === preferred);
  return match?.['#text'] ?? images[images.length - 1]?.['#text'] ?? '';
}

/** Resolves the best available Last.fm image for tracks/artists, preferring larger sizes. */
export async function resolveLastFmImages(
  items: (LastFmTrack | LastFmTopTrack | LastFmTopArtist)[],
  type: 'track' | 'artist',
  apiKey: string,
): Promise<void> {
  await Promise.allSettled(
    items.map(async (item) => {
      if (item.spotifyImage) return;
      const images = item.image;
      if (!images?.length) return;

      const large = pickImage(images, 'large');
      if (large && !isPlaceholder(large)) {
        item.spotifyImage = large;
        return;
      }

      const extralarge = pickImage(images, 'extralarge');
      if (extralarge && !isPlaceholder(extralarge)) {
        item.spotifyImage = extralarge;
      }
    }),
  );
}