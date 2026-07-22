import { useEffect, useState } from 'react';

/**
 * Подписка на media-запрос. Нужна там, где разный CSS не спасает и требуется
 * другое дерево компонентов (на мобайле список студентов — плитка, а не таблица).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Совпадает с брейкпоинтом `sm` в Tailwind. */
export const useIsMobile = () => !useMediaQuery('(min-width: 640px)');
