import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type GraduatesQuery } from '@/shared/api';

/** Список выпускников (макет Graduates). */
export function useGraduates(query: GraduatesQuery = {}) {
  return useQuery({
    queryKey: queryKeys.graduates.list(query),
    queryFn: () => api.getGraduates(query),
    placeholderData: keepPreviousData,
  });
}

/** Счётчики над таблицей: всего и по видам трудоустройства. */
export function useGraduateStats() {
  return useQuery({
    queryKey: queryKeys.graduates.stats,
    queryFn: () => api.getGraduateStats(),
  });
}
