import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  containerClassName?: string;
}

const controlBase =
  'min-h-[88px] w-full rounded-md border bg-surface-card px-3 py-2 text-body text-ink placeholder:text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:bg-surface-sunken';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, containerClassName, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-labelSm text-ink-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          controlBase,
          error
            ? 'border-danger focus-visible:ring-danger'
            : 'border-line focus-visible:ring-brand',
          className,
        )}
        {...rest}
      />
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
