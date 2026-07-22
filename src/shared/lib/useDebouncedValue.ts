import { useEffect, useState } from 'react';

/**
 * Значение с задержкой — для поиска: запрос уходит, когда пользователь перестал
 * печатать, а не на каждую букву.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
