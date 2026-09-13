# Agents

## Project

Next.js 16 app (App Router) deployed on Vercel (`rinnesite`). Source lives at the repo root under `app/`, `components/`, `lib/`, `styles/` — there is **no `src/`** directory. Path alias `@/` maps to the repo root.

Styling is **Tailwind CSS v4** with a **Material 3 dark tonal palette** defined directly in `@theme` in `styles/global.css`. The accent color is the light neutral `primary` (`#e6e1e5`); `accent-dark` maps to `tertiary`. Rainbow text/footer use the `--color-rainbow-*` tokens.

Docs: [Next.js App Router](https://nextjs.org/docs/app), [Tailwind CSS v4](https://tailwindcss.com/docs), [Material 3](https://m3.material.io/styles/color/the-color-system/color-roles).

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
  - `layout.tsx` — root layout, fonts, `<SiteNav />`, analytics scripts, sensors (same-origin `/hub/…` scripts, proxied via `next.config.ts` rewrites to portus.sh).
  - `page.tsx` — home page: about section + live Discord/Spotify/Last.fm widgets. Async server component; calls `getInitialLiveData(['recent'])` so the first HTML contains real content.
  - `music/page.tsx` — music page with Last.fm history; `getInitialLiveData(ALL_VIEWS)`.
  - `api/` — server endpoints: `discord`, `spotify`, `lastfm` routes; `.well-known/api-catalog/`.
- `components/` — client components, one per file:
  - `LiveProvider.tsx` — client data store (context). Lives inside each page, wrapped around the page content. Takes `initialData` (SSR snapshot, so widgets render real content on first paint instead of skeletons and hydrate without a flash) and `views` (only the Last.fm views that page needs are fetched + polled: home passes `['recent']`, music passes all four). Polls in the background; widgets read from it via `useLive()` instead of fetching.
  - `SiteNav.tsx` — nav ported from the `shadcn` branch design (next/link): glass pill container (`rgba(20,20,20,0.8)` + 24px blur + thin white border), spring `layoutId` active indicator, hover scale 1.08 / tap 0.95 icons via framer-motion. Fixed left sidebar on `md+`, centered floating bar at the bottom on mobile. `MotionConfig reducedMotion="user"`. Only Home/Music items.
  - `AboutSection.tsx` — i18n about paragraph rendered as markdown (see below).
  - `SpotifyNowPlaying.tsx`, `DiscordProfileCard.tsx`, `LastFmWidget.tsx` — live status widgets rendered from `LiveProvider` context.
  - `SiteFooter.tsx` — footer (has a rainbow link, `.footer-rainbow-link`).
  - `Skeleton.tsx` — shimmer skeleton loader.
- `lib/` — shared logic.
  - `initial-live.ts` — server-only loader for the SSR content snapshot (`getInitialLiveData`). Fetches the same upstream APIs as the route handlers in parallel with a short timeout (no image augmentation, so TTFB stays low); pages seed `LiveProvider` with its result.
  - `i18n.tsx` — `I18nProvider` / `useI18n`; EN + TH dictionaries and `Lang` type; content is authored directly in these dictionaries.
  - `rehype-rainbow.ts` — rehype plugin; `==text==` in markdown renders as animated rainbow text (class `text-rainbow`).
  - `markdown.ts` — HTML-to-markdown converter used by API routes.
  - `env.ts`, `integrations.ts`, `lastfm-images.ts`, `spotify-search.ts` — env helpers, API shapes, Last.fm/Spotify helpers.
- `styles/global.css` — Tailwind v4 entry, theme vars, custom animations (fade, skeleton, rainbow, graphite).

## Conventions

- Components that use state/hooks/events are `'use client'`.
- Use the `@/` alias for imports (e.g. `@/lib/i18n`, `@/components/SiteNav`).
- Match existing style: tabs for indentation, single quotes, no semicolons, trailing commas.
- Use Material 3 color utilities (`bg-surface`, `text-on-surface`, `text-on-surface-variant`, `bg-surface-container-high`, `border-outline-variant`, `text-outline`, …) or the `accent` token. Define new animations in `styles/global.css` with `@keyframes` and respect `prefers-reduced-motion`.

## About section markdown

The about paragraph in `AboutSection.tsx` is markdown rendered with `react-markdown`. i18n dictionaries hold the raw markdown (links, bold, italic, inline code). Custom syntax (via `lib/rehype-rainbow.ts`):

- `==text==` → rainbow animated text (class `text-rainbow`).
- `%%text%%` → black→white gradient text (class `text-graphite`).
- `$$text$$` → light pink→white gradient text (class `text-blush`).

If you change markdown rendering, run `bunx tsc --noEmit`.

## Git workflow (IMPORTANT)

- **One commit per file per change**: add and commit each changed file separately (`git add <file>` then `git commit`), with a commit message that identifies the file and the change (e.g. `fix(SiteNav): ...`).
- **Never push** unless the user explicitly says to.
- Leave build artifacts out of commits (`tsconfig.tsbuildinfo` is gitignored).