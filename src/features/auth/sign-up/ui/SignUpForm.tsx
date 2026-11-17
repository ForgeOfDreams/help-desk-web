import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, TextField } from '@/shared/ui';

import type { SignUpData } from '../model/types';

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => void;
  submitting?: boolean;
}

export function SignUpForm({ onSubmit, submitting = false }: SignUpFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ displayName: displayName.trim(), email: email.trim(), password });
    setPassword('');
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <TextField
        id="sign-up-name"
        label="Имя и фамилия"
        name="displayName"
        autoComplete="name"
        placeholder="Александр Иванов"
        value={displayName}
        onChange={(event) => setDisplayName(event.currentTarget.value)}
        required
        minLength={2}
        maxLength={150}
      />
      <TextField
        id="sign-up-email"
        label="Рабочая почта"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        maxLength={254}
        required
      />
      <TextField
        id="sign-up-password"
        label="Пароль"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Не менее 12 символов"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
        minLength={12}
        maxLength={1024}
      />
      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? 'Отправляем…' : 'Создать аккаунт'}
      </Button>
    </form>
  );
}
