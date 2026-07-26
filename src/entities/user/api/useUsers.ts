import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type UsersQuery } from '@/shared/api';

/** Пользователи системы (макет Administration/User). */
export function useUsers(query: UsersQuery = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: () => api.getUsers(query),
    placeholderData: keepPreviousData,
  });
}
