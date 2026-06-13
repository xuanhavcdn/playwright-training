import { test, expect } from '@playwright/test';
import { loginLocators, LoginPage, loginTexts } from '@pages/login/loginPage';
import { SecurePage, securePageLocators, securePageTexts } from '@pages/secure/securePage';
import { env } from '../config/env';
import { urls, urlsTexts } from '@pages/urls';

test.describe('Login', () => {
  test('logs in with valid credentials from .env', {
    tag: ['@Staging', '@Prod', '@login'],
  }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open()
    await loginPage.login(env.USER_NAME, env.PASSWORD);
    await expect(page).toHaveURL(urls.secure);
    expect(page.locator(securePageLocators.successHeading)).toContainText(urlsTexts.secure);
    expect(page.getByRole('link', { name: securePageTexts.logoutButton })).toBeVisible();
  });

  test('shows an error for an invalid password', {
    tag: ['@Staging', '@Prod', '@login'],
  }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(env.USER_NAME, 'wrong-password');
    expect(page.locator(loginLocators.errorMessage)).toBeVisible();
    expect(page.locator(loginLocators.errorMessage)).toContainText(loginTexts.errorMessage);
  });
});
