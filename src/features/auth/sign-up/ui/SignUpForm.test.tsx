// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignUpForm } from './SignUpForm';

describe('SignUpForm', () => {
  it('submits a normalized profile draft', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Имя и фамилия'), '  Alex Doe  ');
    await user.type(screen.getByLabelText('Рабочая почта'), 'alex@example.test');
    await user.type(screen.getByLabelText('Пароль'), 'example-password');
    await user.click(screen.getByRole('button', { name: 'Создать аккаунт' }));

    expect(onSubmit).toHaveBeenCalledWith({
      displayName: 'Alex Doe',
      email: 'alex@example.test',
      password: 'example-password',
    });
  });
});
