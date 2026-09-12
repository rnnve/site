# Rinne (Next.js)

Personal status site — live **Spotify**, **Discord** and **Last.fm** widgets, with a curated about section rendered from markdown.

**Prod:** https://maplenan.org · **Vercel project:** `rinnesite` · **Branch:** `migrate/next`

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 with a Material 3 dark tonal palette (`@theme` in `styles/global.css`)
- Bun for installs / lockfile
- Deployed on Vercel (`rinnesite`)

## Layout

- `app/` — pages and API routes (`/api/discord`, `/api/spotify`, `/api/lastfm`)
- `components/` — client components (live widgets, nav, footer, tooltip, skeleton)
- `lib/` — i18n dictionaries, env helpers, API shapes, markdown tooling
- `styles/global.css` — Tailwind v4 entry with theme tokens and animations

On desktop (`lg+`) the nav becomes a fixed left sidebar with a vertical Home/Music page switcher; on smaller screens it's a sticky top bar.

## Commands

| Command | Action |
| :--- | :--- |
| `bun install` | Install dependencies |
| `bun dev` | Dev server at `localhost:3000` |
| `bun run build` | Production build |
| `bunx tsc --noEmit` | Typecheck |

## Env

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Purpose |
| :--- | :--- |
| `LASTFM_API_KEY` | Required for the Last.fm route |
| `LASTFM_USERNAME` | Required for the Last.fm route |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Spotify CDN cover art for the Last.fm widget |
| `SPOTIFY_API_URL` / `DISCORD_API_URL` | Optional overrides (defaults point at the hosted status APIs) |

## About section markdown

The about paragraph is authored in the i18n dictionaries (`lib/i18n.tsx`) and rendered with `react-markdown`, supporting standard markdown plus Discord-style formatting (strikethrough, underline, spoilers) and `remark-gfm`.

Custom syntax (`lib/rehype-rainbow.ts`):

- `==text==` → animated rainbow text (`text-rainbow`)
- `%%text%%` → animated black-to-white gradient text (`text-graphite`)