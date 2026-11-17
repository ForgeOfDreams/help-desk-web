import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/shared/api';
import { clearActionTokenFromUrl, readActionTokenFromUrl } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { Button, Callout, PageHeader, TextField } from '@/shared/ui';

interface AuthActionResult {
  message?: string;
}

export function SetPasswordPage() {
  const [token] = useState(() => readActionTokenFromUrl());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    clearActionTokenFromUrl();
  }, []);

  const mutation = useMutation({
    mutationFn: () =>
      apiRequest<AuthActionResult>('/auth/set-password', {
        method: 'POST',
        body: { token, newPassword },
      }),
    onSuccess: (result) => {
      setNewPassword('');
      setConfirmPassword('');
      setValidationError('');
      setSuccessMessage(result?.message || 'Пароль установлен. Теперь можно войти в систему.');
    },
  });

  const tokenLooksValid = /^[a-f0-9]{64}$/.test(token);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError('');
    if (newPassword !== confirmPassword) {
      setValidationError('Пароли не совпадают. Проверьте оба поля.');
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">ЗАВЕРШЕНИЕ ПРИГЛАШЕНИЯ</p>
        <PageHeader
          title="Установите пароль"
          description="Создайте пароль, чтобы активировать доступ к порталу поддержки."
        />
      </div>
      <section className="surface-card auth-card" aria-label="Установка пароля">
        {successMessage ? (
          <Callout title="Пароль установлен" tone="success">
            {successMessage}
          </Callout>
        ) : null}
        {!successMessage && !tokenLooksValid ? (
          <Callout title="Ссылка недействительна" tone="warning">
            Откройте полную ссылку из приглашения или запросите новое приглашение у администратора.
          </Callout>
        ) : null}
        {!successMessage && tokenLooksValid ? (
          <form className="form-stack" onSubmit={handleSubmit}>
            <TextField
              id="initial-password"
              label="Новый пароль"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
              minLength={12}
              maxLength={1024}
              hint="Не менее 12 символов."
              required
            />
            <TextField
              id="initial-password-confirm"
              label="Повторите пароль"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              minLength={12}
              maxLength={1024}
              required
            />
            {validationError ? (
              <Callout title="Проверьте пароль" tone="warning">
                {validationError}
              </Callout>
            ) : null}
            {mutation.isError ? (
              <Callout title="Не удалось установить пароль" tone="warning">
                Не удалось установить пароль. Ссылка могла истечь; запросите новое приглашение.
              </Callout>
            ) : null}
            <Button type="submit" fullWidth disabled={mutation.isPending}>
              {mutation.isPending ? 'Сохраняем…' : 'Установить пароль'}
            </Button>
          </form>
        ) : null}
        <p className="form-footnote">
          <Link to={ROUTES.login}>Перейти ко входу</Link>
        </p>
      </section>
    </div>
  );
}
