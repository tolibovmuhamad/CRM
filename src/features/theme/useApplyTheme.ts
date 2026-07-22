import { useEffect } from 'react';
import { useThemeStore } from './useThemeStore';

/** Прокидывает текущую тему в атрибут `data-theme` на <html>. */
export function useApplyTheme(): void {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
}
