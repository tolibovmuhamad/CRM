import { cn } from '@/shared/lib/cn';

export interface SkeletonProps {
  className?: string;
}

/** Заглушка загрузки (ТЗ §11: у списков обязательно состояние loading). */
export function Skeleton({ className }: SkeletonProps) {
  return <span className={cn('block animate-pulse rounded-md bg-surface-sunken', className)} />;
}

/** Скелет таблицы: шапка и заданное число строк. */
export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4" aria-hidden>
      {Array.from({ length: rows + 1 }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} className={cn('h-5 flex-1', colIndex === 0 && 'flex-[2]')} />
          ))}
        </div>
      ))}
    </div>
  );
}
