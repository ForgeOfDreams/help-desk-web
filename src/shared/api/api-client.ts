import { ApiError, getApiErrorMessage } from './api-error';
import { resolveApiUrl } from './api-url';

let currentAccessToken: string | null = null;

export function setApiAccessToken(token: string | null): void {
  currentAccessToken = token;
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
  accessToken?: string;
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('json') || contentType.includes('+json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { accessToken, body, headers: inputHeaders, ...requestInit } = options;
  const headers = new Headers(inputHeaders);
  headers.set('Accept', 'application/ld+json, application/json');

  let requestBody: BodyInit | null | undefined;
  if (body !== undefined && body !== null && typeof body === 'object') {
    const isBodyInit =
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof URLSearchParams ||
      body instanceof ArrayBuffer;

    if (isBodyInit) {
      requestBody = body as BodyInit;
    } else {
      headers.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(body);
    }
  } else {
    requestBody = body as BodyInit | null | undefined;
  }

  const token = accessToken ?? currentAccessToken;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(resolveApiUrl(path), {
    ...requestInit,
    headers,
    body: requestBody,
  });
  const payload = await readResponseBody(response);

  if (response.status === 401 && currentAccessToken) {
    setApiAccessToken(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('helpdesk:unauthorized'));
    }
  }

  if (!response.ok) {
    const fallback = `API request failed with status ${response.status}.`;
    throw new ApiError(response.status, payload, getApiErrorMessage(payload, fallback));
  }

  return payload as T;
}
