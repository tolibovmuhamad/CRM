import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui/icons';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/**
 * Пагинация списков. В макете отдельным компонентом не нарисована, но по ТЗ §11
 * состояние «много данных» обязательно — иначе длинные списки некуда листать.
 */
export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={t('pagination.aria')}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-bodySm text-ink-secondary">{t('pagination.range', { from, to, total })}</p>

      <div className="flex items-center gap-1">
        <IconButton
          aria-label={t('pagination.prev')}
          variant="secondaryOutline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon size={18} />
        </IconButton>

        {pageNumbers(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-bodySm text-ink-muted" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                'h-8 min-w-8 rounded-md px-2 text-labelSm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                item === page
                  ? 'bg-brand text-brand-on'
                  : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
              )}
            >
              {item}
            </button>
          ),
        )}

        <IconButton
          aria-label={t('pagination.next')}
          variant="secondaryOutline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon size={18} />
        </IconButton>
      </div>
    </nav>
  );
}

/** Первая, последняя, текущая и соседние страницы; остальное — многоточие. */
function pageNumbers(page: number, pageCount: number): (number | 'gap')[] {
  const pages = new Set([1, pageCount, page, page - 1, page + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  return visible.flatMap((p, index) =>
    index > 0 && p - visible[index - 1] > 1 ? (['gap', p] as (number | 'gap')[]) : [p],
  );
}
