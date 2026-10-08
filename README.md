# ProdCare Playwright Automation

## What this project is

This is a TypeScript UI test project built with Playwright Test. It uses page objects to keep UI interactions out of test files:

1. A test opens the login route.
2. The test creates a `PageManager` for its Playwright page.
3. `PageManager` exposes the `LoginPage` page object.
4. `LoginPage` fills and submits the login form, checks for a welcome message, and can sign out.

For example, `tests/prodcare-spec/Login.spec.ts` loads test data from `tests/fixture/testdata/Login-Credentials.json`, calls `loginPageCredentials`, and then signs out.

## Project layout

| Path | Purpose |
| --- | --- |
| `tests/prodcare-spec/` | Feature tests |
| `tests/fixture/testdata/` | Test data used by tests |
| `page-object/` | Page and reusable UI component objects |
| `page-manager/` | Creates and exposes page objects for a test |
| `helpers/` | Shared test helpers, including Playwright step reporting |
| `playwright.config.ts` | Target URL, timeouts, reporters, browser projects, and run options |
| `.github/workflows/playwright.yml` | GitHub Actions workflow that installs dependencies and runs the tests |
| `specs/` | Currently contains only a short README; no test plans are present |

`tests/seed.spec.ts` is an empty generated-test template. It is currently discovered and reported as a test, but it does not exercise the application.

## Set up and run

Requirements: Node.js and npm. Install the project dependencies and the Playwright browsers:

```sh
npm ci
npx playwright install
```

Run only the login test in Chromium:

```sh
npx playwright test tests/prodcare-spec/Login.spec.ts --project=chromium
```

Run all configured projects and tests:

```sh
npx playwright test
```

The full run currently includes Chromium, WebKit, and a Pixel 7 mobile-emulation project. Playwright's device profile emulates a mobile browser; it does not run a native Android app.

Open the HTML report after a run:

```sh
npx playwright show-report
```

The configuration also writes Allure results to `allure-results/`; that directory is ignored by Git.

## What is in good shape

- Playwright's `Page` and locator APIs are used rather than fixed sleeps.
- The login UI interactions are grouped in a page object instead of being repeated in the test.
- The test data is separated from the test logic.
- The configuration captures screenshots, traces, and video on failures and enables retries in CI.
- `npx playwright test --list` currently discovers the login test and the empty seed template in each of the three projects.

## Problems and risks to address

1. **The application URL is environment-specific.** `playwright.config.ts` points at a private-network IP (`192.168.11.29`), so GitHub-hosted runners will not normally be able to reach the application. Configure the application URL through an environment variable or run CI on a network that can access it.
2. **The route and base URL may not match.** `baseURL` is set to `http://192.168.11.29/login`, but the test navigates to `/Auth/Login`. Because this is a root-relative path, Playwright navigates to `http://192.168.11.29/Auth/Login` (the `/login` part is discarded). Confirm the application's intended route and make the configuration consistent.
3. **Login helper action order is wrong for its optional controls.** `loginPageCredentials` submits the form before it clicks “Remember me” or “Forgot password?”. Those options should be acted on before submitting, and the forgot-password path should not continue with an expectation that a successful login welcome message appears.
4. **Credentials are stored in a tracked JSON file.** The fixture contains a username and password in plain text. Use CI secrets or local environment variables for credentials, and avoid committing real credentials. Rotate them if they are valid outside a disposable test environment.
5. **Default runs do more than the current example needs.** `npx playwright test` runs the login test and the empty seed test in Chromium, WebKit, and Pixel 7 emulation. Use the focused command above while developing, and decide which projects should run in CI.
6. **The project has no npm scripts or TypeScript compiler dependency.** `package.json` has an empty `scripts` section and does not declare `typescript`; `npx tsc --noEmit` therefore cannot run with the current install. Add a local TypeScript dev dependency and a type-check script if type-checking is part of the workflow.
7. **TypeScript path aliases are stale.** `tsconfig.json` maps aliases to folders such as `page-objects/` and `src/test-cases/`, while the repository uses `page-object/`, `tests/`, and `page-manager/`. The current test imports use root-relative paths instead; update the aliases to real folders or remove unused aliases.
8. **The CI workflow needs an environment check.** `.github/workflows/playwright.yml` runs all browser projects against the private-network application URL. Even after making the app reachable, ensure headed mode (`headless: false`) is supported by the runner; headless mode is generally safer for CI.

## Current verification

- `npx playwright test --list`: passed; six test cases were discovered (two test files across three projects).
- `npx tsc --noEmit`: could not run because TypeScript is not installed as a project dependency.
- The browser tests have not been executed here, so successful login, sign-out, and CI connectivity are not verified.
