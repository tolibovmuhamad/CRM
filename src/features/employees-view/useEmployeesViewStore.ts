import { create } from 'zustand';

export type EmployeesView = 'list' | 'grid';

const STORAGE_KEY = 'omuz-employees-view';

function getInitial(): EmployeesView {
  if (typeof window === 'undefined') return 'grid';
  return window.localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
}

interface EmployeesViewState {
  view: EmployeesView;
  setView: (view: EmployeesView) => void;
}

/**
 * Вид списка сотрудников. По умолчанию плитка — в макете Employees/Grid идёт
 * первым, и карточка сотрудника рассчитана на сетку.
 */
export const useEmployeesViewStore = create<EmployeesViewState>((set) => ({
  view: getInitial(),
  setView: (view) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, view);
    set({ view });
  },
}));
