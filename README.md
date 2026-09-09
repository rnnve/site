# maplenan.org (Next.js)

Personal status site — live Spotify, Discord and Last.fm widgets.

**Prod:** https://maplenan.org · **Vercel project:** `rinnesite` · **Branch:** `migrate/next`

Instant Rollback / `astrov2` branch still exists if you need to roll back to the prior Astro setup.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + Catppuccin Mocha
- Bun for installs / lockfile
- Deployed on Vercel (`rinnesite`)

## Commands

| Command | Action |
| :--- | :--- |
| `bun install` | Install dependencies |
| `bun dev` | Dev server at `localhost:3000` |
| `bun run build` | Production build |
| `bun start` | Serve production build |

## Env

Copy `.env.example` to `.env.local` and fill in Last.fm / Spotify secrets as needed.
