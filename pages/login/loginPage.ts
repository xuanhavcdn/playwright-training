import { Page, Locator } from '@playwright/test';
import { BasePage } from '../basePage';
import { urls } from '../urls';

/**
 * Page object for https://practicetestautomation.com/practice-test-login/
 * Locators are declared once here; tests call the action methods below.
 */
export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  /** Open the login page. */
  async open() {
    await this.goto(urls.login);
  }

  /** Fill credentials and submit the form. */
  async login(username: string, password: string) {
    await this.page.locator(loginLocators.usernameInput).fill(username);
    await this.page.locator(loginLocators.passwordInput).fill(password);
    await this.page.locator(loginLocators.submitButton).click();
  }

}

export const loginLocators = {
  usernameInput: '#username',
  passwordInput: '#password',
  submitButton: '#submit',
  errorMessage: '#error',
}

export const loginTexts = {
  errorMessage: 'Your password is invalid!',
}