import { expect, test } from '@playwright/test';

const currentUser = {
  id: 'user-1',
  email: 'alex@example.com',
  displayName: 'Александр Иванов',
  roles: ['ROLE_USER'],
  createdAt: '2026-01-10T09:00:00+00:00',
};

test.describe('Public access and authentication', () => {
  test('shows only minimal public information to an anonymous user', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /портал поддержки/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /войти в систему/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /создать аккаунт/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Доступ к порталу' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Обращения', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Профиль', exact: true })).toHaveCount(0);
    await expect(page.getByText('Последние обращения')).toHaveCount(0);
  });

  test('redirects direct requests to private pages to login', async ({ page }) => {
    await page.goto('/tickets?status=open');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 1, name: 'С возвращением' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Обращения' })).toHaveCount(0);
  });

  test('keeps every workspace route private for anonymous users', async ({ page }) => {
    const privateRoutes = [
      '/dashboard',
      '/tickets',
      '/tickets/new',
      '/tickets/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      '/notifications',
      '/profile',
      '/admin/users',
    ];

    for (const route of privateRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { level: 1, name: 'С возвращением' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Рабочая область' })).toHaveCount(0);
    }
  });

  test('authenticates through Symfony API and shows private workspace after /me succeeds', async ({ page }) => {
    await page.route('**/api/auth/login', (route) => route.fulfill({ json: { token: 'stub-access-token' } }));
    await page.route('**/api/me', (route) => route.fulfill({ json: currentUser }));
    await page.route('**/api/tickets?**', (route) => route.fulfill({
      json: { '@context': '/api/contexts/Ticket', '@type': 'Collection', 'hydra:member': [], 'hydra:totalItems': 0 },
    }));

    await page.goto('/login');
    await page.getByLabel('Рабочая почта').fill('alex@example.com');
    await page.getByLabel('Пароль').fill('not-a-real-password');
    await page.getByRole('button', { name: 'Войти' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Здравствуйте, Александр Иванов' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Рабочая область' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Профиль' })).toBeVisible();
  });

  test('registers via the public endpoint without exposing account existence', async ({ page }) => {
    await page.route('**/api/auth/register', (route) => route.fulfill({
      status: 202,
      json: { message: 'Если адрес доступен для регистрации, инструкция будет отправлена.' },
    }));

    await page.goto('/register');
    await page.getByLabel('Имя и фамилия').fill('Александр Иванов');
    await page.getByLabel('Рабочая почта').fill('alex@example.com');
    await page.getByLabel('Пароль').fill('a-long-secure-password');
    await page.getByRole('button', { name: 'Создать аккаунт' }).click();

    await expect(page.getByRole('heading', { name: 'Проверьте почту' })).toBeVisible();
    await expect(page.getByText(/инструкция будет отправлена/i)).toBeVisible();
  });

  test('verifies an email through the onboarding endpoint', async ({ page }) => {
    await page.route('**/api/auth/verify-email', (route) => route.fulfill({ json: { message: 'Email verified.' } }));
    await page.goto(`/verify-email#token=${'a'.repeat(64)}`);
    await page.getByRole('button', { name: 'Подтвердить почту' }).click();

    await expect(page.getByRole('heading', { name: 'Адрес подтверждён' })).toBeVisible();
    await expect(page).toHaveURL(/\/verify-email$/);
  });

  test('sets a password for an invited user using the token fragment', async ({ page }) => {
    await page.route('**/api/auth/set-password', async (route) => {
      const request = route.request();
      const body = request.postDataJSON() as { token: string; newPassword: string };
      expect(body.token).toBe('b'.repeat(64));
      expect(body.newPassword).toBe('a-secure-password-for-an-invited-user');
      await route.fulfill({ json: { message: 'Password set.' } });
    });

    await page.goto(`/set-password#token=${'b'.repeat(64)}`);
    await page.getByLabel('Новый пароль').fill('a-secure-password-for-an-invited-user');
    await page.getByLabel('Повторите пароль').fill('a-secure-password-for-an-invited-user');
    await page.getByRole('button', { name: 'Установить пароль' }).click();

    await expect(page.getByRole('heading', { name: 'Пароль установлен' })).toBeVisible();
    await expect(page).toHaveURL(/\/set-password$/);
  });

  test('renders the minimal not-found page for unknown paths', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { level: 1, name: 'Страница не найдена' })).toBeVisible();
    await page.getByRole('link', { name: 'На главную' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /портал поддержки/i })).toBeVisible();
  });
});
