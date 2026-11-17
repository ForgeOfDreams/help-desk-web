import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from './api-url';

describe('resolveApiUrl', () => {
  it('joins a relative API base and path', () => {
    expect(resolveApiUrl('/auth/login', '/api')).toBe('/api/auth/login');
  });

  it('normalizes trailing and leading slashes', () => {
    expect(resolveApiUrl('tickets/', '/api/')).toBe('/api/tickets/');
  });

  it('supports an absolute API base URL', () => {
    expect(resolveApiUrl('/me', 'https://api.example.test/api')).toBe(
      'https://api.example.test/api/me',
    );
  });
});
