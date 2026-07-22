import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';
import type { InputSize } from '@/shared/ui/Input';
import { ChevronDownIcon } from '@/shared/ui/icons';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  /** Совпадает с размерами Input, чтобы поля в одном ряду были одной высоты. */
  selectSize?: InputSize;
  containerClassName?: string;
}

const controlBase =
  'w-full appearance-none rounded-md border bg-surface-card pl-3 pr-9 text-body text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:bg-surface-sunken';

const controlSizes: Record<InputSize, string> = {
  md: 'h-9',
  lg: 'h-14 pl-4',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, selectSize = 'md', containerClassName, id, className, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-labelSm text-ink-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBase,
            controlSizes[selectSize],
            error
              ? 'border-danger focus-visible:ring-danger'
              : 'border-line focus-visible:ring-brand',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon
          size={18}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
      </div>
      {error ? (
        <p id={errorId} className="text-labelSm text-danger-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-labelSm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
