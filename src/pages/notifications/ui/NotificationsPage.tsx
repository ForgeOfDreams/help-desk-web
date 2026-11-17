import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import { FiBell, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router';
import { getNotifications, markNotificationRead } from '@/entities/notification';
import { ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Button, Callout, EmptyState, PageHeader } from '@/shared/ui';

function notificationTitle(type: string): string {
  const labels: Record<string, string> = {
    ticket_created: 'Обращение создано',
    ticket_status_changed: 'Изменился статус обращения',
    ticket_assigned: 'Назначен исполнитель',
    ticket_comment_added: 'Новый комментарий',
    ticket_resolved: 'Обращение решено',
  };
  return labels[type] ?? 'Уведомление службы поддержки';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = notificationsQuery.isError
    ? null
    : notifications.filter((item) => !item.isRead).length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="ЦЕНТР УВЕДОМЛЕНИЙ"
        title="Уведомления"
        description="Изменения статусов и сообщения по вашим обращениям."
      />
      {markReadMutation.isError ? (
        <Callout title="Не удалось отметить уведомление" tone="warning">
          {markReadMutation.error instanceof ApiError
            ? markReadMutation.error.message
            : 'Повторите попытку.'}
        </Callout>
      ) : null}
      <section className="surface-card surface-card--flush">
        <div className="table-toolbar">
          <div>
            <h2>Последние события</h2>
            <span>Непрочитанных: {unreadCount ?? '—'}</span>
          </div>
          <Badge bg={unreadCount ? 'primary' : 'light'} text={unreadCount ? undefined : 'dark'}>
            {unreadCount ?? '—'}
          </Badge>
        </div>
        {notificationsQuery.isPending ? (
          <div className="loading-panel" role="status">
            <Spinner animation="border" size="sm" /> Загружаем уведомления…
          </div>
        ) : null}
        {notificationsQuery.isError ? (
          <EmptyState
            title="Не удалось загрузить уведомления"
            description={
              notificationsQuery.error instanceof ApiError
                ? notificationsQuery.error.message
                : 'Проверьте соединение с API и повторите попытку.'
            }
            icon={<FiRefreshCw aria-hidden="true" />}
          >
            <Button variant="secondary" onClick={() => void notificationsQuery.refetch()}>
              <FiRefreshCw aria-hidden="true" /> Повторить
            </Button>
          </EmptyState>
        ) : null}
        {!notificationsQuery.isPending &&
        !notificationsQuery.isError &&
        notifications.length === 0 ? (
          <EmptyState
            title="Новых событий нет"
            description="Здесь появятся уведомления по вашим обращениям."
            icon={<FiBell aria-hidden="true" />}
          />
        ) : null}
        <div className="notification-list">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`notification-item${notification.isRead ? '' : ' notification-item--unread'}`}
            >
              <span className="notification-item__icon" aria-hidden="true">
                <FiBell />
              </span>
              <div className="notification-item__content">
                <div className="notification-item__title">
                  <strong>{notificationTitle(notification.type)}</strong>
                  {!notification.isRead ? <Badge bg="primary">Новое</Badge> : null}
                </div>
                <p>
                  {typeof notification.payload.message === 'string'
                    ? notification.payload.message
                    : 'Откройте связанное обращение, чтобы посмотреть подробности.'}
                </p>
                <div className="notification-item__meta">
                  <time dateTime={notification.createdAt ?? undefined}>
                    {formatDate(notification.createdAt)}
                  </time>
                  {notification.ticketId ? (
                    <Link to={ROUTES.ticketDetails(notification.ticketId)}>Открыть обращение</Link>
                  ) : null}
                </div>
              </div>
              {!notification.isRead ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Отметить прочитанным"
                  onClick={() => markReadMutation.mutate(notification.id)}
                  disabled={markReadMutation.isPending}
                >
                  <FiCheck aria-hidden="true" />
                </Button>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
