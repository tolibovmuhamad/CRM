import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/shared/api';

/** Журнал посещаемости группы (макет Journal). Не запрашиваем, пока группа не выбрана. */
export function useJournal(groupId: string) {
  return useQuery({
    queryKey: queryKeys.journal.detail({ groupId }),
    queryFn: () => api.getJournal({ groupId }),
    enabled: Boolean(groupId),
    placeholderData: keepPreviousData,
  });
}
