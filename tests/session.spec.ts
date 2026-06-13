import { securePageLocators, securePageTexts } from '@pages/secure/securePage';
import { urls, urlsTexts } from '@pages/urls';
import { test, expect } from '@playwright/test';

/**
 * Demonstrates reusing the saved login session.
 * No login steps here — the project loads STORAGE_STATE (set up by
 * auth.setup.ts via the `setup` dependency), so the browser is already
 * authenticated when the test starts.
 */
test('reuses the saved authenticated session', {
  tag: ['@Staging', '@Prod', '@session'],
}, async ({ page }) => {
  await page.goto(urls.secure);
  await expect(page.locator(securePageLocators.successHeading)).toContainText(urlsTexts.secure);
  await expect(page.getByRole('link', { name: securePageTexts.logoutButton })).toBeVisible();
});
