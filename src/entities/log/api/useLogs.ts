import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type LogsQuery } from '@/shared/api';

/** Журнал действий (макет Administration/Logs). */
export function useLogs(query: LogsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.logs.list(query),
    queryFn: () => api.getLogs(query),
    placeholderData: keepPreviousData,
  });
}
