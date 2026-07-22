import { create } from 'zustand';

const STORAGE_KEY = 'omuz-sidebar-collapsed';

function getInitial(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
}

/** UI-состояние сворачивания сайдбара (ТЗ §2: Zustand — только UI). */
export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: getInitial(),
  setCollapsed: (value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    }
    set({ collapsed: value });
  },
  toggle: () => get().setCollapsed(!get().collapsed),
}));
