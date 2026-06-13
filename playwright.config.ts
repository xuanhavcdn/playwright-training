import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';
import { STORAGE_STATE } from './config/paths';

/**
 * Playwright configuration.
 * Sensitive values (URLs, credentials) come from `.env` via `config/env.ts`.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests within a file in parallel. */
  fullyParallel: true,
  /* Fail the build on CI if a `test.only` was left in the source. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel workers on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: [['html', { open: 'never' }], ['list']],

  /* Max time an expect() assertion waits before failing (e.g. toBeVisible). */
  expect: { timeout: 60_000 },

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL so tests can navigate with page.goto('/login'). */
    baseURL: env.BASE_URL,
    /* Max time each action (click, fill, waiting for element, etc.) can run. */
    actionTimeout: 60_000,
    /* Collect trace when retrying a failed test. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers. */
  projects: [
    /* Logs in once and saves the session to STORAGE_STATE. */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
