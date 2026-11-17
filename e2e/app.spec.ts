import { expect, test } from '@playwright/test';

test.describe('Help Desk Web shell', () => {
  test('renders the home page and navigates to the login placeholder', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Help Desk' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Маршруты-заготовки' })).toBeVisible();

    await page.getByRole('link', { name: /вход/i }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Вход в Help Desk' })).toBeVisible();
  });

  test('renders a not-found page for an unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Страница не найдена' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/');
  });
});
