import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { appConfig } from '@/shared/config';
import { AsyncBoundary, RouteLoader } from '@/shared/ui';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

export function AppShell() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-shell__main">
        <AppTopbar />
        <main className="page-content">
          <AsyncBoundary>
            <Suspense fallback={<RouteLoader />}>
              <Outlet />
            </Suspense>
          </AsyncBoundary>
        </main>
        <footer className="app-footer">
          <span>{appConfig.appName}</span>
          <span>Личный кабинет службы поддержки</span>
        </footer>
      </div>
    </div>
  );
}
