import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSession } from '@/entities/session';
import { SignInForm } from '@/features/auth/sign-in';
import { ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Callout, PageHeader } from '@/shared/ui';
import type { SignInCredentials } from '@/features/auth/sign-in';

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const state = location.state as LoginLocationState | null;

  async function handleSubmit(credentials: SignInCredentials) {
    setError('');
    setSubmitting(true);
    try {
      await signIn(credentials);
      const destination =
        typeof state?.from === 'string' &&
        state.from.startsWith('/') &&
        !state.from.startsWith('//')
          ? state.from
          : ROUTES.dashboard;
      navigate(destination, { replace: true });
    } catch (cause) {
      setError(
        cause instanceof ApiError && cause.status === 401
          ? 'Неверная почта или пароль.'
          : 'Не удалось войти. Проверьте соединение и повторите попытку.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">ДОСТУП К АККАУНТУ</p>
        <PageHeader
          title="С возвращением"
          description="Войдите, чтобы открыть свои обращения и сообщения службы поддержки."
        />
      </div>
      <section className="surface-card auth-card" aria-label="Форма входа">
        {error ? (
          <Callout title="Не удалось войти" tone="warning">
            {error}
          </Callout>
        ) : null}
        <SignInForm onSubmit={handleSubmit} submitting={submitting} />
        <p className="form-footnote">
          Нет аккаунта? <Link to={ROUTES.register}>Зарегистрироваться</Link>
        </p>
      </section>
    </div>
  );
}
