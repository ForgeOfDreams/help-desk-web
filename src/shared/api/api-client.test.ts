import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest, setApiAccessToken } from './index';

afterEach(() => {
  vi.unstubAllGlobals();
  setApiAccessToken(null);
});

describe('apiRequest', () => {
  it('sends JSON and parses JSON responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 't-1' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      apiRequest<{ id: string }>('/tickets', { method: 'POST', body: { subject: 'Test' } }),
    ).resolves.toEqual({ id: 't-1' });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tickets',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ subject: 'Test' }),
      }),
    );
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(requestInit.headers).get('content-type')).toBe('application/json');
  });

  it('attaches bearer authorization when a token is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/me', { accessToken: 'access-token' })).resolves.toBeUndefined();
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(requestInit.headers).get('authorization')).toBe('Bearer access-token');
  });

  it('uses the in-memory access token for protected requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'user-1' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('memory-access-token');

    await apiRequest('/me');

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(requestInit.headers).get('authorization')).toBe(
      'Bearer memory-access-token',
    );
  });

  it('clears an expired token after a 401 response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: 'Expired' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    setApiAccessToken('expired-access-token');

    await expect(apiRequest('/me')).rejects.toBeInstanceOf(ApiError);
    await apiRequest('/notifications/1/read', { method: 'POST' });

    const nextRequestInit = fetchMock.mock.calls[1]?.[1] as RequestInit;
    expect(new Headers(nextRequestInit.headers).get('authorization')).toBeNull();
  });

  it('returns undefined for 204 responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(apiRequest('/notifications/1/read', { method: 'POST' })).resolves.toBeUndefined();
  });

  it('throws a typed error for unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Denied' }), {
          status: 403,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );

    await expect(apiRequest('/tickets')).rejects.toBeInstanceOf(ApiError);
  });
});
