import { test, expect } from '@playwright/test';

const unique = Date.now();
const email = `e2e.user+${unique}@example.com`;
const password = 'Password123!';

test('sign up then login via credentials', async ({ page, request }) => {
  // Sign up using API to avoid flaky UI flows
  const reg = await request.post('/api/auth/register', {
    data: { email, password, name: 'E2E User' }
  });
  expect(reg.ok()).toBeTruthy();

  // Go to login page and sign in
  await page.goto('/login');
  await page.fill('input[type="text"], input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');

  // Redirect to dashboard
  await page.waitForURL(/dashboard/);
  await expect(page).toHaveURL(/dashboard/);
});