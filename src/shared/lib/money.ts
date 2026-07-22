/**
 * Деньги (ТЗ §9). Хранение и расчёты — в **дирамах** (целые числа), не во float.
 * 1 сомони = 100 дирам. В сомони переводим только для вывода.
 */

/** Дирам — минимальная денежная единица (1/100 сомони). Целое число. */
export type Diram = number;

export const DIRAM_IN_SOMONI = 100;

/** Символ сомони (как в макете). */
export const SOMONI_SYMBOL = 'с';

/** Сомони в дирамы (для парсинга ввода). Округляет до целого дирама. */
export function somoniToDiram(somoni: number): Diram {
  return Math.round(somoni * DIRAM_IN_SOMONI);
}

/** Дирамы в сомони (число, без форматирования). */
export function diramToSomoni(diram: Diram): number {
  return diram / DIRAM_IN_SOMONI;
}

export interface FormatSomoniOptions {
  /** Добавлять символ валюты. По умолчанию true. */
  withSymbol?: boolean;
  /** Число знаков после запятой. По умолчанию: 0 для целых сомони, иначе 2. */
  fractionDigits?: 0 | 2;
  /** Локаль форматирования числа. По умолчанию 'ru-RU'. */
  locale?: string;
}

/**
 * Форматирует сумму в дирамах как строку в сомони: 825000 -> "8 250 с".
 * Между числом и символом — неразрывный пробел ( ), чтобы «250 с» не разрывалось.
 */
export function formatSomoni(diram: Diram, options: FormatSomoniOptions = {}): string {
  const { withSymbol = true, fractionDigits, locale = 'ru-RU' } = options;
  const somoni = diramToSomoni(diram);
  const digits = fractionDigits ?? (diram % DIRAM_IN_SOMONI === 0 ? 0 : 2);
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(somoni);
  return withSymbol ? `${formatted} ${SOMONI_SYMBOL}` : formatted;
}
