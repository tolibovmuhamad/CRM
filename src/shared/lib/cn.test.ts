import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('склеивает строки через пробел', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('отбрасывает falsy-значения', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('поддерживает условные классы', () => {
    const active = true;
    const disabled = false;
    expect(cn('base', active && 'is-active', disabled && 'is-disabled')).toBe('base is-active');
  });
});
