import { useTranslation } from 'react-i18next';
import { supportedLanguages, type Language } from '@/shared/i18n';

/** Переключатель языка интерфейса (rus/taj/eng). Выбор кэшируется i18next в localStorage. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = (supportedLanguages as readonly string[]).includes(i18n.language)
    ? (i18n.language as Language)
    : 'ru';

  return (
    <label className="inline-flex items-center gap-2 text-bodySm text-ink-secondary">
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        aria-label={t('language.label')}
        className="h-9 rounded-md border border-line bg-surface-card px-2 text-body text-ink transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {supportedLanguages.map((lng) => (
          <option key={lng} value={lng}>
            {t(`language.${lng}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
