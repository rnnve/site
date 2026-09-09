const catalog = {
	name: 'Rinne Status API Catalog',
	description: 'Public JSON endpoints exposed by maplenan.org for Spotify, Discord and Last.fm status.',
	auth: 'none',
	endpoints: [
		{
			path: '/api/spotify',
			description: 'Currently playing Spotify track: title, artist, album, artwork and progress.',
			methods: ['GET'],
			parameters: [],
		},
		{
			path: '/api/discord',
			description: 'Discord profile, presence status and activities, including activity runtimes.',
			methods: ['GET'],
			parameters: [],
		},
		{
			path: '/api/lastfm',
			description: 'Last.fm listening history and stats. Each response may include spotifyImage for cover art.',
			methods: ['GET'],
			parameters: [
				{
					name: 'view',
					values: ['recent', 'toptracks', 'topartists', 'info'],
					default: 'recent',
				},
				{ name: 'limit', type: 'integer', default: '10' },
			],
		},
	],
};

export async function GET() {
	return Response.json(catalog, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600',
		},
	});
}
