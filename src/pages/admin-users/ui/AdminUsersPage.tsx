import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, ApiError } from '@/shared/api';
import { Button, Callout, PageHeader, SelectField, TextField } from '@/shared/ui';

interface ManagedUserResult {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

export function AdminUsersPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ROLE_USER' | 'ROLE_AGENT'>('ROLE_AGENT');
  const [createdUser, setCreatedUser] = useState<ManagedUserResult | null>(null);
  const inviteMutation = useMutation({
    mutationFn: () =>
      apiRequest<ManagedUserResult>('/admin/users', {
        method: 'POST',
        body: { displayName: displayName.trim(), email: email.trim(), role },
      }),
    onSuccess: (user) => {
      setCreatedUser(user);
      setDisplayName('');
      setEmail('');
      setRole('ROLE_AGENT');
    },
  });

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader
        eyebrow="АДМИНИСТРИРОВАНИЕ"
        title="Пригласить пользователя"
        description="Создайте учётную запись и отправьте инструкцию для установки пароля."
      />
      <section className="surface-card form-card">
        <p className="section-description">
          Доступны роли обычного пользователя и сотрудника поддержки. Роль администратора
          назначается только доверенной административной процедурой.
        </p>
        {inviteMutation.isError ? (
          <Callout title="Не удалось создать приглашение" tone="warning">
            {inviteMutation.error instanceof ApiError
              ? inviteMutation.error.message
              : 'Проверьте данные и подключение к API.'}
          </Callout>
        ) : null}
        {createdUser ? (
          <Callout title="Пользователь создан" tone="success">
            Приглашение подготовлено для {createdUser.email}. Письмо отправляется сервером.
          </Callout>
        ) : null}
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            setCreatedUser(null);
            inviteMutation.mutate();
          }}
        >
          <TextField
            id="managed-user-name"
            label="Имя и фамилия"
            autoComplete="name"
            value={displayName}
            onChange={(event) => setDisplayName(event.currentTarget.value)}
            minLength={2}
            maxLength={150}
            required
          />
          <TextField
            id="managed-user-email"
            label="Рабочая почта"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            maxLength={254}
            required
          />
          <SelectField
            id="managed-user-role"
            label="Роль"
            value={role}
            onChange={(event) => setRole(event.currentTarget.value as typeof role)}
            options={[
              { value: 'ROLE_USER', label: 'Пользователь' },
              { value: 'ROLE_AGENT', label: 'Сотрудник поддержки' },
            ]}
            required
          />
          <div className="form-actions">
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? 'Создаём…' : 'Создать и пригласить'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
