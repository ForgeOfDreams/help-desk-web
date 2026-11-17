import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router';
import { getTickets } from '@/entities/ticket';
import type { Ticket, TicketPriority, TicketStatus } from '@/entities/ticket';
import type { TicketFilterValues } from '@/features/tickets/filter';
import { TicketFilters } from '@/features/tickets/filter';
import { ROUTES } from '@/shared/config';
import { ApiError } from '@/shared/api';
import { Button, EmptyState, PageHeader } from '@/shared/ui';

const initialFilters: TicketFilterValues = { query: '', status: 'all', priority: 'all' };
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

export function TicketsPage() {
  const [filters, setFilters] = useState<TicketFilterValues>(initialFilters);
  const ticketsQuery = useQuery({
    queryKey: ['tickets', { status: filters.status, priority: filters.priority }],
    queryFn: () =>
      getTickets({ status: filters.status, priority: filters.priority, itemsPerPage: 100 }),
  });
  const tickets = ticketsQuery.data?.items ?? [];
  const filteredTickets = useMemo(() => {
    const term = filters.query.trim().toLocaleLowerCase();
    if (!term) return tickets;
    return tickets.filter((ticket) =>
      `${ticket.ticketNumber ?? ''} ${ticket.subject}`.toLocaleLowerCase().includes(term),
    );
  }, [filters.query, tickets]);
  const activeFilters =
    filters.query.trim().length > 0 || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="РАБОЧАЯ ОБЛАСТЬ"
        title="Обращения"
        description="Все доступные вам обращения, их статусы и приоритеты."
        actions={
          <Link className="button button--primary" to={ROUTES.ticketCreate}>
            <FiPlus aria-hidden="true" /> Новое обращение
          </Link>
        }
      />
      <TicketFilters value={filters} onChange={setFilters} />
      {activeFilters && !ticketsQuery.isError ? (
        <div className="filter-summary" role="status">
          <span>Показано: {filteredTickets.length}</span>
          <Button
            type="button"
            variant="ghost"
            className="text-button"
            onClick={() => setFilters(initialFilters)}
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : null}
      <section
        className="surface-card surface-card--flush ticket-list"
        aria-labelledby="ticket-list-title"
      >
        <div className="table-toolbar">
          <div>
            <h2 id="ticket-list-title">Доступные обращения</h2>
            <span>Последние изменения отображаются первыми</span>
          </div>
          <Badge bg="light" text="dark" className="table-toolbar__count">
            {ticketsQuery.isError ? '—' : (ticketsQuery.data?.totalItems ?? tickets.length)}
          </Badge>
        </div>
        {ticketsQuery.isPending ? (
          <div className="loading-panel" role="status">
            <Spinner animation="border" size="sm" />
            <span>Загружаем обращения…</span>
          </div>
        ) : ticketsQuery.isError ? (
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
        ) : filteredTickets.length === 0 ? (
          <EmptyState
            title={activeFilters ? 'Ничего не найдено' : 'Обращений пока нет'}
            description={
              activeFilters
                ? 'Попробуйте изменить фильтры поиска.'
                : 'Создайте обращение, и здесь появится его статус и история.'
            }
            icon={<FiSearch aria-hidden="true" />}
          >
            {activeFilters ? (
              <Button variant="secondary" onClick={() => setFilters(initialFilters)}>
                Сбросить фильтры
              </Button>
            ) : (
              <Link className="button button--primary" to={ROUTES.ticketCreate}>
                Создать обращение
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="table-responsive">
            <Table
              hover
              responsive={false}
              className="ticket-table mb-0"
              aria-label="Список обращений"
            >
              <thead>
                <tr>
                  <th>Обращение</th>
                  <th>Статус</th>
                  <th>Приоритет</th>
                  <th>Обновлено</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket: Ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Link className="ticket-table__subject" to={ROUTES.ticketDetails(ticket.id)}>
                        {ticket.subject}
                      </Link>
                      <span className="ticket-table__number">
                        {ticket.ticketNumber ? `#${ticket.ticketNumber}` : ticket.id.slice(0, 8)}
                      </span>
                    </td>
                    <td>
                      <Badge bg={statusVariants[ticket.status] ?? 'secondary'}>
                        {statusLabels[ticket.status] ?? ticket.status}
                      </Badge>
                    </td>
                    <td>
                      <span className={`priority-label priority-label--${ticket.priority}`}>
                        {priorityLabels[ticket.priority] ?? ticket.priority}
                      </span>
                    </td>
                    <td className="ticket-table__date">
                      {formatDate(ticket.updatedAt ?? ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
