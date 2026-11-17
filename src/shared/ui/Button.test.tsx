// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('uses React Bootstrap variants while preserving the application button API', () => {
    render(
      <Button variant="secondary" fullWidth>
        Cancel
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
      'btn',
      'btn-outline-secondary',
      'button--secondary',
      'button--full-width',
    );
  });

  it('preserves the disabled state for pending actions', () => {
    render(<Button disabled>Submitting</Button>);

    expect(screen.getByRole('button', { name: 'Submitting' })).toBeDisabled();
  });
});
