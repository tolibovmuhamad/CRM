import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type EnrollmentsQuery } from '@/shared/api';

/** Список записей в группы (макет Enroll students). */
export function useEnrollments(query: EnrollmentsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.enrollments.list(query),
    queryFn: () => api.getEnrollments(query),
    placeholderData: keepPreviousData,
  });
}

/** Записи по месяцам за год — данные для столбчатого графика. */
export function useEnrollmentStats(year: number) {
  return useQuery({
    queryKey: queryKeys.enrollments.stats(year),
    queryFn: () => api.getEnrollmentStats(year),
  });
}
