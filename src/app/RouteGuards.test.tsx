// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { SessionProvider } from '@/entities/session';
import { RequireAuth } from './RouteGuards';

describe('RequireAuth', () => {
  it('redirects anonymous users to login and does not render private content', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <MemoryRouter initialEntries={['/tickets?status=open']}>
            <Routes>
              <Route element={<RequireAuth />}>
                <Route path="/tickets" element={<h1>Private ticket list</h1>} />
              </Route>
              <Route path="/login" element={<h1>Sign in</h1>} />
            </Routes>
          </MemoryRouter>
        </SessionProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Private ticket list' })).not.toBeInTheDocument();
  });
});
