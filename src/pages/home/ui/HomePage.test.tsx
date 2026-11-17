// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

const mocks = vi.hoisted(() => ({ useQuery: vi.fn() }));

vi.mock('@/entities/session', () => ({
  useSession: () => ({
    user: { displayName: 'Александр', email: 'a@example.com', roles: ['ROLE_USER'] },
  }),
}));
vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }));

describe('HomePage', () => {
  beforeEach(() => {
    mocks.useQuery.mockReturnValue({
      data: { items: [], totalItems: 0 },
      isPending: false,
      isError: false,
    });
  });

  it('renders authenticated dashboard with API-driven empty state and ticket action', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Здравствуйте, Александр' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /новое обращение/i })).toHaveAttribute(
      'href',
      '/tickets/new',
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Пока нет обращений' }),
    ).toBeInTheDocument();
  });

  it('does not show zero counts when the API request fails', () => {
    mocks.useQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('API unavailable'),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Не удалось загрузить обращения' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(3);
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Пока нет обращений' }),
    ).not.toBeInTheDocument();
  });
});
