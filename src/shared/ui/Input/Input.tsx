import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/** Размер поля: `md` — плотные экраны со списками, `lg` — формы (в макете 56px). */
export type InputSize = 'md' | 'lg';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  leftIcon?: ReactNode;
  /** Интерактивный слот справа (в макете — «Masc icon»): показать пароль, очистить поле. */
  rightSlot?: ReactNode;
  inputSize?: InputSize;
  containerClassName?: string;
}

const controlBase =
  'w-full rounded-md border bg-surface-card px-3 text-body text-ink placeholder:text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:bg-surface-sunken';

const controlSizes: Record<InputSize, string> = {
  md: 'h-9',
  lg: 'h-14 px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightSlot,
    inputSize = 'md',
    containerClassName,
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-labelSm text-ink-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBase,
            controlSizes[inputSize],
            leftIcon && 'pl-9',
            rightSlot && 'pr-10',
            error
              ? 'border-danger focus-visible:ring-danger'
              : 'border-line focus-visible:ring-brand',
            className,
          )}
          {...rest}
        />
        {rightSlot && (
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            {rightSlot}
          </span>
        )}
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
