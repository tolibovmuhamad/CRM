import { QueryClient } from '@tanstack/react-query';

/** Единый клиент серверного состояния (ТЗ §2, TanStack Query). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
