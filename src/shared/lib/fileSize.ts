const UNITS = ['B', 'KB', 'MB', 'GB'] as const;
const STEP = 1024;

/** Размер файла человеку: 1536 → «1,5 KB». Единицы в макете латиницей. */
export function formatFileSize(bytes: number, locale = 'ru-RU'): string {
  if (bytes < STEP) return `${bytes} ${UNITS[0]}`;

  let value = bytes;
  let unit = 0;
  while (value >= STEP && unit < UNITS.length - 1) {
    value /= STEP;
    unit += 1;
  }

  const digits = value < 10 ? 1 : 0;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  return `${formatted} ${UNITS[unit]}`;
}
