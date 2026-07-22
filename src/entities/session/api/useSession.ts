import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys, type LoginDto, type SignupDto } from '@/shared/api';

/**
 * Текущая сессия. `null` — не авторизован. Источник — `api`, поэтому компоненты
 * не знают, откуда пришёл пользователь: из localStorage мока или из cookie бэкенда.
 */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => api.getSession(),
    // Сессия меняется только через login/logout — перезапрашивать её незачем.
    staleTime: Infinity,
    retry: false,
  });
}

/** Вход. При успехе сессия кладётся в кэш — редирект делает вызывающий экран. */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: LoginDto) => api.login(dto),
    onSuccess: (session) => qc.setQueryData(queryKeys.session, session),
  });
}

/** Выход. Кэш чистим целиком: данные прошлого пользователя новому не показываем. */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      qc.clear();
      qc.setQueryData(queryKeys.session, null);
    },
  });
}

/** Заявка на обучение с экрана Sign up. Сессию не создаёт. */
export function useSignup() {
  return useMutation({
    mutationFn: (dto: SignupDto) => api.signup(dto),
  });
}
