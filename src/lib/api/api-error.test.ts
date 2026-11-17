import { describe, expect, it } from 'vitest';
import { getApiErrorMessage } from './api-error';

describe('getApiErrorMessage', () => {
  it('returns a non-empty string payload', () => {
    expect(getApiErrorMessage('Request rejected', 'Fallback')).toBe('Request rejected');
  });

  it('prefers the detail field from a problem response', () => {
    expect(
      getApiErrorMessage(
        { detail: 'Email is already used', 'hydra:description': 'Generic error' },
        'Fallback',
      ),
    ).toBe('Email is already used');
  });

  it('supports Hydra error descriptions', () => {
    expect(getApiErrorMessage({ 'hydra:description': 'Access denied' }, 'Fallback')).toBe(
      'Access denied',
    );
  });

  it('uses message and title fields as fallbacks', () => {
    expect(getApiErrorMessage({ message: 'Custom message' }, 'Fallback')).toBe('Custom message');
    expect(getApiErrorMessage({ title: 'Validation failed' }, 'Fallback')).toBe(
      'Validation failed',
    );
  });

  it('uses the supplied fallback for unknown payloads', () => {
    expect(getApiErrorMessage({ code: 'UNKNOWN' }, 'Something went wrong')).toBe(
      'Something went wrong',
    );
    expect(getApiErrorMessage(null, 'Something went wrong')).toBe('Something went wrong');
  });
});
