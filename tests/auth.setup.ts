import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/login/loginPage';
import { securePageLocators, securePageTexts } from '@pages/secure/securePage';
import { env } from '../config/env';
import { STORAGE_STATE } from '../config/paths';
import { urls } from '@pages/urls';

/**
 * Authentication setup.
 * Runs once before the test projects, logs in with the credentials from
 * `.env`, then writes the authenticated session (cookies + localStorage)
 * to STORAGE_STATE so the other projects can reuse it without logging in.
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(env.USER_NAME, env.PASSWORD);
  // Make sure login actually succeeded before persisting the session.
  await expect(page).toHaveURL(urls.secure);
  await expect(page.getByRole('link', { name: securePageTexts.logoutButton })).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE });
});
