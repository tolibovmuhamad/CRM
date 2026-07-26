import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type EmployeesQuery } from '@/shared/api';

/** Список сотрудников и менторов (макет Employees/Grid и Employees/List). */
export function useEmployees(query: EmployeesQuery = {}) {
  return useQuery({
    queryKey: queryKeys.employees.list(query),
    queryFn: () => api.getEmployees(query),
    placeholderData: keepPreviousData,
  });
}
