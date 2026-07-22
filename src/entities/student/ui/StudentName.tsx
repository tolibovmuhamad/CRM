import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { CrownIcon } from '@/shared/ui/icons';

export interface StudentNameProps {
  fullName: string;
  isPremium?: boolean;
  /** Порядковый номер строки в таблице (в макете «1. Tojiev Olimjon»). */
  index?: number;
  className?: string;
}

/** Имя студента с короной у премиума — одинаково в таблице и на карточке. */
export function StudentName({ fullName, isPremium, index, className }: StudentNameProps) {
  const { t } = useTranslation();

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {index != null && <span className="text-ink-secondary">{index}.</span>}
      {fullName}
      {isPremium && (
        <>
          {/* Иконка декоративная (Base ставит aria-hidden), подпись — отдельным текстом для скринридера. */}
          <CrownIcon size={16} className="text-warning" />
          <span className="sr-only">{t('students.premium')}</span>
        </>
      )}
    </span>
  );
}
