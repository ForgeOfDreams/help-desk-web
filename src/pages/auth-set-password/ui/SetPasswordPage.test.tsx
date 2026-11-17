// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SetPasswordPage } from './SetPasswordPage';

const token = 'b'.repeat(64);

class HeadersStub {
  private readonly values = new Map<string, string>();

  constructor(init?: HeadersInit) {
    if (Array.isArray(init)) {
      init.forEach(([key, value]) => this.set(key, value));
    } else if (init && typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => this.set(key, String(value)));
    }
  }

  set(key: string, value: string) {
    this.values.set(key.toLowerCase(), value);
  }

  get(key: string) {
    return this.values.get(key.toLowerCase()) ?? null;
  }
}

function jsonResponse(body: unknown): Response {
  return {
    status: 200,
    ok: true,
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
    },
    text: async () => JSON.stringify(body),
  } as Response;
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/set-password']}>
        <SetPasswordPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  window.history.replaceState({}, '', `/set-password#token=${token}`);
});

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

describe('SetPasswordPage', () => {
  it('rejects mismatched passwords without sending a request', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('Headers', HeadersStub);
    vi.stubGlobal('fetch', fetchMock);

    renderPage();
    await user.type(screen.getByLabelText('Новый пароль'), 'a-secure-password-123');
    await user.type(screen.getByLabelText('Повторите пароль'), 'a-different-password-123');
    await user.click(screen.getByRole('button', { name: 'Установить пароль' }));

    expect(await screen.findByText('Пароли не совпадают. Проверьте оба поля.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the invitation token and password to the Symfony endpoint', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ message: 'Password set.' }));
    vi.stubGlobal('Headers', HeadersStub);
    vi.stubGlobal('fetch', fetchMock);

    renderPage();
    await user.type(screen.getByLabelText('Новый пароль'), 'a-secure-password-for-invite');
    await user.type(screen.getByLabelText('Повторите пароль'), 'a-secure-password-for-invite');
    await user.click(screen.getByRole('button', { name: 'Установить пароль' }));

    expect(await screen.findByRole('heading', { name: 'Пароль установлен' })).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/set-password',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token, newPassword: 'a-secure-password-for-invite' }),
      }),
    );
    expect(window.location.hash).toBe('');
  });
});
