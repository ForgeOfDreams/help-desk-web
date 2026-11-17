import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from './index';

describe('resolveApiUrl', () => {
  it('joins base and relative paths', () => {
    expect(resolveApiUrl('/tickets', '/api/')).toBe('/api/tickets');
  });

  it('supports absolute API URLs', () => {
    expect(resolveApiUrl('/auth/login', 'https://api.example.test/api/')).toBe(
      'https://api.example.test/api/auth/login',
    );
  });
});
