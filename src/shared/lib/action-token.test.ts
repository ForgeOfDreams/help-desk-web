// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { clearActionTokenFromUrl, readActionTokenFromUrl } from './action-token';

const token = 'a'.repeat(64);

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('action token URL handling', () => {
  it('reads the token from the URL fragment used by onboarding emails', () => {
    expect(readActionTokenFromUrl(`https://help.example/verify-email#token=${token}`)).toBe(token);
  });

  it('supports the legacy query-string token format', () => {
    expect(
      readActionTokenFromUrl(`https://help.example/verify-email?token=${token}&source=mail`),
    ).toBe(token);
  });

  it('removes the token from browser history while preserving unrelated query parameters', () => {
    window.history.replaceState({}, '', `/verify-email?source=mail&token=${token}#token=${token}`);

    clearActionTokenFromUrl();

    expect(window.location.pathname).toBe('/verify-email');
    expect(window.location.search).toBe('?source=mail');
    expect(window.location.hash).toBe('');
  });
});
