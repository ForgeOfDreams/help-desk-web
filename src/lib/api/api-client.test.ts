import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-error';
import { apiRequest } from './api-client';

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('apiRequest', () => {
  it('parses JSON responses and sends an Accept header', async () => {
    const fetchMock = mockFetch(
      new Response(JSON.stringify({ id: 'user-1', email: 'agent@example.test' }), {
        status: 200,
        headers: { 'content-type': 'application/ld+json' },
      }),
    );

    const result = await apiRequest<{ id: string; email: string }>('/users/me');

    expect(result).toEqual({ id: 'user-1', email: 'agent@example.test' });
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/users/me');
    const requestInit = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(requestInit?.headers).get('Accept')).toContain('application/json');
  });

  it('serializes JSON bodies and attaches a bearer token', async () => {
    const fetchMock = mockFetch(
      new Response(JSON.stringify({ accepted: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
    );

    await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: 'user@example.test', password: 'secret' },
      accessToken: 'test-access-token',
    });

    const requestInit = fetchMock.mock.calls[0]?.[1];
    const headers = new Headers(requestInit?.headers);
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer test-access-token');
    expect(requestInit?.body).toBe(
      JSON.stringify({ email: 'user@example.test', password: 'secret' }),
    );
  });

  it('converts problem responses into ApiError instances', async () => {
    mockFetch(
      new Response(JSON.stringify({ detail: 'Invalid credentials' }), {
        status: 401,
        headers: { 'content-type': 'application/problem+json' },
      }),
    );

    const request = apiRequest('/auth/login');
    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid credentials',
      payload: { detail: 'Invalid credentials' },
    });
    await expect(request).rejects.toBeInstanceOf(ApiError);
  });

  it('returns undefined for a 204 response', async () => {
    mockFetch(new Response(null, { status: 204 }));

    await expect(
      apiRequest('/notifications/notification-1/read', { method: 'POST' }),
    ).resolves.toBe(undefined);
  });

  it('keeps a non-JSON error body as text', async () => {
    mockFetch(
      new Response('Service unavailable', {
        status: 503,
        headers: { 'content-type': 'text/plain' },
      }),
    );

    await expect(apiRequest('/health')).rejects.toMatchObject({
      status: 503,
      message: 'Service unavailable',
      payload: 'Service unavailable',
    });
  });
});
