export class ApiError extends Error {
  public readonly status: number;
  public readonly payload: unknown;

  constructor(status: number, payload: unknown, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (typeof payload !== 'object' || payload === null) {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  for (const key of ['detail', 'description', 'message', 'hydra:description']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return fallback;
}
