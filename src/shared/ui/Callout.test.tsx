// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders a warning as an accessible alert', () => {
    render(
      <Callout title="Action required" tone="warning">
        Authentication is not connected.
      </Callout>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Action required');
    expect(screen.getByRole('alert')).toHaveTextContent('Authentication is not connected.');
    expect(screen.getByRole('alert')).toHaveClass('alert', 'alert-warning', 'callout--warning');
  });
});
