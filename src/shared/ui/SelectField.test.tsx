// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectField } from './SelectField';

describe('SelectField', () => {
  it('renders options and accepts Bootstrap sizing', () => {
    render(
      <SelectField
        id="priority"
        label="Priority"
        size="sm"
        options={[
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
        ]}
      />,
    );

    const select = screen.getByRole('combobox', { name: 'Priority' });
    expect(select).toHaveClass('form-select-sm');
    expect(screen.getByRole('option', { name: 'High' })).toHaveValue('high');
  });
});
