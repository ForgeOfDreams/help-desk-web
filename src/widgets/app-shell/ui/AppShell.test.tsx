// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';

vi.mock('@/entities/session', () => ({
  useSession: () => ({
    user: { displayName: 'Александр Иванов', email: 'alex@example.com', roles: ['ROLE_USER'] },
    isAdmin: false,
    signOut: vi.fn(),
  }),
}));

describe('AppShell', () => {
  it('renders authenticated workspace navigation and nested route content', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<h1>Dashboard test content</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('navigation', { name: 'Рабочая область' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Обращения' })).toHaveAttribute('href', '/tickets');
    expect(screen.queryByRole('link', { name: 'Пользователи' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard test content' })).toBeInTheDocument();
  });
});
