export type Lang = 'en' | 'th';

const STORAGE_KEY = 'site-lang';
const EVENT_NAME = 'site-lang-change';

let current: Lang = 'en';
let initialized = false;

function readStored(): Lang {
	if (typeof window === 'undefined') return 'en';
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		return stored === 'th' ? 'th' : 'en';
	} catch {
		return 'en';
