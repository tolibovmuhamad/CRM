import { chart } from '@/shared/styles/tokens';
import { cn } from '@/shared/lib/cn';

export type EmployeeAvatarSize = 'sm' | 'md';

export interface EmployeeAvatarProps {
  fullName: string;
  avatarUrl?: string;
  /** md — карточка (48px), sm — строка таблицы (36px). */
  size?: EmployeeAvatarSize;
  className?: string;
}

// Размер задаём внутри, а не через className: `cn` не разруливает конфликты Tailwind.
const sizeClass: Record<EmployeeAvatarSize, string> = {
  sm: 'h-9 w-9 text-bodySm',
  md: 'h-12 w-12 text-label',
};

/** Инициалы из ФИО: «Karimov Sardor» → «KS». */
function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** Устойчивый индекс цвета по имени — сотрудник всегда одного цвета. */
function colorIndex(seed: string): number {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return sum % chart.categorical.length;
}

/**
 * Аватар сотрудника: фото, если есть, иначе кружок с инициалами.
 * Фото на сервер грузится вместе с бэкендом — пока приходит только из моков.
 * Цвет подложки — из палитры графиков `tokens.chart.categorical`, не хардкод.
 */
export function EmployeeAvatar({
  fullName,
  avatarUrl,
  size = 'md',
  className,
}: EmployeeAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={cn('shrink-0 rounded-full object-cover', sizeClass[size], className)}
      />
    );
  }

  const color = chart.categorical[colorIndex(fullName)];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        sizeClass[size],
        className,
      )}
      style={{
        // Тот же цвет с малой непрозрачностью: читается в обеих темах.
        backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
        color,
      }}
    >
      {initials(fullName)}
    </span>
  );
}
