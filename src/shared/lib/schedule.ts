import type { TFunction } from 'i18next';
import type { Weekday } from '@/shared/api/schemas';

/**
 * Дни занятий одной строкой: «Пн, Ср, Пт» (в макете — «Mn, Tu, Wd»).
 * Общий хелпер: одинаково используется карточкой группы и карточкой курса.
 */
export function formatScheduleDays(days: Weekday[], t: TFunction): string {
  return days.map((day) => t(`weekdays.short.${day}`)).join(', ');
}
