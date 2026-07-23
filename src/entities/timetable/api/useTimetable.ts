import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type TimetableQuery } from '@/shared/api';

/** Недельная сетка расписания (макет Time table). */
export function useTimetable(query: TimetableQuery = {}) {
  return useQuery({
    queryKey: queryKeys.timetable.list(query),
    queryFn: () => api.getTimetable(query),
    placeholderData: keepPreviousData,
  });
}
