// @vitest-environment jsdom
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TicketFilters } from './TicketFilters';
import type { TicketFilterValues } from '../model/types';

function ControlledTicketFilters() {
  const [value, setValue] = useState<TicketFilterValues>({
    query: '',
    status: 'all',
    priority: 'all',
  });

  return <TicketFilters value={value} onChange={setValue} />;
}

describe('TicketFilters', () => {
  it('updates the controlled query field', async () => {
    const user = userEvent.setup();
    render(<ControlledTicketFilters />);

    await user.type(screen.getByLabelText('Поиск'), 'VPN');
    expect(screen.getByLabelText('Поиск')).toHaveValue('VPN');
  });
});
