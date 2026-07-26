import type { CourseIcon as CourseIconKey } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { courseColor } from '../lib/courseColor';

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

export interface CourseIconProps {
  icon: CourseIconKey;
  className?: string;
}

export function CourseIcon({ icon, className }: CourseIconProps) {
  const color = courseColor(icon);

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
