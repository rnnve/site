/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly LASTFM_API_KEY: string;
  readonly LASTFM_USERNAME: string;
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_API_URL: string;
  readonly DISCORD_API_URL: string;
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}