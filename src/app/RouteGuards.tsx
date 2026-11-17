import type { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useSession } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export function RequireAuth() {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}

export function GuestOnly({ children }: PropsWithChildren) {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? <Navigate to={ROUTES.dashboard} replace /> : children;
}

export function RequireRole({ roles, children }: PropsWithChildren<{ roles: string[] }>) {
  const { user } = useSession();
  if (!user) return <Navigate to={ROUTES.login} replace />;
  return roles.some((role) => user.roles.includes(role)) ? (
    children
  ) : (
    <Navigate to={ROUTES.dashboard} replace />
  );
}
