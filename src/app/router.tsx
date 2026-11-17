import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/widgets/app-shell';
import { PublicShell } from '@/widgets/public-shell';
import { ROUTES } from '@/shared/config';
import { AsyncBoundary, RouteLoader } from '@/shared/ui';
import { GuestOnly, RequireAuth, RequireRole } from './RouteGuards';

const PublicHomePage = lazy(() =>
  import('@/pages/public-home').then((module) => ({ default: module.PublicHomePage })),
);
const LoginPage = lazy(() => import('@/pages/auth-login'));
const RegisterPage = lazy(() => import('@/pages/auth-register'));
const VerifyEmailPage = lazy(() => import('@/pages/auth-verify-email'));
const SetPasswordPage = lazy(() => import('@/pages/auth-set-password'));
const HomePage = lazy(() => import('@/pages/home'));
const TicketsPage = lazy(() => import('@/pages/tickets-list'));
const CreateTicketPage = lazy(() => import('@/pages/ticket-create'));
const TicketDetailsPage = lazy(() => import('@/pages/ticket-details'));
const NotificationsPage = lazy(() => import('@/pages/notifications'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const AdminUsersPage = lazy(() => import('@/pages/admin-users'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicShell />,
    children: [
      { index: true, element: <PublicHomePage /> },
      {
        path: ROUTES.login.slice(1),
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: ROUTES.register.slice(1),
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
      { path: ROUTES.verifyEmail.slice(1), element: <VerifyEmailPage /> },
      { path: ROUTES.setPassword.slice(1), element: <SetPasswordPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: ROUTES.dashboard.slice(1), element: <HomePage /> },
          { path: ROUTES.tickets.slice(1), element: <TicketsPage /> },
          { path: ROUTES.ticketCreate.slice(1), element: <CreateTicketPage /> },
          { path: 'tickets/:ticketId', element: <TicketDetailsPage /> },
          { path: ROUTES.notifications.slice(1), element: <NotificationsPage /> },
          { path: ROUTES.profile.slice(1), element: <ProfilePage /> },
          {
            path: ROUTES.adminUsers.slice(1),
            element: (
              <RequireRole roles={['ROLE_ADMIN']}>
                <AdminUsersPage />
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <AsyncBoundary>
        <Suspense fallback={<RouteLoader />}>
          <NotFoundPage />
        </Suspense>
      </AsyncBoundary>
    ),
  },
]);
