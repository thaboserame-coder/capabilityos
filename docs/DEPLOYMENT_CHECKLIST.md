# Deployment checklist

One-time setup required to take this repo from "code in a folder" to a
deployed, gated, monitored application. These steps require accounts and
human actions that couldn't be performed as part of the code scaffold — work
through them in order.

## 1. Push to GitHub

```bash
cd capabilityos
git init
git add .
git commit -m "Initial production-ready CapabilityOS scaffold"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Branch protection (2-approval policy)

In the GitHub repo: **Settings > Branches > Add branch protection rule** for
`main`:

- [ ] Require a pull request before merging
- [ ] Require approvals: **2**
- [ ] Require review from Code Owners (update `.github/CODEOWNERS` with real
      usernames/teams first — it currently has placeholder
      `@digilytics/...` handles)
- [ ] Require status checks to pass before merging — select:
  - `Lint & format`
  - `Unit & integration tests (coverage)`
  - `Production build`
  - `Storybook build`
  - `Cypress E2E + accessibility (axe)`
  - `Lighthouse budgets`
  - `Analyze (javascript-typescript)` (CodeQL)
- [ ] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (include administrators)

## 3. Vercel project

- [ ] Create a new Vercel project from the GitHub repo (vercel.com > Add New > Project). Vercel auto-detects the Vite framework and `vercel.json`.
- [ ] Set environment variables (Project Settings > Environment Variables),
      per `.env.example`:
  - `ANTHROPIC_API_KEY` (optional — enables AI-generated quizzes)
  - `VITE_ANALYTICS_ENDPOINT` (optional)
  - `VITE_ERROR_ENDPOINT` (optional)
- [ ] Confirm the first deploy succeeds and the app loads at the assigned
      `*.vercel.app` URL.
- [ ] For `.github/workflows/deploy.yml` to also deploy from CI (preview
      deployments on PRs, production on `main`), add these repo secrets
      (Settings > Secrets and variables > Actions):

  - `VERCEL_TOKEN` — from vercel.com/account/tokens
  - `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — from the project's
    `.vercel/project.json` after running `vercel link` locally, or from
    Project Settings > General

  Until these are set, `deploy.yml` runs but skips the deploy steps with a
  warning — it will not fail CI.

## 4. Percy (visual regression)

- [ ] Create a free Percy project (percy.io) linked to this repo.
- [ ] Copy the project's `PERCY_TOKEN`.
- [ ] Add it as a repo secret: Settings > Secrets and variables > Actions >
      `PERCY_TOKEN`.
- [ ] Re-run `.github/workflows/e2e.yml` — the `percy` job will now upload
      snapshots and (after the first run establishes a baseline) flag visual
      diffs on subsequent PRs.

## 5. Observability (error tracking + performance)

Pick one:

- **Endpoint-based (no new vendor)**: stand up any HTTP endpoint that accepts
  JSON POSTs (see shapes documented in `src/observability/*.js`) and set
  `VITE_ERROR_ENDPOINT` / `VITE_ANALYTICS_ENDPOINT` in Vercel.
- **Sentry**: follow [docs/RUNBOOK.md "Observability setup"](RUNBOOK.md#observability-setup).

Either way:

- [ ] Confirm an intentionally-thrown error in a dev build appears in the
      configured destination.
- [ ] Build a dashboard/alert for error rate and Core Web Vitals (see
      RUNBOOK.md for the specific metrics to track).

## 6. Lighthouse CI baseline

- [ ] After the first successful run of `.github/workflows/lighthouse.yml`,
      confirm all four category scores (performance, accessibility,
      best-practices, SEO) are ≥ 90 as configured in `lighthouserc.json`. If
      any score is below 90 on the current content/design, decide whether to
      raise the bar over time via follow-up PRs or temporarily lower the
      specific threshold with a tracked issue — do not silently delete the
      assertion.

## 7. Usability testing & stakeholder sign-off

These require human participants and cannot be automated:

- [ ] Run a moderated usability session with 5 representative learners
      covering: registration, completing a module + quiz, viewing a
      certificate, and (for a facilitator) the cohort dashboard + notes.
- [ ] Capture issues as GitHub issues, prioritized, and triaged against the
      quality gates above (e.g. an a11y issue found in usability testing
      should also get a `cypress-axe` regression test).
- [ ] Present the deployed Vercel URL, Storybook (`build-storybook` output,
      can be hosted as a static site), and this checklist to stakeholders for
      sign-off before announcing general availability.

## 8. Ongoing

- [ ] Dependabot PRs (`.github/dependabot.yml`) are reviewed weekly — npm
      dependencies are grouped (Storybook, ESLint, testing) to reduce PR
      noise.
- [ ] CodeQL findings (Security tab) are triaged within the same sprint they
      appear.
