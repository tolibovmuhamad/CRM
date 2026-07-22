import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Раздел есть, но роль до него не допущена (см. `shared/config/navigation`). */
export function ForbiddenPage() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-start gap-3">
      <h1 className="text-h3 text-ink">{t('errors.forbiddenTitle')}</h1>
      <p className="text-body text-ink-secondary">{t('errors.forbiddenText')}</p>
      <Link to="/" className="text-body text-ink-link underline">
        {t('nav.dashboard')}
      </Link>
    </section>
  );
}
