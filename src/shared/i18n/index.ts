import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru/common.json';
import tg from './locales/tg/common.json';
import en from './locales/en/common.json';

/** Поддерживаемые языки интерфейса (ТЗ §2): русский, таджикский, английский. */
export const supportedLanguages = ['ru', 'tg', 'en'] as const;
export type Language = (typeof supportedLanguages)[number];

export const LANGUAGE_STORAGE_KEY = 'omuz-lang';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { common: ru },
      tg: { common: tg },
      en: { common: en },
    },
    fallbackLng: 'ru',
    supportedLngs: [...supportedLanguages],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    // Состояния загрузки показываем явно (ТЗ §11), Suspense от i18next не используем.
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
  });

export default i18n;
