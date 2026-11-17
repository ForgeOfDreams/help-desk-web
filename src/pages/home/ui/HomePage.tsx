import { useQuery } from '@tanstack/react-query';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiInbox,
  FiPlus,
  FiRefreshCw,
} from 'react-icons/fi';
import { Link } from 'react-router';
import { useSession } from '@/entities/session';
import { getTickets } from '@/entities/ticket';
import type { TicketPriority, TicketStatus } from '@/entities/ticket';
import { ROUTES } from '@/shared/config';
import { ApiError } from '@/shared/api';
import { Button, EmptyState, PageHeader } from '@/shared/ui';

const statusLabels: Record<TicketStatus, string> = {
  new: 'Новое',
  open: 'Открыто',
  in_progress: 'В работе',
  pending: 'Ожидает ответа',
  resolved: 'Решено',
  closed: 'Закрыто',
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
const priorityLabels: Record<TicketPriority, string> = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
  urgent: 'Срочный',
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(date);
}

export function HomePage() {
  const { user } = useSession();
  const ticketsQuery = useQuery({
    queryKey: ['tickets', 'dashboard'],
    queryFn: () => getTickets({ itemsPerPage: 5 }),
  });
  const tickets = ticketsQuery.data?.items ?? [];
  const activeTickets = tickets.filter(
    (ticket) => !['resolved', 'closed'].includes(ticket.status),
  ).length;
  const resolvedTickets = tickets.filter((ticket) =>
    ['resolved', 'closed'].includes(ticket.status),
  ).length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="ЛИЧНЫЙ КАБИНЕТ"
        title={`Здравствуйте, ${user?.displayName || 'добро пожаловать'}`}
        description={
          user?.roles.some((role) => role === 'ROLE_AGENT' || role === 'ROLE_ADMIN')
            ? 'Здесь собраны последние обращения, доступные вашей роли.'
            : 'Здесь собраны ваши последние обращения и их текущее состояние.'
        }
        actions={
          <Link className="button button--primary" to={ROUTES.ticketCreate}>
            <FiPlus aria-hidden="true" /> Новое обращение
          </Link>
        }
      />
      <section aria-label="Сводка последних обращений">
        <Row className="g-3">
          <Col xs={12} md={4}>
            <Card className="metric-card metric-card--bootstrap h-100">
              <Card.Body>
                <div className="metric-card__topline">
                  <span className="metric-card__symbol">
                    <FiInbox aria-hidden="true" />
                  </span>
                  <Badge bg="light" text="secondary">
                    Всего
                  </Badge>
                </div>
                <p className="metric-card__label">Доступные обращения</p>
                <p className="metric-card__value">
                  {ticketsQuery.isPending || ticketsQuery.isError
                    ? '—'
                    : (ticketsQuery.data?.totalItems ?? tickets.length)}
                </p>
                <p className="metric-card__detail">По данным API</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="metric-card metric-card--bootstrap h-100">
              <Card.Body>
                <div className="metric-card__topline">
                  <span className="metric-card__symbol metric-card__symbol--2">
                    <FiClock aria-hidden="true" />
                  </span>
                  <Badge bg="light" text="secondary">
                    В выборке
                  </Badge>
                </div>
                <p className="metric-card__label">Активные обращения</p>
                <p className="metric-card__value">
                  {ticketsQuery.isPending || ticketsQuery.isError ? '—' : activeTickets}
                </p>
                <p className="metric-card__detail">Среди последних загруженных</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="metric-card metric-card--bootstrap h-100">
              <Card.Body>
                <div className="metric-card__topline">
                  <span className="metric-card__symbol metric-card__symbol--3">
                    <FiCheckCircle aria-hidden="true" />
                  </span>
                  <Badge bg="light" text="secondary">
                    В выборке
                  </Badge>
                </div>
                <p className="metric-card__label">Решённые обращения</p>
                <p className="metric-card__value">
                  {ticketsQuery.isPending || ticketsQuery.isError ? '—' : resolvedTickets}
                </p>
                <p className="metric-card__detail">Среди последних загруженных</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      <section className="surface-card surface-card--flush" aria-labelledby="recent-tickets-title">
        <div className="table-toolbar">
          <div>
            <h2 id="recent-tickets-title">Последние обращения</h2>
            <span>Обновления из системы поддержки</span>
          </div>
          <Link className="text-link" to={ROUTES.tickets}>
            Все обращения <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        {ticketsQuery.isPending ? (
          <div className="loading-panel" role="status">
            <Spinner animation="border" size="sm" /> Загружаем данные…
          </div>
        ) : null}
        {ticketsQuery.isError ? (
          <EmptyState
            title="Не удалось загрузить обращения"
            description={
              ticketsQuery.error instanceof ApiError
                ? ticketsQuery.error.message
                : 'Проверьте соединение с API и повторите попытку.'
            }
            icon={<FiRefreshCw aria-hidden="true" />}
          >
            <Button variant="secondary" onClick={() => void ticketsQuery.refetch()}>
              <FiRefreshCw aria-hidden="true" /> Повторить
            </Button>
          </EmptyState>
        ) : null}
        {!ticketsQuery.isPending && !ticketsQuery.isError && tickets.length === 0 ? (
          <EmptyState
            title="Пока нет обращений"
            description="Создайте первое обращение, чтобы начать работу с поддержкой."
            icon={<FiInbox aria-hidden="true" />}
          >
            <Link className="button button--primary" to={ROUTES.ticketCreate}>
              Создать обращение
            </Link>
          </EmptyState>
        ) : null}
        <div className="recent-ticket-list">
          {tickets.map((ticket) => (
            <Link to={ROUTES.ticketDetails(ticket.id)} className="recent-ticket" key={ticket.id}>
              <span className="recent-ticket__icon">
                <FiInbox aria-hidden="true" />
              </span>
              <span className="recent-ticket__main">
                <strong>{ticket.subject}</strong>
                <small>
                  #{ticket.ticketNumber || ticket.id.slice(0, 8)} ·{' '}
                  {formatDate(ticket.updatedAt ?? ticket.createdAt)}
                </small>
              </span>
              <span className="recent-ticket__status">
                <Badge bg={statusVariants[ticket.status] ?? 'secondary'}>
                  {statusLabels[ticket.status] ?? ticket.status}
                </Badge>
                <small>{priorityLabels[ticket.priority] ?? ticket.priority}</small>
              </span>
              <FiArrowUpRight className="recent-ticket__arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <p className="page-note">
        Показаны последние пять обращений. Полный список и фильтры доступны в разделе «Обращения».
      </p>
    </div>
  );
}
