// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TicketsPage } from './TicketsPage';

const mocks = vi.hoisted(() => ({ useQuery: vi.fn(), refetch: vi.fn() }));

vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }));
vi.mock('@/entities/ticket', () => ({ getTickets: vi.fn() }));

describe('TicketsPage API error state', () => {
  beforeEach(() => {
    mocks.refetch.mockReset();
    mocks.useQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('API unavailable'),
      refetch: mocks.refetch,
    });
  });

  it('shows an error and retry action instead of a false empty state', () => {
    render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Не удалось загрузить обращения' }),
    ).toBeInTheDocument();
    expect(screen.getByText('API unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Обращений пока нет' })).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /повторить/i }));
    expect(mocks.refetch).toHaveBeenCalledTimes(1);
  });
});
