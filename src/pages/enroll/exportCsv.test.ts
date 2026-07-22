import { describe, expect, it } from 'vitest';
import { toCsv } from './exportCsv';

describe('toCsv', () => {
  it('оборачивает поля в кавычки', () => {
    expect(toCsv([['a', 'b']])).toBe('"a","b"');
  });

  it('не ломает столбцы, если внутри поля запятая', () => {
    const csv = toCsv([['Tojiev, Olimjon', 'C# 5 June']]);
    expect(csv).toBe('"Tojiev, Olimjon","C# 5 June"');
  });

  it('удваивает кавычки внутри поля', () => {
    expect(toCsv([['Группа "А"']])).toBe('"Группа ""А"""');
  });

  it('разделяет строки переводом CRLF', () => {
    expect(toCsv([['a'], ['b']])).toBe('"a"\r\n"b"');
  });
});
