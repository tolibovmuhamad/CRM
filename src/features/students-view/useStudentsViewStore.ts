import { create } from 'zustand';

export type StudentsView = 'list' | 'grid';

const STORAGE_KEY = 'omuz-students-view';

function getInitial(): StudentsView {
  if (typeof window === 'undefined') return 'list';
  return window.localStorage.getItem(STORAGE_KEY) === 'grid' ? 'grid' : 'list';
}

interface StudentsViewState {
  view: StudentsView;
  setView: (view: StudentsView) => void;
}

/**
 * Выбранный вид списка студентов (таблица/плитка). Как и свёрнутый сайдбар,
 * переживает перезагрузку: вид выбирают один раз, а не при каждом заходе.
 */
export const useStudentsViewStore = create<StudentsViewState>((set) => ({
  view: getInitial(),
  setView: (view) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, view);
    set({ view });
  },
}));
