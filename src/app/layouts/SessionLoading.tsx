import { useTranslation } from 'react-i18next';
import { Spinner } from '@/shared/ui';

/** Пока восстанавливаем сессию, показываем не пустой экран, а состояние загрузки (ТЗ §11). */
export function SessionLoading() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center gap-3 bg-surface-page text-body text-ink-secondary"
    >
      <Spinner />
      {t('common.loading')}
    </div>
  );
}
