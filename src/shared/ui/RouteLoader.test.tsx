// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteLoader } from './RouteLoader';

describe('RouteLoader', () => {
  it('announces a pending route load to assistive technology', () => {
    render(<RouteLoader />);
    expect(screen.getByRole('status', { name: 'Загрузка страницы' })).toBeInTheDocument();
    expect(screen.getByText('Загружаем страницу…')).toBeInTheDocument();
  });
});
