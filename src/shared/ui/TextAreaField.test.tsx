// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  it('renders a labelled textarea with its initial value', () => {
    render(<TextAreaField id="description" label="Description" defaultValue="Details" size="lg" />);

    const textarea = screen.getByRole('textbox', { name: 'Description' });
    expect(textarea).toHaveValue('Details');
    expect(textarea).toHaveClass('form-control-lg');
  });
});
