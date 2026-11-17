import { apiRequest, parseApiCollection } from '@/shared/api';
import type { ApiCollection } from '@/shared/api';
import type {
  CreateTicketInput,
  Ticket,
  TicketCategory,
  TicketComment,
  TicketPriority,
  TicketStatus,
} from '../model/types';

interface TicketListOptions {
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  itemsPerPage?: number;
}

export async function getTickets(options: TicketListOptions = {}): Promise<ApiCollection<Ticket>> {
  const query = new URLSearchParams({ itemsPerPage: String(options.itemsPerPage ?? 100) });
  if (options.status && options.status !== 'all') query.set('status', options.status);
  if (options.priority && options.priority !== 'all') query.set('priority', options.priority);
  return parseApiCollection<Ticket>(await apiRequest<unknown>(`/tickets?${query.toString()}`));
}

export function getTicket(ticketId: string): Promise<Ticket> {
  return apiRequest<Ticket>(`/tickets/${encodeURIComponent(ticketId)}`);
}

export async function getTicketCategories(): Promise<TicketCategory[]> {
  const collection = parseApiCollection<TicketCategory>(
    await apiRequest<unknown>('/ticket-categories'),
  );
  return collection.items.filter((category) => category.isActive !== false);
}

export async function getTicketComments(ticketId: string): Promise<TicketComment[]> {
  const collection = parseApiCollection<TicketComment>(
    await apiRequest<unknown>(`/tickets/${encodeURIComponent(ticketId)}/comments?itemsPerPage=100`),
  );
  return collection.items;
}

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiRequest<Ticket>('/tickets', { method: 'POST', body: input });
}

export function createTicketComment(ticketId: string, body: string): Promise<TicketComment> {
  return apiRequest<TicketComment>(`/tickets/${encodeURIComponent(ticketId)}/comments`, {
    method: 'POST',
    body: { body, visibility: 'public' },
  });
}
