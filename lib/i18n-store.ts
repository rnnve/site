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
	}
}

function applyToDocument(lang: Lang) {
	if (typeof document === 'undefined') return;
	document.documentElement.lang = lang;
	document.documentElement.classList.toggle('lang-th', lang === 'th');
}

export function getLangSnapshot(): Lang {
	if (!initialized && typeof window !== 'undefined') {
		initialized = true;
		current = readStored();
		applyToDocument(current);
	}
	return current;
}

export function getLangServerSnapshot(): Lang {
	return 'en';
}

export function setSiteLang(next: Lang) {
	current = next;
	initialized = true;
	if (typeof window !== 'undefined') {
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// ignore
		}
		applyToDocument(next);
		window.dispatchEvent(new CustomEvent<Lang>(EVENT_NAME, { detail: next }));
	}
}

export function subscribeLangChange(callback: () => void): () => void {
	if (typeof window === 'undefined') return () => {};
	const onEvent = (event: Event) => {
		const detail = (event as CustomEvent<Lang>).detail;
		if (detail === 'en' || detail === 'th') {
			current = detail;
			initialized = true;
			applyToDocument(current);
