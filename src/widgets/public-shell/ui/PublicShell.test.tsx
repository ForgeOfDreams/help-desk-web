// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { PublicShell } from './PublicShell';

describe('PublicShell', () => {
  it('renders a minimal public shell without exposing workspace navigation', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<PublicShell />}>
            <Route index element={<h1>Public landing</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Public landing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Help Desk — главная' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Обращения' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Профиль' })).not.toBeInTheDocument();
  });
});
