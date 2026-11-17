export interface ApiCollection<T> {
  items: T[];
  totalItems: number | null;
}

/** Normalizes common API Platform Hydra and plain JSON collection responses. */
export function parseApiCollection<T>(payload: unknown): ApiCollection<T> {
  if (Array.isArray(payload)) {
    return { items: payload as T[], totalItems: payload.length };
  }

  if (typeof payload !== 'object' || payload === null) {
    return { items: [], totalItems: null };
  }

  const record = payload as Record<string, unknown>;
  const itemsCandidate = record['hydra:member'] ?? record.member ?? record.items ?? record.data;
  const items = Array.isArray(itemsCandidate) ? (itemsCandidate as T[]) : [];
  const totalCandidate = record['hydra:totalItems'] ?? record.totalItems ?? record.total;
  const totalItems =
    typeof totalCandidate === 'number' && Number.isFinite(totalCandidate) ? totalCandidate : null;

  return { items, totalItems };
}
