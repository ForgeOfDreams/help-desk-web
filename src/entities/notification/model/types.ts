export interface NotificationItem {
  id: string;
  ticketId?: string | null;
  type: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  createdAt?: string | null;
}
