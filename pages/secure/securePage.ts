import { Page, Locator } from '@playwright/test';
import { BasePage } from '../basePage';

/**
 * Page object for the page shown after a successful login
 * (https://practicetestautomation.com/logged-in-successfully/).
 */
export class SecurePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}

export const securePageLocators = {
  successHeading: '.post-title',
}

export const securePageTexts = {
  successHeading: 'Logged In Successfully',
  logoutButton: 'Log out',
}