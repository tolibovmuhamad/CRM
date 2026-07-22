import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/Spinner';
import {
  buttonBase,
  buttonVariants,
  iconButtonSizes,
  type ButtonSize,
  type ButtonVariant,
} from '@/shared/ui/Button';

/** Кнопка только с иконкой. `aria-label` обязателен (ТЗ §9). */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    variant = 'secondaryOutline',
    size = 'md',
    loading = false,
    disabled,
    children,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonBase, buttonVariants[variant], iconButtonSizes[size], className)}
      {...rest}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});
