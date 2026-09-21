import { useEffect } from 'react';
import { useI18n } from './I18nProvider';

export function DocumentLanguageSync() {
  const { lang } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'th') {
      document.documentElement.classList.add('lang-th');
    } else {
      document.documentElement.classList.remove('lang-th');
    }
  }, [lang]);

  return null;
}