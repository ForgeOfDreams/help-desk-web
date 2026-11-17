import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, TextField } from '@/shared/ui';

import type { SignInCredentials } from '../model/types';

interface SignInFormProps {
  onSubmit: (credentials: SignInCredentials) => void;
  submitting?: boolean;
}

export function SignInForm({ onSubmit, submitting = false }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ email: email.trim(), password });
    setPassword('');
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <TextField
        id="sign-in-email"
        label="Рабочая почта"
        name="email"
        type="email"
        autoComplete="username"
        placeholder="you@company.com"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        required
      />
      <TextField
        id="sign-in-password"
        label="Пароль"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Введите пароль"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
      />
      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? 'Проверяем…' : 'Войти'}
      </Button>
    </form>
  );
}
