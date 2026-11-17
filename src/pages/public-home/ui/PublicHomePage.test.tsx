// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { PublicHomePage } from './PublicHomePage';

vi.mock('@/entities/session', () => ({ useSession: () => ({ isAuthenticated: false }) }));

describe('PublicHomePage', () => {
  it('shows only public entry points and a short product description', () => {
    render(
      <MemoryRouter>
        <PublicHomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /портал поддержки/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /войти в систему/i })).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.getByRole('link', { name: /создать аккаунт/i })).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.queryByText(/последние обращения/i)).not.toBeInTheDocument();
  });
});
