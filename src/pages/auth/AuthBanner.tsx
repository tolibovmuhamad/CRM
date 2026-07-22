import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/ui';
import coverUrl from '@/shared/assets/auth-cover.png';

/**
 * Правая половина экрана входа (макет: Banner → Cover). На мобайле уезжает под
 * форму и уменьшается — как в мобильном кадре макета.
 *
 * Фон в макете — сплошной #E2E8F0. Взят токен `brand-subtle`: тот же светлый тон,
 * но живёт в обеих темах, тогда как зашитый slate200 в тёмной теме слепит.
 */
export function AuthBanner() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md bg-brand-subtle px-6 py-10">
      <p className="text-h4 text-ink lg:text-h2">{t('auth.welcomeTo')}</p>
      <Logo height={60} className="h-15 w-auto lg:h-32" />
      <img
        src={coverUrl}
        alt=""
        aria-hidden="true"
        className="mt-4 w-full max-w-xl object-contain"
      />
    </div>
  );
}
