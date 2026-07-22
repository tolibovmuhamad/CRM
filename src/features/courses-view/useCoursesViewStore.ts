import { create } from 'zustand';

export type CoursesView = 'list' | 'grid';

const STORAGE_KEY = 'omuz-courses-view';

function getInitial(): CoursesView {
  if (typeof window === 'undefined') return 'grid';
  return window.localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
}

interface CoursesViewState {
  view: CoursesView;
  setView: (view: CoursesView) => void;
}

/**
 * Вид списка курсов. По умолчанию плитка — в макете Courses/Grid идёт первым,
 * и карточка курса из UI-Kit рассчитана именно на сетку.
 */
export const useCoursesViewStore = create<CoursesViewState>((set) => ({
  view: getInitial(),
  setView: (view) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, view);
    set({ view });
  },
}));
