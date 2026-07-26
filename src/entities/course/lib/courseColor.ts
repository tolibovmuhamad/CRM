import type { CourseIcon as CourseIconKey } from '@/shared/api';
import { chart } from '@/shared/styles/tokens';

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

/** Цвет курса из палитры графиков — общий для кружка курса и меток расписания. */
export function courseColor(icon: CourseIconKey): string {
  return chart.categorical[colorIndex[icon] % chart.categorical.length];
}
