import { test, expect } from '@playwright/test';

test('landing page renders modes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'FocusFlow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Work Mode' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Life Mode' })).toBeVisible();
});
