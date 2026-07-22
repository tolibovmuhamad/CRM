import type { ContractStatus } from '@/shared/api';

/** Значения панели фильтров. Пустая строка = «фильтр не выбран». */
export interface StudentsFiltersValue {
  search: string;
  courseId: string;
  groupId: string;
  contractStatus: ContractStatus | '';
}

export const emptyStudentsFilters: StudentsFiltersValue = {
  search: '',
  courseId: '',
  groupId: '',
  contractStatus: '',
};
