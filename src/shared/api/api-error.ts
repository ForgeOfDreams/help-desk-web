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
  for (const key of ['detail', 'description', 'message', 'hydra:description', 'title']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  const violations = record.violations;
  if (Array.isArray(violations)) {
    const firstViolation = violations.find(
      (item): item is { message: string; propertyPath?: string } =>
        typeof item === 'object' &&
        item !== null &&
        'message' in item &&
        typeof item.message === 'string',
    );
    if (firstViolation) {
      return firstViolation.propertyPath
        ? `${firstViolation.propertyPath}: ${firstViolation.message}`
        : firstViolation.message;
    }
  }

  return fallback;
}
