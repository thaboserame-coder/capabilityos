# Verification report

This report records the results of the full local verification pass run
against the `capabilityos` codebase. It is an honest record of what was
checked, what passed, and what could **not** be verified in this environment
because it requires a browser, a CI runner, or external accounts/services —
those items are tracked as action items in
[`docs/DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md).

## Summary

| Gate | Result | Notes |
| --- | --- | --- |
| Lint (`npm run lint`, `eslint . --max-warnings=0`) | ✅ PASS | Zero warnings, zero errors. |
| Format (`npm run format:check`, `prettier --check .`) | ✅ PASS | All files match Prettier style. |
| Unit/integration tests (`npm run test`) | ✅ PASS | 18 test files, 120 tests, 100% pass, ~36s. |
| Coverage thresholds (statements/functions/lines ≥95, branches ≥90) | ✅ PASS (lower-bound estimate) | See "Coverage" below for methodology. |
| Production build (`npm run build`) | ✅ PASS | 6.44s, expected manual chunks (vendor/icons/state/index). |
| Storybook build (`npm run build-storybook`) | ✅ PASS | 31 story entries across 9 components, 7.4MB static output. |
| Cypress E2E + Percy (`npm run e2e`, `npm run e2e:percy`) | ⚠️ NOT RUN HERE | No browser/Cypress binary available in this sandbox. Runs in CI (`.github/workflows/e2e.yml`), which installs the Cypress binary. |
| Lighthouse CI / axe-core | ⚠️ NOT RUN HERE | Requires a running preview server + Chrome; runs in CI (`.github/workflows/lighthouse.yml`). |
| GitHub Actions CI (live run) | ⚠️ NOT RUN HERE | Requires pushing to GitHub. |
| Vercel deploy, Percy, Sentry/analytics endpoint, branch protection | ⚠️ NOT RUN HERE | Requires external accounts. See checklist. |
| 5-user usability testing & stakeholder sign-off | ⚠️ NOT RUN HERE | Requires human participants. |

## Details

### Lint and format

```
npm run lint        → eslint . --max-warnings=0   → no output, exit 0
npm run format:check → prettier --check .          → "All matched files use Prettier code style!"
```

Re-confirmed after adding the new test cases described below — no
regressions introduced.

### Tests

```
npm run test → vitest run
```

18 test files, 120 tests, all passing, ~35.9s total runtime. This covers
every component, the Zustand store, the storage/quiz API adapters, XP/level
utilities, theme tokens/icons, and the observability modules
(`errorTracking`, `webVitals`).

### Coverage

`npm run test:coverage` (the full 18-file suite instrumented with v8 coverage)
does not complete within this sandbox's 45-second-per-command limit. To still
produce a defensible verdict, the suite was split into two fixed batches of 9
files, each run with `vitest run --coverage` to its own output directory, then
merged: for each source file, the coverage figures were taken from whichever
batch contained that file's own test (the batch that actually exercises it).
This gives a **conservative lower bound** on true full-suite coverage (a full
single run, where every file is exercised by the complete suite together,
can only be equal to or higher than this).

Result against the thresholds configured in `vite.config.js`
(statements/functions/lines ≥95, branches ≥90):

| Metric | Result | Threshold | Status |
| --- | --- | --- | --- |
| Statements | 98.61% (2267/2299) | 95% | ✅ PASS |
| Branches | 92.21% (367/398) | 90% | ✅ PASS |
| Functions | 98.72% (77/78) | 95% | ✅ PASS |
| Lines | 98.61% (2267/2299) | 95% | ✅ PASS |

**Fix from the root**: the initial run found functions coverage at 91.03%
(below the 95% threshold), traced to 7 specific untested interactive code
paths — the logo/Dashboard/Facilitator nav buttons and the "max level" state
in `LearnerNav.jsx`, the Previous/Next module navigation in `ModuleView.jsx`,
and the quiz "Try again" retry flow in `Quiz.jsx`. Rather than lowering the
threshold or excluding files, 7 new real test cases were added (in
`LearnerNav.test.jsx`, `ModuleView.test.jsx`, and `Quiz.test.jsx`) that
exercise these paths, bringing functions coverage to 98.72%.

**Recommendation**: run `npm run test:coverage` directly in CI (where the
runner is not time-limited per command) for an exact single-run figure. Given
the margin above every threshold, it should comfortably pass.

### Production build

```
npm run build → vite build
```

Succeeds in 6.44s, producing the expected manually-chunked bundles:

```
dist/index.html                   0.83 kB
dist/assets/icons-xMnH_k7n.js     7.67 kB
dist/assets/state-CtSZPRb0.js    10.48 kB
dist/assets/index-CUF98ygS.js   102.00 kB
dist/assets/vendor-D4TJF4vw.js  133.97 kB
```

### Storybook build

```
npm run build-storybook → storybook build
```

Succeeds, producing `storybook-static/` (7.4MB) with 31 story entries across
the 9 components that have `.stories.jsx` files (Certificate,
FacilitatorDashboard, LearnerDashboard, LearnerNav, Login, ModuleView, Quiz,
TierView, Toast). This can be deployed as a static site for stakeholder
review per `docs/DEPLOYMENT_CHECKLIST.md` step 7.

### Cypress E2E, Percy, Lighthouse, axe-core

Not runnable in this sandbox: there is no browser binary, and `npx cypress
version` reports `Cypress binary version: not installed` (downloading and
running a full browser is outside what this environment supports). The test
suite, config, and CI wiring (`.github/workflows/e2e.yml`,
`.github/workflows/lighthouse.yml`, `lighthouserc.json`, `cypress/`) are in
place and were written and reviewed as part of Tasks #8 and #11 — they need a
real CI run (which installs its own browser/Cypress binary) to confirm they
pass end-to-end.

## What's left

Everything below requires the user's own accounts/actions and is tracked in
[`docs/DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md):

1. Push the repo to GitHub and confirm the CI workflows run and pass
   (lint/format, tests+coverage, build, Storybook build, Cypress E2E + axe,
   Lighthouse, CodeQL).
2. Configure branch protection (2 required approvals, required status
   checks, CODEOWNERS).
3. Create the Vercel project and confirm the first deploy.
4. Set up Percy and confirm visual snapshots upload.
5. Wire up an error-tracking/analytics endpoint (or Sentry) and confirm an
   intentional error is captured.
6. Confirm the first Lighthouse CI run meets the ≥90 budgets in
   `lighthouserc.json`.
7. Run 5-user usability testing and present results + the deployed app +
   Storybook to stakeholders for sign-off.

## Bottom line

Everything that can be verified without a browser, a CI runner, or external
accounts — lint, formatting, unit/integration tests, coverage thresholds
(via the lower-bound methodology above), the production build, and the
Storybook build — passes cleanly with no known regressions or excluded
checks. The remaining items are infrastructure/account setup and human
processes that only the user can complete, and are fully documented as
actionable checklist items.
