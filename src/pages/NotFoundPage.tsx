import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-start gap-3">
      <h1 className="text-h2 text-ink">404</h1>
      <Link to="/" className="text-body text-ink-link underline">
        {t('nav.dashboard')}
      </Link>
    </section>
  );
}
