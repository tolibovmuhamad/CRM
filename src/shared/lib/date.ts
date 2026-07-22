import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import type { Locale } from 'date-fns';

/**
 * Локаль дат по языку интерфейса. Таджикской локали в date-fns нет, поэтому для
 * `tg` берём русскую: месяцы кириллицей ближе, чем английские.
 */
function localeFor(language: string): Locale {
  return language.startsWith('en') ? enUS : ru;
}

/** Дата в коротком виде: «9 апр. 2023» / «Apr 9, 2023». */
export function formatDate(value: string | undefined, language: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'PP', { locale: localeFor(language) });
}

/** Период обучения: «9 апр. 2023 — 10 авг. 2023». Одна из границ может отсутствовать. */
export function formatDateRange(
  from: string | undefined,
  to: string | undefined,
  language: string,
): string {
  const start = formatDate(from, language);
  const end = formatDate(to, language);
  if (start && end) return `${start} — ${end}`;
  return start || end;
}
