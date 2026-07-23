import '@testing-library/jest-dom';
import { vi } from 'vitest';
import i18n from '@/shared/i18n';

// Язык тестов фиксируем: иначе детектор возьмёт язык jsdom и подписи «уедут».
void i18n.changeLanguage('ru');

/**
 * jsdom в этой связке не поднимает настоящий Storage: `window.localStorage`
 * приходит пустым `{}` без методов, и `getItem`/`setItem`/`clear` падают
 * с `not a function`. От localStorage зависят тема, вид списков, сессия мока и
 * `beforeEach` тестов. Кладём минимальную in-memory реализацию Storage; в
 * браузере приложение работает с настоящим localStorage.
 */
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

if (typeof globalThis.localStorage?.clear !== 'function') {
  const memoryStorage = createMemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', {
    value: memoryStorage,
    configurable: true,
  });
  Object.defineProperty(window, 'localStorage', {
    value: memoryStorage,
    configurable: true,
  });
}

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
