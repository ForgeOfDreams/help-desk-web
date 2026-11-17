import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { createTicket, getTicketCategories } from '@/entities/ticket';
import type { CreateTicketInput } from '@/entities/ticket';
import { CreateTicketForm } from '@/features/tickets/create';
import { ROUTES } from '@/shared/config';
import { ApiError } from '@/shared/api';
import { Callout, PageHeader } from '@/shared/ui';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ['ticket-categories'],
    queryFn: getTicketCategories,
  });
  const createMutation = useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: async (ticket) => {
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
      navigate(ticket?.id ? ROUTES.ticketDetails(ticket.id) : ROUTES.tickets);
    },
  });

  function handleSubmit(input: CreateTicketInput) {
    createMutation.mutate(input);
  }

  return (
    <div className="page-stack page-stack--narrow">
      <PageHeader
        eyebrow="НОВОЕ ОБРАЩЕНИЕ"
        title="Опишите проблему"
        description="Укажите тему и подробности — служба поддержки получит обращение и назначит приоритет обработки."
      />
      <section className="surface-card form-card">
        {createMutation.isError ? (
          <Callout title="Не удалось создать обращение" tone="warning">
            {createMutation.error instanceof ApiError
              ? createMutation.error.message
              : 'Проверьте соединение с API и повторите попытку.'}
          </Callout>
        ) : null}
        {categoriesQuery.isError ? (
          <Callout title="Категории недоступны" tone="info">
            Сейчас можно создать обращение без категории.
          </Callout>
        ) : null}
        <CreateTicketForm
          categories={categoriesQuery.data ?? []}
          onSubmit={handleSubmit}
          submitting={createMutation.isPending}
        />
        <p className="form-footnote">
          <Link to={ROUTES.tickets}>Вернуться к обращениям</Link>
        </p>
      </section>
    </div>
  );
}
