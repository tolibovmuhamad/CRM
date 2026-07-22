import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/entities/session';
import { canAccessPath } from '@/shared/config/navigation';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { SessionLoading } from './SessionLoading';

/**
 * Защита приложения: без сессии — на экран входа, с сессией, но без прав на раздел —
 * понятная страница «нет доступа» вместо молчаливого редиректа.
 */
export function RequireAuth() {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <SessionLoading />;

  if (!session) {
    // Запомнили, куда шли: после входа вернём туда же.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!canAccessPath(session.user.role, location.pathname)) return <ForbiddenPage />;

  return <Outlet />;
}
