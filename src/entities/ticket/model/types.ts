export type TicketStatus = 'new' | 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  ticketNumber?: string | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterId?: string | null;
  requesterName?: string | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
  teamName?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  resolvedAt?: string | null;
  version?: number;
}

export interface TicketCategory {
  id: string;
  name: string;
  code?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId?: string | null;
  authorName?: string | null;
  body: string;
  visibility: 'public' | 'internal';
  createdAt?: string | null;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  priority: TicketPriority;
  categoryId?: string | null;
}
