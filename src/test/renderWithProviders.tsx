import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryKeys, type Session } from '@/shared/api';
import '@/shared/i18n';

export interface RenderOptions {
  /** Стартовый роут MemoryRouter. */
  route?: string;
  /** Готовая сессия в кэше — компонент отрисуется сразу как авторизованный. */
  session?: Session | null;
}

/**
 * Рендер с провайдерами приложения. Ретраи выключены: в тестах ошибка должна
 * приходить сразу, а не через три попытки.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', session }: RenderOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  if (session !== undefined) queryClient.setQueryData(queryKeys.session, session);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
}

/** Сессия-заготовка для тестов. */
export const testSession = (role: Session['user']['role'] = 'admin'): Session => ({
  token: 'test-token',
  user: { id: 'e-4', fullName: 'Sattorova Malika', phone: '+992 900 00 00 01', role },
});
