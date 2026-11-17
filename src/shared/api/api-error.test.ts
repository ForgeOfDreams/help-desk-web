import { describe, expect, it } from 'vitest';
import { ApiError, getApiErrorMessage } from './index';

describe('ApiError', () => {
  it('retains HTTP status and payload', () => {
    const payload = { detail: 'Forbidden' };
    const error = new ApiError(403, payload, 'Forbidden');
    expect(error).toMatchObject({ status: 403, payload, message: 'Forbidden', name: 'ApiError' });
  });
});

describe('getApiErrorMessage', () => {
  it('extracts API Platform error details', () => {
    expect(getApiErrorMessage({ detail: 'Invalid value' }, 'Fallback')).toBe('Invalid value');
  });

  it('returns fallback for an unknown payload', () => {
    expect(getApiErrorMessage({ code: 'E_UNKNOWN' }, 'Fallback')).toBe('Fallback');
  });
});
