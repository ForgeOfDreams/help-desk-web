// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignInForm } from './SignInForm';

describe('SignInForm', () => {
  it('submits credentials and clears the password field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignInForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Рабочая почта'), 'agent@example.test');
    await user.type(screen.getByLabelText('Пароль'), 'example-password');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'agent@example.test',
      password: 'example-password',
    });
    expect(screen.getByLabelText('Пароль')).toHaveValue('');
  });
});
