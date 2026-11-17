import { useState } from 'react';
import { Link } from 'react-router';
import type { SignUpData } from '@/features/auth/sign-up';
import { SignUpForm } from '@/features/auth/sign-up';
import { apiRequest } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Callout, PageHeader } from '@/shared/ui';

interface AuthActionResult {
  message?: string;
}

export function RegisterPage() {
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(data: SignUpData) {
    setNotice('');
    setError('');
    setSubmitting(true);
    try {
      const response = await apiRequest<AuthActionResult>('/auth/register', {
        method: 'POST',
        body: data,
      });
      setNotice(
        response?.message ||
          'Если этот адрес можно зарегистрировать, на него будет отправлена инструкция для подтверждения почты.',
      );
    } catch {
      setError('Не удалось отправить запрос. Проверьте соединение и повторите попытку.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">НОВЫЙ АККАУНТ</p>
        <PageHeader
          title="Создать аккаунт"
          description="После регистрации подтвердите рабочую почту по ссылке из письма."
        />
      </div>
      <section className="surface-card auth-card" aria-label="Форма регистрации">
        {error ? (
          <Callout title="Регистрация не завершена" tone="warning">
            {error}
          </Callout>
        ) : null}
        {notice ? (
          <Callout title="Проверьте почту" tone="success">
            {notice}
          </Callout>
        ) : (
          <SignUpForm onSubmit={handleSubmit} submitting={submitting} />
        )}
        <p className="form-footnote">
          Уже есть аккаунт? <Link to={ROUTES.login}>Войти</Link>
        </p>
      </section>
    </div>
  );
}
