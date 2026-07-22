import { describe, expect, it } from 'vitest';
import { formatFileSize } from './fileSize';

describe('formatFileSize', () => {
  it('байты оставляет как есть', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('переводит в килобайты и мегабайты', () => {
    expect(formatFileSize(2048)).toBe('2,0 KB');
    expect(formatFileSize(1_048_576)).toBe('1,0 MB');
  });

  it('крупные значения округляет до целого', () => {
    // 428 900 000 B ≈ 409 MB — дробная часть тут только мешает.
    expect(formatFileSize(428_900_000)).toBe('409 MB');
  });

  it('уважает локаль разделителя', () => {
    expect(formatFileSize(2048, 'en-US')).toBe('2.0 KB');
  });
});
