import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import { Link, useParams } from 'react-router';
import { useSession } from '@/entities/session';
import { createTicketComment, getTicket, getTicketComments } from '@/entities/ticket';
import type { TicketPriority, TicketStatus } from '@/entities/ticket';
import { ApiError } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Button, Callout, EmptyState, PageHeader, TextAreaField } from '@/shared/ui';

const statusLabels: Record<TicketStatus, string> = {
  new: 'Новое',
  open: 'Открыто',
  in_progress: 'В работе',
  pending: 'Ожидает ответа',
  resolved: 'Решено',
  closed: 'Закрыто',
};
const priorityLabels: Record<TicketPriority, string> = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
  urgent: 'Срочный',
};
const statusVariants: Record<
  TicketStatus,
  'primary' | 'info' | 'warning' | 'success' | 'secondary' | 'dark'
> = {
  new: 'primary',
  open: 'info',
  in_progress: 'warning',
  pending: 'secondary',
  resolved: 'success',
  closed: 'dark',
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function TicketDetailsPage() {
  const { ticketId = '' } = useParams();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState('');
  const ticketQuery = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicket(ticketId),
    enabled: Boolean(ticketId),
  });
  const commentsQuery = useQuery({
    queryKey: ['ticket-comments', ticketId],
    queryFn: () => getTicketComments(ticketId),
    enabled: Boolean(ticketId) && ticketQuery.isSuccess,
  });
  const commentMutation = useMutation({
    mutationFn: () => createTicketComment(ticketId, commentBody.trim()),
    onSuccess: async () => {
      setCommentBody('');
      await queryClient.invalidateQueries({ queryKey: ['ticket-comments', ticketId] });
    },
  });
  const ticket = ticketQuery.data;
  const canSeeInternalNotes =
    user?.roles.some((role) => role === 'ROLE_AGENT' || role === 'ROLE_ADMIN') ?? false;
  const visibleComments =
    commentsQuery.data?.filter(
      (comment) => comment.visibility === 'public' || canSeeInternalNotes,
    ) ?? [];

  if (ticketQuery.isPending)
    return (
      <div className="loading-panel" role="status">
        <Spinner animation="border" size="sm" /> Загружаем обращение…
      </div>
    );
  if (ticketQuery.isError || !ticket) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Обращение недоступно"
          description="Не удалось загрузить обращение. Возможно, оно удалено или у вас нет доступа."
          actions={
            <Link className="button button--secondary" to={ROUTES.tickets}>
              К списку
            </Link>
          }
        />
        <Callout title="Ошибка загрузки" tone="warning">
          {ticketQuery.error instanceof ApiError
            ? ticketQuery.error.message
            : 'Повторите попытку или вернитесь к списку обращений.'}
        </Callout>
        <Button variant="secondary" onClick={() => void ticketQuery.refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={ticket.ticketNumber ? `ОБРАЩЕНИЕ #${ticket.ticketNumber}` : 'ОБРАЩЕНИЕ'}
        title={ticket.subject}
        description={`Создано ${formatDate(ticket.createdAt)}${ticket.updatedAt ? ` · обновлено ${formatDate(ticket.updatedAt)}` : ''}`}
        actions={
          <Link className="button button--secondary" to={ROUTES.tickets}>
            К списку
          </Link>
        }
      />
      <section className="surface-card ticket-detail-card">
        <div className="ticket-detail-card__badges">
          <Badge bg={statusVariants[ticket.status] ?? 'secondary'}>
            {statusLabels[ticket.status] ?? ticket.status}
          </Badge>
          <span className={`priority-label priority-label--${ticket.priority}`}>
            Приоритет: {priorityLabels[ticket.priority] ?? ticket.priority}
          </span>
        </div>
        <h2>Описание</h2>
        <p className="ticket-description">{ticket.description}</p>
        <dl className="detail-list ticket-meta">
          <div>
            <dt>Автор</dt>
            <dd>{ticket.requesterName || 'Вы'}</dd>
          </div>
          <div>
            <dt>Исполнитель</dt>
            <dd>{ticket.assigneeName || 'Не назначен'}</dd>
          </div>
          <div>
            <dt>Команда</dt>
            <dd>{ticket.teamName || '—'}</dd>
          </div>
          <div>
            <dt>Категория</dt>
            <dd>{ticket.categoryName || 'Без категории'}</dd>
          </div>
        </dl>
      </section>
      <section className="surface-card" aria-labelledby="comments-heading">
        <div className="surface-card__header">
          <h2 id="comments-heading">Переписка</h2>
          <span className="muted-text">Комментарии видимые вам</span>
        </div>
        {commentsQuery.isPending ? (
          <div className="loading-panel" role="status">
            <Spinner animation="border" size="sm" /> Загружаем переписку…
          </div>
        ) : null}
        {commentsQuery.isError ? (
          <Callout title="Переписка недоступна" tone="warning">
            {commentsQuery.error instanceof ApiError
              ? commentsQuery.error.message
              : 'Не удалось загрузить комментарии.'}
          </Callout>
        ) : null}
        {visibleComments.length ? (
          <div className="comment-list">
            {visibleComments.map((comment) => (
              <article className="comment-item" key={comment.id}>
                <div className="comment-item__meta">
                  <strong>{comment.authorName || 'Пользователь'}</strong>
                  <time dateTime={comment.createdAt ?? undefined}>
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p>{comment.body}</p>
                {comment.visibility === 'internal' ? (
                  <Badge bg="warning" text="dark">
                    Внутренняя заметка
                  </Badge>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
        {!commentsQuery.isPending && !commentsQuery.isError && visibleComments.length === 0 ? (
          <EmptyState
            title="Пока нет комментариев"
            description="Добавьте уточнение или ответьте команде поддержки."
          />
        ) : null}
        <form
          className="comment-form"
          onSubmit={(event) => {
            event.preventDefault();
            commentMutation.mutate();
          }}
        >
          {commentMutation.isError ? (
            <Callout title="Не удалось отправить комментарий" tone="warning">
              {commentMutation.error instanceof ApiError
                ? commentMutation.error.message
                : 'Повторите попытку.'}
            </Callout>
          ) : null}
          <TextAreaField
            id="ticket-comment"
            label="Ваш комментарий"
            placeholder="Напишите сообщение…"
            value={commentBody}
            onChange={(event) => setCommentBody(event.currentTarget.value)}
            minLength={1}
            maxLength={20_000}
            rows={4}
            required
          />
          <div className="form-actions">
            <Button type="submit" disabled={commentMutation.isPending || !commentBody.trim()}>
              {commentMutation.isPending ? 'Отправляем…' : 'Отправить комментарий'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
