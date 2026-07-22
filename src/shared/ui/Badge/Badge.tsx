import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'late' | 'info' | 'neutral';
export type BadgeVariant = 'subtle' | 'solid' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  /** Точка-индикатор слева. */
  dot?: boolean;
}

// Полные строки классов — иначе Tailwind не соберёт их при purge.
const toneStyles: Record<BadgeTone, Record<BadgeVariant, string>> = {
  brand: {
    subtle: 'bg-brand-subtle text-brand',
    solid: 'bg-brand text-brand-on',
    outline: 'border border-brand text-brand',
  },
  success: {
    subtle: 'bg-success-bg text-success-fg',
    solid: 'bg-success text-white',
    outline: 'border border-success text-success-fg',
  },
  warning: {
    subtle: 'bg-warning-bg text-warning-fg',
    solid: 'bg-warning text-black',
    outline: 'border border-warning text-warning-fg',
  },
  danger: {
    subtle: 'bg-danger-bg text-danger-fg',
    solid: 'bg-danger text-white',
    outline: 'border border-danger text-danger-fg',
  },
  late: {
    subtle: 'bg-late-bg text-late-fg',
    solid: 'bg-late text-white',
    outline: 'border border-late text-late-fg',
  },
  info: {
    subtle: 'bg-info-bg text-info-fg',
    solid: 'bg-info text-white',
    outline: 'border border-info text-info-fg',
  },
  neutral: {
    subtle: 'bg-surface-sunken text-ink-secondary',
    solid: 'bg-ink text-surface-card',
    outline: 'border border-line text-ink-secondary',
  },
};

export function Badge({
  tone = 'neutral',
  variant = 'subtle',
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-labelSm',
        toneStyles[tone][variant],
        className,
      )}
      {...rest}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
