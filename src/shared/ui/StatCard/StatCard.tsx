import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';

export interface StatCardProps {
  label: ReactNode;
  /**
   * Число (счётчик) или готовая строка (например, сумма в сомони).
   * `undefined` — данные ещё грузятся, показываем скелет вместо нуля.
   */
  value: number | string | undefined;
  /** Цветная точка слева, как у счётчиков в макете. */
  toneClassName?: string;
  className?: string;
}

/** Карточка-счётчик над списком (макет Graduates, Dashboard). */
export function StatCard({ label, value, toneClassName, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-1 p-4', className)}>
      <span className="flex items-center gap-2 text-bodySm text-ink-secondary">
        {toneClassName && (
          <span className={cn('h-2 w-2 shrink-0 rounded-full', toneClassName)} aria-hidden />
        )}
        {label}
      </span>
      {value == null ? (
        <Skeleton className="h-8 w-12" />
      ) : (
        <strong className="text-h3 text-ink">{value}</strong>
      )}
    </Card>
  );
}
