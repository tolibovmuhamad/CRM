import { create } from 'zustand';

export type GroupsView = 'list' | 'grid';

const STORAGE_KEY = 'omuz-groups-view';

function getInitial(): GroupsView {
  if (typeof window === 'undefined') return 'grid';
  return window.localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
}

interface GroupsViewState {
  view: GroupsView;
  setView: (view: GroupsView) => void;
}

/**
 * Вид списка групп. По умолчанию плитка — в макете Groups/Grid идёт первым, да и
 * расписание с счётчиками читается на карточке лучше, чем в строке таблицы.
 */
export const useGroupsViewStore = create<GroupsViewState>((set) => ({
  view: getInitial(),
  setView: (view) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, view);
    set({ view });
  },
}));
