// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders a labelled input and accepts Bootstrap sizing', () => {
    render(<TextField id="email" label="Email" type="email" size="lg" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveClass('form-control-lg');
  });
});
