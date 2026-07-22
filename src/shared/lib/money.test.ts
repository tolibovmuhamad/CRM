import { describe, expect, it } from 'vitest';
import { diramToSomoni, formatSomoni, somoniToDiram } from './money';

// Пробелы-разделители Intl могут быть NBSP — сравниваем без пробелов.
const noSpaces = (s: string) => s.replace(/\s/g, '');

describe('money', () => {
  it('переводит сомони в дирамы целым числом', () => {
    expect(somoniToDiram(82.5)).toBe(8250);
    expect(somoniToDiram(1)).toBe(100);
    expect(somoniToDiram(0.1)).toBe(10);
  });

  it('переводит дирамы в сомони', () => {
    expect(diramToSomoni(8250)).toBe(82.5);
    expect(diramToSomoni(100)).toBe(1);
  });

  it('форматирует целые суммы без копеек и с символом', () => {
    expect(noSpaces(formatSomoni(825000))).toBe('8250с');
    expect(noSpaces(formatSomoni(1258000))).toBe('12580с');
  });

  it('показывает дробную часть только при остатке в дирамах', () => {
    expect(noSpaces(formatSomoni(8200))).toBe('82с'); // 82,00 сомони — целое
    expect(noSpaces(formatSomoni(8250))).toBe('82,50с'); // 82,50 сомони
    expect(noSpaces(formatSomoni(8255))).toBe('82,55с'); // 82,55 сомони
  });

  it('умеет без символа и с принудительным числом знаков', () => {
    expect(noSpaces(formatSomoni(825000, { withSymbol: false }))).toBe('8250');
    expect(noSpaces(formatSomoni(825000, { fractionDigits: 2 }))).toBe('8250,00с');
  });
});
