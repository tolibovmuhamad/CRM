import '@testing-library/jest-dom';
import { vi } from 'vitest';
import i18n from '@/shared/i18n';

// Язык тестов фиксируем: иначе детектор возьмёт язык jsdom и подписи «уедут».
void i18n.changeLanguage('ru');

// jsdom не реализует ResizeObserver, а на нём держится ResponsiveContainer Recharts.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/**
 * jsdom не реализует matchMedia — нужен для useThemeStore и `useMediaQuery`.
 *
 * `min-width`/`max-width` считаем по реальному `window.innerWidth` (в jsdom это
 * 1024), иначе любой запрос отвечает «не совпало» и компоненты всегда думают,
 * что они на мобайле. Чтобы проверить мобильную вёрстку, тест меняет
 * `window.innerWidth` перед рендером.
 */
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const min = /min-width:\s*(\d+)px/.exec(query);
    const max = /max-width:\s*(\d+)px/.exec(query);
    const matches =
      (!min || window.innerWidth >= Number(min[1])) &&
      (!max || window.innerWidth <= Number(max[1]));

    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
}
