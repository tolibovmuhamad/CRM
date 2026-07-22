import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'omuz-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/**
 * UI-состояние темы (ТЗ §2: Zustand — только UI). Значение применяется к <html>
 * через хук useApplyTheme и сохраняется в localStorage.
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, theme);
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'),
}));
