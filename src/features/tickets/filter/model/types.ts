import type { TicketPriority, TicketStatus } from '@/entities/ticket';

export interface TicketFilterValues {
  query: string;
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
}
