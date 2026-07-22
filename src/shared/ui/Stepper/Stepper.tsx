import { Fragment, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface StepItem {
  id: string;
  label: ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  /** Индекс текущего шага (0-based). */
  current: number;
  className?: string;
}

/** Горизонтальный степпер (UI-Kit: Step) для многошаговых форм. */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <Fragment key={step.id}>
            <li className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-labelSm',
                  done && 'border-brand bg-brand text-brand-on',
                  active && 'border-brand text-brand',
                  !done && !active && 'border-line text-ink-muted',
                )}
              >
                {index + 1}
              </span>
              <span className={cn('text-label', active ? 'text-ink' : 'text-ink-secondary')}>
                {step.label}
              </span>
            </li>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn('mx-3 h-px flex-1', done ? 'bg-brand' : 'bg-line')}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
