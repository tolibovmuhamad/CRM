import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type GroupsQuery } from '@/shared/api';

/** Список групп (макет Groups/Grid и Groups/List). */
export function useGroups(query: GroupsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.groups.list(query),
    queryFn: () => api.getGroups(query),
    placeholderData: keepPreviousData,
  });
}

/** Карточка группы по id. */
export function useGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => api.getGroup(id),
    enabled: Boolean(id),
  });
}
