// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CreateTicketForm } from './CreateTicketForm';

describe('CreateTicketForm', () => {
  it('submits the trimmed ticket content and selected priority', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateTicketForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Тема обращения'), ' VPN issue ');
    await user.type(
      screen.getByLabelText('Описание проблемы'),
      ' Cannot connect to the company VPN. ',
    );
    await user.selectOptions(screen.getByLabelText('Приоритет'), 'high');
    await user.click(screen.getByRole('button', { name: 'Подготовить обращение' }));

    expect(onSubmit).toHaveBeenCalledWith({
      subject: 'VPN issue',
      description: 'Cannot connect to the company VPN.',
      priority: 'high',
    });
  });
});
