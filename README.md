# Playwright Training

End-to-end test suite built with [Playwright](https://playwright.dev/) and TypeScript,
using the **Page Object Model**. Sensitive data (URLs, credentials) is read from a
git-ignored `.env` file, and a saved login session is reused across tests.

📖 **Online docs:** <https://xuanhavcdn.github.io/playwright-training/> — this same
README, rendered as a web page and auto-published by the *Deploy docs to GitHub Pages*
workflow (`.github/workflows/pages.yml`). To enable it once: **Settings → Pages →
Build and deployment → Source = GitHub Actions**.

## Project structure

```
playwright-training/
├── .env                  # sensitive data (git-ignored) — your real values
├── .env.example          # template; copy to .env
├── config/
│   ├── env.ts            # loads .env and exposes typed, validated values
│   └── paths.ts          # shared paths (e.g. saved session file)
├── pages/                # Page Objects, one folder per page
│   ├── basePage.ts       # abstract base class every page extends
│   ├── urls.ts           # shared route paths (urls) + expected texts (urlsTexts)
│   ├── login/
│   │   └── loginPage.ts  # LoginPage class + loginLocators + loginTexts
│   └── secure/
│       └── securePage.ts # SecurePage class + securePageLocators + securePageTexts
├── tests/                # spec files
│   ├── auth.setup.ts     # logs in once and saves the session
│   ├── login.spec.ts     # login-flow tests (clean session)
│   └── session.spec.ts   # reuses the saved authenticated session
├── playwright.config.ts  # base URL, browsers, setup project, reporters
└── tsconfig.json         # strict TypeScript + @pages/* path alias
```

### Page Object conventions

Each page lives in its own folder under `pages/` and is split into three parts:

- A **class** (e.g. `LoginPage`) extending `BasePage`, exposing high-level actions
  such as `open()` and `login(user, pass)`.
- A **locators** object (e.g. `loginLocators`) — plain string selectors, exported so
  specs can assert against them directly.
- A **texts** object (e.g. `loginTexts`) — expected copy used in assertions.

`BasePage` holds the shared bits every page needs (`goto()`, `url()`). Shared route
paths and their expected page texts live centrally in `pages/urls.ts` as `urls` and
`urlsTexts`. Everything is imported via the `@pages/*` alias (e.g.
`@pages/login/loginPage`, `@pages/urls`).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (developed on v22)
- npm (ships with Node.js)

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install browser binaries** (Chromium, Firefox, WebKit)

   ```bash
   npx playwright install
   ```

3. **Configure environment variables**

   Copy the template and fill in real values. `.env` is git-ignored and never committed.

   ```bash
   cp .env.example .env
   ```

   | Variable    | Required | Description                          |
   | ----------- | -------- | ------------------------------------ |
   | `ENV`       | no       | Environment label (e.g. `staging`)   |
   | `BASE_URL`  | yes      | Base URL used by `page.goto()`       |
   | `USER_NAME` | yes      | Login username                       |
   | `PASSWORD`  | yes      | Login password                       |
   | `HEADLESS`  | no       | Run browsers headless (`true`/`false`) |
   | `WORKERS`   | no       | Number of parallel workers           |

   Missing required values fail fast with a clear error.

## Running tests

```bash
npm test                  # run all tests on all browsers
npm run test:chromium     # Chromium only
npm run test:headed       # run with a visible browser window
npm run test:ui           # interactive Playwright UI mode
npm run report            # open the last HTML report
npm run typecheck         # type-check without running tests
```

Run a single file or test by name:

```bash
npx playwright test tests/login.spec.ts
npx playwright test -g "valid credentials"
```

### Test tags

Each test is tagged with an environment tag (`@Staging`, `@Prod`) and a feature tag
(e.g. `@login`, `@session`) via Playwright's `tag` option:

```ts
test('logs in with valid credentials from .env', {
  tag: ['@Staging', '@Prod', '@login'],
}, async ({ page }) => { /* ... */ });
```

Filter which tests run with `--grep` / `--grep-invert`:

```bash
npx playwright test --grep @Prod              # only @Prod tests
npx playwright test --grep @login             # only the login feature
npx playwright test --grep "@Staging.*@login" # combine tags
npx playwright test --grep-invert @Prod       # everything except @Prod
```

## CI (GitHub Actions)

`.github/workflows/e2e.yml` runs the suite on demand. Trigger it from the
**Actions** tab → *e2e suites* → **Run workflow**, then pick:

| Option        | Choices                              | Effect                                    |
| ------------- | ------------------------------------ | ----------------------------------------- |
| `environment` | `staging` / `prod`                   | Loads that GitHub Environment's secrets and filters by `@Staging` / `@Prod` |
| `feature`     | `all` / `login` / `session`          | `all` runs every test; otherwise adds the `@<feature>` tag to the filter |
| `browser`     | `all` / `chromium` / `firefox` / `webkit` | Limits to one browser project (or all) |

The job combines the environment and feature tags into a single Playwright
`--grep` filter and uploads the HTML report as a build artifact.

### Storing variables and secrets in GitHub Settings

The workflow reads its config from **GitHub Environments** so each environment
(`staging`, `prod`) can have its own URL and credentials. Sensitive values go in
**secrets** (masked in logs and never printed); non-sensitive config goes in
**variables** (visible in logs).

| Name        | Kind     | Referenced as       | Description                          |
| ----------- | -------- | ------------------- | ------------------------------------ |
| `USER_NAME` | secret   | `${{ secrets.USER_NAME }}` | Login username / email (sensitive) |
| `PASSWORD`  | secret   | `${{ secrets.PASSWORD }}`  | Login password (sensitive)         |
| `BASE_URL`  | variable | `${{ vars.BASE_URL }}`     | Base URL for that environment      |

**Step by step:**

1. On GitHub, open the repository and go to **Settings** (top tab; requires admin/maintainer access).
2. In the left sidebar, under *Security* / *Code and automation*, click **Environments**.
3. Click **New environment**, name it `staging`, and click **Configure environment**.
   Repeat to create a `prod` environment.
4. Inside an environment, add credentials under **Environment secrets** → **Add secret**:
   - Name `USER_NAME`, value = the login user → **Add secret**.
   - Name `PASSWORD`, value = the login password → **Add secret**.
5. Add non-sensitive config under **Environment variables** → **Add variable**:
   - Name `BASE_URL`, value = that environment's base URL (e.g. `https://practicetestautomation.com/`) → **Add variable**.
6. Repeat steps 4–5 for the `prod` environment with its own values.

When you run the workflow and pick `environment: staging`, GitHub loads that
environment's secrets/variables into the job. If `BASE_URL` is not set, the workflow
falls back to a default URL so the run still works. Add more sensitive values (API
tokens, etc.) as secrets the same way and reference them with `${{ secrets.* }}`.

> **Tip:** repository-wide values (shared across all environments) can instead live
> under *Settings → Secrets and variables → Actions*, with **Secrets** and **Variables**
> tabs that work the same way. Environment-scoped values override repo-wide ones.

## How the login session is reused

A `setup` project runs before the browser projects:

1. `tests/auth.setup.ts` logs in once with the `.env` credentials and saves the
   authenticated browser state (cookies + localStorage) to
   `playwright/.auth/user.json` (git-ignored).
2. The `chromium` / `firefox` / `webkit` projects depend on `setup` and load that
   state, so their tests start already logged in — no repeated login UI.
3. `tests/login.spec.ts` opts out with an empty `storageState`, since it tests the
   login flow itself and needs a clean session.

## Adding a new test

1. Add the route and its expected text to `pages/urls.ts`:

   ```ts
   export const urls = {
     // ...existing routes
     dashboard: '/dashboard/',
   }

   export const urlsTexts = {
     // ...existing texts
     dashboard: 'Dashboard',
   }
   ```

2. Create a page object folder under `pages/` — a class plus its locators/texts:

   ```ts
   // pages/dashboard/dashboardPage.ts
   import { Page } from '@playwright/test';
   import { BasePage } from '../basePage';
   import { urls } from '../urls';

   export class DashboardPage extends BasePage {
     constructor(page: Page) {
       super(page);
     }

     async open() {
       await this.goto(urls.dashboard);
     }
   }

   export const dashboardLocators = {
     heading: 'h1.dashboard-title',
   }

   export const dashboardTexts = {
     heading: 'Dashboard',
   }
   ```

3. Add a spec in `tests/`, importing via the `@pages/*` alias:

   ```ts
   import { test, expect } from '@playwright/test';
   import { DashboardPage, dashboardLocators } from '@pages/dashboard/dashboardPage';
   import { urls, urlsTexts } from '@pages/urls';

   test('shows the dashboard', async ({ page }) => {
     const dashboard = new DashboardPage(page);
     await dashboard.open();
     await expect(page).toHaveURL(urls.dashboard);
     await expect(page.locator(dashboardLocators.heading)).toContainText(urlsTexts.dashboard);
   });
   ```
