import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage holds behaviour common to every page object.
 * Concrete page objects extend this class, declare their own Locators,
 * and reuse the helper methods below instead of touching `page` directly.
 */
export abstract class BasePage {
  protected readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to `baseURL` (e.g. '/practice-test-login/').
   * Defaults to the site root.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Current page URL. */
  url(): string {
    return this.page.url();
  }
}
