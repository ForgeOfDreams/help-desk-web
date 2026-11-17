import { apiRequest, parseApiCollection } from '@/shared/api';
import type { ApiCollection } from '@/shared/api';
import type { NotificationItem } from '../model/types';

export async function getNotifications(
  unreadOnly = false,
): Promise<ApiCollection<NotificationItem>> {
  const query = new URLSearchParams({ itemsPerPage: '100' });
  if (unreadOnly) query.set('unread', 'true');
  return parseApiCollection<NotificationItem>(
    await apiRequest<unknown>(`/notifications?${query.toString()}`),
  );
}

export function markNotificationRead(id: string): Promise<NotificationItem | undefined> {
  return apiRequest<NotificationItem | undefined>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'POST',
  });
}
