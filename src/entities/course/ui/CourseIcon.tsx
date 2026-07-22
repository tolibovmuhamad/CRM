import type { CourseIcon as CourseIconKey } from '@/shared/api';
import { chart } from '@/shared/styles/tokens';
import { cn } from '@/shared/lib/cn';

/**
 * Кружок курса (в макете — `JS_circle` 56×56 внутри компонента `Course`).
 *
 * В макете внутри кружка стоят фирменные логотипы из набора `Logo course`
 * (C#, C++, Frontend, Python, HTML & CSS, UX/UI). Векторы логотипов ждут выгрузки
 * SVG из Figma, поэтому пока рисуем короткий код курса на цветной подложке.
 * Цвета — из палитры графиков `tokens.chart.categorical`, не хардкод.
 */

/** Короткий код внутри кружка — по названию курса из макета. */
const shortCodes: Record<CourseIconKey, string> = {
  csharp: 'C#',
  cpp: 'C++',
  frontend: 'FE',
  python: 'Py',
  htmlcss: '<>',
  uxui: 'UX',
  javascript: 'JS',
  react: 'Re',
};

/** Индекс цвета в палитре — фиксированный, чтобы курс всегда был одного цвета. */
const colorIndex: Record<CourseIconKey, number> = {
  csharp: 0,
  cpp: 1,
  frontend: 2,
  python: 3,
  htmlcss: 4,
  uxui: 5,
  javascript: 6,
  react: 7,
};

export interface CourseIconProps {
  icon: CourseIconKey;
  className?: string;
}

export function CourseIcon({ icon, className }: CourseIconProps) {
  const color = chart.categorical[colorIndex[icon] % chart.categorical.length];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-label',
        className,
      )}
      style={{
        // Подложка — тот же цвет с малой непрозрачностью: читается в обеих темах.
        backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
        color,
      }}
    >
      {shortCodes[icon]}
    </span>
  );
}
