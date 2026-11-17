import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router';
import { useSession } from '@/entities/session';
import { apiRequest, ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Button, Callout, PageHeader, TextField } from '@/shared/ui';

interface ActionResult {
  message?: string;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(date);
}

export function ProfilePage() {
  const { user } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const passwordMutation = useMutation({
    mutationFn: () =>
      apiRequest<ActionResult>('/me/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
    onSuccess: (result) => {
      setCurrentPassword('');
      setNewPassword('');
      setSuccess(result?.message || 'Пароль успешно изменён.');
    },
    onError: () => setSuccess(''),
  });

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader
        eyebrow="УЧЁТНАЯ ЗАПИСЬ"
        title="Профиль"
        description="Данные вашей учётной записи и безопасность доступа."
      />
      <section className="surface-card">
        <div className="profile-summary">
          <div className="profile-summary__avatar" aria-hidden="true">
            {(user?.displayName || user?.email || 'U').slice(0, 1).toLocaleUpperCase()}
          </div>
          <div>
            <h2>{user?.displayName || 'Пользователь'}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        <dl className="detail-list profile-meta">
          <div>
            <dt>Роли</dt>
            <dd>{user?.roles.join(', ') || '—'}</dd>
          </div>
          <div>
            <dt>Дата создания</dt>
            <dd>{formatDate(user?.createdAt)}</dd>
          </div>
        </dl>
      </section>
      <section className="surface-card form-card">
        <div>
          <p className="eyebrow">БЕЗОПАСНОСТЬ</p>
          <h2>Изменить пароль</h2>
          <p className="section-description">
            Используйте не менее 12 символов. После изменения текущий JWT остаётся активным до
            истечения срока действия.
          </p>
        </div>
        {passwordMutation.isError ? (
          <Callout title="Не удалось изменить пароль" tone="warning">
            {passwordMutation.error instanceof ApiError
              ? passwordMutation.error.message
              : 'Проверьте текущий пароль и повторите попытку.'}
          </Callout>
        ) : null}
        {success ? (
          <Callout title="Готово" tone="success">
            {success}
          </Callout>
        ) : null}
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            setSuccess('');
            passwordMutation.mutate();
          }}
        >
          <TextField
            id="current-password"
            label="Текущий пароль"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.currentTarget.value)}
            maxLength={1024}
            required
          />
          <TextField
            id="new-password"
            label="Новый пароль"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.currentTarget.value)}
            minLength={12}
            maxLength={1024}
            required
          />
          <div className="form-actions">
            <Button type="submit" disabled={passwordMutation.isPending}>
              {passwordMutation.isPending ? 'Сохраняем…' : 'Изменить пароль'}
            </Button>
          </div>
        </form>
        <p className="form-footnote">
          <Link to={ROUTES.dashboard}>Вернуться в кабинет</Link>
        </p>
      </section>
    </div>
  );
}
