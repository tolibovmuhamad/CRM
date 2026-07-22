import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { useApplyTheme } from '@/features/theme/useApplyTheme';

/** Глобальные провайдеры приложения: серверное состояние + применение темы. */
export function AppProviders({ children }: { children: ReactNode }) {
  useApplyTheme();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
