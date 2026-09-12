# Agents

## Project

Next.js 16 app (App Router) deployed on Vercel (`rinnesite`). Source lives at the repo root under `app/`, `components/`, `lib/`, `styles/` — there is **no `src/`** directory. Path alias `@/` maps to the repo root.

Styling is **Tailwind CSS v4** with the Catppuccin Mocha theme (`@catppuccin/tailwindcss`). The accent color is mauve. Surfaces are overridden in `.mocha` in `styles/global.css`.

Docs: [Next.js App Router](https://nextjs.org/docs/app), [Tailwind CSS v4](https://tailwindcss.com/docs), [Catppuccin](https://github.com/catppuccin/tailwindcss).

## Commands

```
bun install          # install deps
bun dev              # dev server
bun run build        # production build
bunx tsc --noEmit    # typecheck (there is no lint script)
```

Always run `bunx tsc --noEmit` (and `bun run build` when practical) after making changes.

## Structure

- `app/` — route pages and API routes.
  - `layout.tsx` — root layout, fonts, `<SiteNav />`, analytics scripts, sensors.
  - `page.tsx` — home page: about section + live Discord/Spotify/Last.fm widgets.
  - `music/page.tsx` — music page with Last.fm history.
  - `api/` — server endpoints: `discord`, `spotify`, `lastfm` routes; `.well-known/api-catalog/`.
- `components/` — client components, one per file:
  - `SiteNav.tsx` — sticky navbar with logo, Home/Music page switcher (animated sliding indicator), navigation loading spinner, pending-state logic with a `MIN_PENDING_MS` minimum.
  - `AboutSection.tsx` — i18n about paragraph rendered as markdown (see below).
  - `SpotifyNowPlaying.tsx`, `DiscordProfileCard.tsx`, `LastFmWidget.tsx` — live status widgets.
  - `SiteFooter.tsx` — footer (has a rainbow link, `.footer-rainbow-link`).
  - `Skeleton.tsx` — shimmer skeleton loader.
- `lib/` — shared logic.
  - `i18n.tsx` — `I18nProvider` / `useI18n`; EN + TH dictionaries and `Lang` type; content is authored directly in these dictionaries.
  - `rehype-rainbow.ts` — rehype plugin; `==text==` in markdown renders as animated rainbow text (class `text-rainbow`).
  - `markdown.ts` — HTML-to-markdown converter used by API routes.
  - `env.ts`, `integrations.ts`, `lastfm-images.ts`, `spotify-search.ts` — env helpers, API shapes, Last.fm/Spotify helpers.
- `styles/global.css` — Tailwind v4 entry, theme vars, custom animations (fade, skeleton, rainbow, loading spinner).

## Conventions

- Components that use state/hooks/events are `'use client'`.
- Use the `@/` alias for imports (e.g. `@/lib/i18n`, `@/components/SiteNav`).
- Match existing style: tabs for indentation, single quotes, no semicolons, trailing commas.
- Use Catppuccin color utilities (`ctp-surface0`, `ctp-mauve`, …) or the `accent` token. Define new animations in `styles/global.css` with `@keyframes` and respect `prefers-reduced-motion`.

## About section markdown

The about paragraph in `AboutSection.tsx` is markdown rendered with `react-markdown`. i18n dictionaries hold the raw markdown (links, bold, italic, inline code). Custom syntax:

- `==text==` → rainbow animated text (via `lib/rehype-rainbow.ts`).

If you change markdown rendering, run `bunx tsc --noEmit`.

## Git workflow (IMPORTANT)

- **One commit per file per change**: add and commit each changed file separately (`git add <file>` then `git commit`), with a commit message that identifies the file and the change (e.g. `fix(SiteNav): ...`).
- **Never push** unless the user explicitly says to.
- Leave build artifacts out of commits (`tsconfig.tsbuildinfo` is gitignored).