import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/shared/api';
import { clearActionTokenFromUrl, readActionTokenFromUrl } from '@/shared/lib';
import { ROUTES } from '@/shared/config';
import { Button, Callout, PageHeader, TextField } from '@/shared/ui';

interface AuthActionResult {
  message?: string;
}

export function VerifyEmailPage() {
  const [token] = useState(() => readActionTokenFromUrl());
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    clearActionTokenFromUrl();
  }, []);

  const verifyMutation = useMutation({
    mutationFn: () =>
      apiRequest<AuthActionResult>('/auth/verify-email', { method: 'POST', body: { token } }),
    onSuccess: () => setConfirmed(true),
  });
  const resendMutation = useMutation({
    mutationFn: () =>
      apiRequest<AuthActionResult>('/auth/resend-verification', {
        method: 'POST',
        body: { email: email.trim() },
      }),
    onSuccess: (result) => {
      setResendError('');
      setResendMessage(
        result?.message ||
          'Если для этого адреса доступно подтверждение, инструкция будет отправлена.',
      );
    },
    onError: () => {
      setResendError('Не удалось отправить запрос. Повторите попытку позже.');
    },
  });
  const tokenLooksValid = /^[a-f0-9]{64}$/.test(token);

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">ПОДТВЕРЖДЕНИЕ ПОЧТЫ</p>
        <PageHeader
          title="Подтвердите адрес"
          description="Подтверждение необходимо, чтобы активировать учётную запись."
        />
      </div>
      <section className="surface-card auth-card" aria-label="Подтверждение электронной почты">
        {confirmed ? (
          <Callout title="Адрес подтверждён" tone="success">
            Теперь можно войти в систему.
          </Callout>
        ) : null}
        {!confirmed && token ? (
          <div className="form-stack">
            {tokenLooksValid ? (
              <>
                <p className="auth-copy">Подтвердите адрес, чтобы завершить активацию.</p>
                {verifyMutation.isError ? (
                  <Callout title="Не удалось подтвердить адрес" tone="warning">
                    Ссылка недействительна или устарела. Запросите новое письмо, если это
                    необходимо.
                  </Callout>
                ) : null}
                <Button
                  type="button"
                  fullWidth
                  disabled={verifyMutation.isPending}
                  onClick={() => verifyMutation.mutate()}
                >
                  {verifyMutation.isPending ? 'Подтверждаем…' : 'Подтвердить почту'}
                </Button>
              </>
            ) : (
              <Callout title="Ссылка некорректна" tone="warning">
                Токен имеет неверный формат. Запросите новое письмо ниже.
              </Callout>
            )}
          </div>
        ) : null}
        {!confirmed && !token ? (
          <Callout title="Нужна ссылка из письма" tone="info">
            Откройте ссылку подтверждения из письма или запросите инструкцию повторно.
          </Callout>
        ) : null}
        {!confirmed ? (
          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              resendMutation.mutate();
            }}
          >
            <TextField
              id="verification-email"
              label="Рабочая почта"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
            />
            {resendError ? (
              <Callout title="Не удалось отправить письмо" tone="warning">
                {resendError}
              </Callout>
            ) : null}
            {resendMessage ? (
              <Callout title="Запрос обработан" tone="success">
                {resendMessage}
              </Callout>
            ) : null}
            <Button type="submit" variant="secondary" fullWidth disabled={resendMutation.isPending}>
              {resendMutation.isPending ? 'Отправляем…' : 'Отправить инструкцию повторно'}
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
