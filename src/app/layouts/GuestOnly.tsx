import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/entities/session';
import { SessionLoading } from './SessionLoading';

/** Экраны входа и заявки авторизованному не нужны — уводим на главную. */
export function GuestOnly() {
  const { data: session, isPending } = useSession();

  if (isPending) return <SessionLoading />;
  if (session) return <Navigate to="/" replace />;

  return <Outlet />;
}
