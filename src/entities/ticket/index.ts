export {
  createTicket,
  createTicketComment,
  getTicket,
  getTicketCategories,
  getTicketComments,
  getTickets,
} from './api/ticket-api';
export type {
  CreateTicketInput,
  Ticket,
  TicketCategory,
  TicketComment,
  TicketPriority,
  TicketStatus,
} from './model/types';
