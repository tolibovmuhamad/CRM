import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface SegmentItem<T extends string> {
  value: T;
  /** Подпись или иконка внутри сегмента. */
  content: ReactNode;
  /** Доступное имя — обязательно, если внутри только иконка. */
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  items: SegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

/**
 * Переключатель из двух-трёх взаимоисключающих вариантов (в макете — вид списка
 * плитка/таблица). Группа радиокнопок: стрелки не нужны, но роль честная.
 */
export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest['aria-label']}
      className={cn('inline-flex rounded-md border border-line bg-surface-card p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={item.label}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex h-8 items-center justify-center rounded-sm px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              active
                ? 'bg-brand-subtle text-brand'
                : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
            )}
          >
            {item.content}
          </button>
        );
      })}
    </div>
  );
}
