import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import {
	getLangSnapshot,
	getLangServerSnapshot,
	setSiteLang,
	subscribeLangChange,
} from '@/lib/i18n-store';

export type Lang = 'en' | 'th';

export const langs: readonly { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'TH' },
] as const;

export const dictionaries = {
  en: {
    // About
    aboutHeading: 'About',
    about: `I'm **Rinne** (or Maple), a developer who loves building ==silly things==. Most of my time goes into silly projects, listening to Spotify, hanging out in Discord. Also most of my projects are on my %%[GitHub](https://github.com/rnnve)%%.`,

    // Site metadata
    siteTitle: 'Rinne',
    siteDescription: 'Rinne — live Spotify, Discord and Last.fm status.',
    pageTitleHome: 'Rinne',
    pageTitleMusic: 'Music · Rinne',

    // Navigation
    navHome: 'Home',
    navMusic: 'Music',

    // Discord
    discordLabel: 'Discord',
    discordError: 'Unable to load: {error}',
    discordBoosting: 'Boosting {guild}',
    discordCustomStatus: '"{status}"',

    // Spotify
    spotifyLabel: 'Spotify',
    spotifyCurrentlyPlaying: 'Currently Playing',
    spotifyNoSong: 'No song playing',
    spotifyNothingScrobbling: 'Nothing scrobbling right now',
    spotifyError: 'Unable to load: {error}',
    spotifyBy: '{artist} — {album}',

    // Last.fm
    lastfmLabel: 'Last.fm',
    lastfmListeningHistory: 'Last.fm listening history',
    lastfmViews: {
      recent: 'Recent',
      toptracks: 'Top Tracks',
      topartists: 'Top Artists',
      info: 'Stats',
    },
    lastfmError: 'Unable to load: {error}',
    lastfmPlays: '{count} plays',
    lastfmMemberSince: 'Last.fm member since {year}',
    lastfmStats: {
      scrobbles: 'Scrobbles',
      tracks: 'Tracks',
      artists: 'Artists',
      albums: 'Albums',
    },

    // Common
    loading: 'Loading...',
  },
  th: {
    // About
    aboutHeading: 'เกี่ยวกับ',
    about: 'เรารินเนะหรือเมเปิ้ล (Rinne, Maple) เป็นนักพัฒนาที่ชอบสร้างสรรค์สิ่งต่างๆ และฟังเพลงไปด้วย เราช้เวลาส่วนใหญ่ไปกับการเขียนโค้ด (ที่ให้ AI ช่วยเขียน เพราะไม่มีเวลาในการเขียนเอง) ฟังเพลงบน Spotify และคุยใน Discord กับเพื่อนๆ และผลงานของเราอยู่บน %%[GitHub](https://github.com/rnnve)%%',

    // Site metadata
    siteTitle: 'รินเน',
    siteDescription: 'รินเน — สถานะ Spotify, Discord และ Last.fm แบบเรียลไทม์',
    pageTitleHome: 'รินเน',
    pageTitleMusic: 'เพลง · รินเน',

    // Navigation
    navHome: 'หน้าหลัก',
    navMusic: 'เพลง',

    // Discord
    discordLabel: 'ดิสคอร์ด',
    discordError: 'โหลดไม่ได้: {error}',
    discordBoosting: 'กำลังบูสต์ {guild}',
    discordCustomStatus: '"{status}"',

    // Spotify
    spotifyLabel: 'สปอติไฟ',
    spotifyCurrentlyPlaying: 'กำลังเล่นอยู่',
    spotifyNoSong: 'ไม่มีเพลงเล่นอยู่',
    spotifyNothingScrobbling: 'ไม่มีการสครอบเบิลขณะนี้',
    spotifyError: 'โหลดไม่ได้: {error}',
    spotifyBy: '{artist} — {album}',

    // Last.fm
    lastfmLabel: 'ลาสต์เอฟเอ็ม',
    lastfmListeningHistory: 'ประวัติการฟังเพลง Last.fm',
    lastfmViews: {
      recent: 'ล่าสุด',
      toptracks: 'เพลงยอดนิยม',
      topartists: 'ศิลปินยอดนิยม',
      info: 'สถิติ',
    },
    lastfmError: 'โหลดไม่ได้: {error}',
    lastfmPlays: '{count} ครั้ง',
    lastfmMemberSince: 'สมาชิก Last.fm ตั้งแต่ {year}',
    lastfmStats: {
      scrobbles: 'สครอบเบิล',
      tracks: 'เพลง',
      artists: 'ศิลปิน',
      albums: 'อัลบั้ม',
    },

    // Common
    loading: 'กำลังโหลด...',
  },
} as const;

export type Dictionary = (typeof dictionaries)[Lang];

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLangChange, getLangSnapshot, getLangServerSnapshot);

  useEffect(() => {
    getLangSnapshot();
  }, []);

  return (
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}