# Runbook

Operational notes for running, deploying, and debugging CapabilityOS.

## Environment variables

See [`.env.example`](../.env.example) for the full list. Summary:

| Variable                  | Where used                           | Required?                                                                                                                             |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`       | `api/quiz.js` (server-side only)     | No — without it, `/api/quiz` returns 503 and the client falls back to `src/data/fallbackQuiz.js`. The app is fully usable without it. |
| `VITE_ANALYTICS_ENDPOINT` | `src/observability/webVitals.js`     | No — without it, Core Web Vitals are only logged to the console in development.                                                       |
| `VITE_ERROR_ENDPOINT`     | `src/observability/errorTracking.js` | No — without it, errors are only logged to the console in development.                                                                |

Set these in Vercel under **Project Settings > Environment Variables** (never
commit `.env*` files — see `.gitignore`).

## Observability setup

The codebase ships with **integration points**, not full vendor SDKs, so the
app works on day one without any third-party accounts. To wire up a real
provider:

### Errors (e.g. Sentry)

1. `npm install @sentry/react`
2. In `src/observability/errorTracking.js`, replace the body of
   `reportError` with `Sentry.captureException(error, { extra: context })`.
3. Call `Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment: import.meta.env.MODE })`
   at the top of `initErrorTracking()`.
4. Add `VITE_SENTRY_DSN` to Vercel environment variables and `.env.example`.

Alternatively, set `VITE_ERROR_ENDPOINT` to any HTTP endpoint that accepts
`{ message, stack, context, page, ts }` JSON POSTs (e.g. a logging
collector) — no code change required.

### Performance (Core Web Vitals)

`reportWebVitals()` already collects LCP/CLS/INP/FCP/TTFB via `web-vitals`.
Either:

- Set `VITE_ANALYTICS_ENDPOINT` to an endpoint that accepts the metric JSON
  shape documented in `src/observability/webVitals.js`, or
- Replace `reportMetric`'s body with a vendor SDK call (e.g. Datadog RUM's
  `addRumGlobalContext` / custom timings, or Vercel Analytics' `track`).

### Dashboards

Once an endpoint is wired up, build dashboards/alerts in that provider for:

- Error rate (overall, and per `context.type` — `window.onerror` vs
  `unhandledrejection`)
- Core Web Vitals against the [Lighthouse CI budgets](../lighthouserc.json)
  (performance/accessibility/best-practices/SEO ≥ 90) so regressions are
  visible in production, not just in CI.
- `/api/quiz` error rate and 503 rate (503 indicates `ANTHROPIC_API_KEY` is
  unset or the upstream Anthropic API is degraded — learners still get the
  fallback quiz, but this should be alerted on if persistent).

## Common issues

### `npm run lint` fails with `react-refresh/only-export-components`

Storybook story files (`*.stories.jsx`) and `.storybook/**` config files are
expected to export non-component values (story objects, config objects).
`eslint.config.js` already disables this rule for those file globs — if you
see this error elsewhere, it usually means a component file is exporting
something other than the component (move the extra export to a separate
module, or to `src/utils/` / `src/data/`).

### `npm run test:coverage` fails on thresholds

Coverage thresholds (95% statements/functions/lines, 90% branches) are
enforced per `vite.config.js`. Run `npm run test:coverage` locally and check
`coverage/index.html` for the uncovered lines before adding tests — avoid
lowering the thresholds as a fix.

### Cypress can't reach `localhost:4173`

`npm run e2e` and `npm run e2e:percy` use `start-server-and-test`, which
builds + serves the app via `vite preview` on port 4173 before running
Cypress. If you're running Cypress manually (`npm run cypress:open`), start
`npm run preview` in another terminal first.

### Quiz always shows "Using the offline question bank"

This means `/api/quiz` returned a non-200 (commonly 503 because
`ANTHROPIC_API_KEY` is unset). This is expected in local dev, Storybook, and
CI — the offline question bank (`src/data/fallbackQuiz.js`) is a complete,
curated fallback, not a degraded experience. To use AI-generated quizzes
locally, set `ANTHROPIC_API_KEY` and run via `vercel dev` (so `/api/*`
functions are served), not `vite` alone.

### Percy step is skipped in CI

The `percy` job in `.github/workflows/e2e.yml` checks for a `PERCY_TOKEN`
secret at runtime and prints a warning + exits successfully if it's not set,
so it never blocks merges before Percy is configured. See
[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) to enable it.

## Incident response

For a production incident (app down, error rate spike):

1. Check the Vercel deployment dashboard for the latest deployment's status
   and build logs.
2. Check the observability dashboard (once configured, see above) for the
   error rate and affected screen (`context.page` in error reports).
3. If caused by a recent deploy, use Vercel's "Promote to Production" on the
   previous known-good deployment (instant rollback, no rebuild needed).
4. If caused by `/api/quiz` (e.g. Anthropic outage), confirm the client falls
   back gracefully (it should — `loadError` state shows "Using the offline
   question bank"); this is degraded, not down, and can usually wait for the
   upstream provider to recover.
5. File a postmortem noting root cause and the "fix-from-the-root" follow-up
   (per the engineering brief's Fix-from-the-Root Policy — patch the
   underlying defect, not just the symptom).
