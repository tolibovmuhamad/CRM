import { useTranslation } from 'react-i18next';
import { Card } from '@/shared/ui';
import { formatSomoni } from '@/shared/lib/money';

/**
 * Временная страница-заглушка (этап 1) — доказывает связку роутинг + i18n + токены.
 * Реальные экраны придут на этапе 5 (см. roadmap.md).
 */
export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-h3 text-ink">{t(titleKey)}</h1>
      <Card className="max-w-xl p-6 shadow-sm">
        <h2 className="text-h5 text-ink">{t('scaffold.title')}</h2>
        <p className="mt-2 text-body text-ink-secondary">{t('scaffold.note')}</p>
        <p className="mt-4 text-bodySm text-ink-muted">
          money.formatSomoni(825000) → <span className="text-ink">{formatSomoni(825000)}</span>
        </p>
      </Card>
    </section>
  );
}
