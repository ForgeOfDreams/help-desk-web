import { Suspense } from 'react';
import { Outlet, Link } from 'react-router';
import { FiLifeBuoy } from 'react-icons/fi';
import { appConfig, ROUTES } from '@/shared/config';
import { AsyncBoundary, RouteLoader } from '@/shared/ui';

export function PublicShell() {
  return (
    <div className="public-shell">
      <header className="public-header">
        <Link
          className="brand public-brand"
          to={ROUTES.home}
          aria-label={`${appConfig.appName} — главная`}
        >
          <span className="brand__mark" aria-hidden="true">
            <FiLifeBuoy size={23} />
          </span>
          <span className="brand__copy">
            <strong>{appConfig.appName}</strong>
            <small>ПОРТАЛ ПОДДЕРЖКИ</small>
          </span>
        </Link>
      </header>
      <main className="public-main">
        <AsyncBoundary>
          <Suspense fallback={<RouteLoader />}>
            <Outlet />
          </Suspense>
        </AsyncBoundary>
      </main>
      <footer className="public-footer">
        <span>{appConfig.appName}</span>
        <span>Доступ к обращениям — после входа.</span>
      </footer>
    </div>
  );
}
