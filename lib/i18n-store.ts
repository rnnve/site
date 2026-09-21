export type Lang = 'en' | 'th';

const STORAGE_KEY = 'site-lang';
const EVENT_NAME = 'site-lang-change';

let current: Lang = 'en';
