/** Общие варианты для Button и IconButton (по UI-Kit: Type × Size × State). */

export const buttonBase =
  'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card disabled:opacity-50 disabled:pointer-events-none';

export type ButtonVariant =
  'primary' | 'primaryOutline' | 'secondaryOutline' | 'secondaryBase' | 'text' | 'danger';

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-on hover:bg-brand-hover active:bg-brand-active',
  primaryOutline: 'border border-brand text-brand hover:bg-brand-subtle active:bg-brand-tint',
  secondaryOutline: 'border border-line text-ink hover:bg-surface-hover active:bg-surface-sunken',
  secondaryBase: 'bg-surface-sunken text-ink hover:bg-surface-hover',
  text: 'text-brand hover:bg-brand-subtle',
  /** Необратимые действия: удалить студента, группу, платёж. */
  danger: 'bg-danger text-white hover:bg-danger-fg active:bg-danger-fg',
};

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-labelSm',
  md: 'h-9 gap-2 px-4 text-label',
  lg: 'h-11 gap-2 px-5 text-label',
  /** Формы входа и регистрации — кнопка во всю ширину карточки. */
  xl: 'h-13 gap-2 px-6 text-label',
};

export const iconButtonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
  xl: 'h-13 w-13',
};
