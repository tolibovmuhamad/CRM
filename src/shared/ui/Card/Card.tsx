import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

/** Скругление: `md` — панели форм, `2xl` — крупные блоки дашборда (оба есть в макете). */
export type CardRadius = 'md' | '2xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
}

const radii: Record<CardRadius, string> = {
  md: 'rounded-md',
  '2xl': 'rounded-2xl',
};

/** Карточка-контейнер: поверхность, скругление, граница (крупные блоки макета). */
export function Card({ radius = '2xl', className, ...rest }: CardProps) {
  return (
    <div className={cn('border border-line bg-surface-card', radii[radius], className)} {...rest} />
  );
}
