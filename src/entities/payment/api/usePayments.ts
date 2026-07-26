import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, queryKeys, type PaymentsQuery } from '@/shared/api';

/** Список платежей (макет Accounting → Payments). */
export function usePayments(query: PaymentsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.payments.list(query),
    queryFn: () => api.getPayments(query),
    placeholderData: keepPreviousData,
  });
}

/** Сводка по платежам (собрано / ожидается / количество) для плиток над таблицей. */
export function usePaymentStats() {
  return useQuery({
    queryKey: queryKeys.payments.stats,
    queryFn: () => api.getPaymentStats(),
  });
}
