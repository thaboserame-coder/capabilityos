# CapabilityOS — Digilytics AI Academy

CapabilityOS is the enterprise AI-literacy learning experience for Digilytics:
a self-paced curriculum ("tiers" of modules), AI-tailored module quizzes,
XP/level/badge gamification, shareable completion certificates, and a
facilitator dashboard for tracking a cohort's progress.

This repository is a production-ready rewrite of the original single-file
prototype — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for what changed
and why.

## Tech stack

| Concern                | Choice                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| UI                     | React 18 + Vite                                                                                        |
| State                  | Zustand (single store, `src/store/useAppStore.js`)                                                     |
| Styling                | Inline styles + design tokens (`src/theme/tokens.js`), no CSS framework                                |
| Persistence            | `localStorage` via a storage adapter (`src/api/storage.js`)                                            |
| Quiz generation        | Anthropic API via a Vercel serverless function (`api/quiz.js`), with an offline fallback bank          |
| Unit/integration tests | Vitest + React Testing Library                                                                         |
| Component catalogue    | Storybook 8 (with the a11y addon)                                                                      |
| E2E tests              | Cypress 13 + `cypress-axe` (WCAG 2.1 AA) + `@testing-library/cypress`                                  |
| Visual regression      | Percy                                                                                                  |
| Linting/formatting     | ESLint (flat config, zero warnings) + Prettier                                                         |
| CI/CD                  | GitHub Actions (lint, tests+coverage, build, Storybook, E2E, Percy, Lighthouse, CodeQL, Vercel deploy) |
| Hosting                | Vercel                                                                                                 |

## Getting started

Requires Node.js >= 18.18.

```bash
npm ci          # install exact dependency versions from package-lock.json
npm run dev     # start the Vite dev server
```

Open the printed local URL. The app works fully offline — there is no
required backend. To enable AI-generated quizzes, copy `.env.example` to
`.env.local` and set `ANTHROPIC_API_KEY` (used only by the serverless
function in `api/quiz.js`, never exposed to the browser).

## Available scripts

| Script                                  | Purpose                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`                           | Start the dev server                                                             |
| `npm run build`                         | Production build to `dist/`                                                      |
| `npm run preview`                       | Serve the production build locally on port 4173                                  |
| `npm run lint`                          | ESLint, zero warnings allowed                                                    |
| `npm run lint:fix`                      | ESLint with `--fix`                                                              |
| `npm run format` / `format:check`       | Prettier write / check                                                           |
| `npm test` / `test:watch`               | Vitest unit & integration tests                                                  |
| `npm run test:coverage`                 | Vitest with coverage thresholds (≥95% statements/functions/lines, ≥90% branches) |
| `npm run storybook` / `build-storybook` | Component catalogue (dev / static build)                                         |
| `npm run cypress:open` / `cypress:run`  | Cypress interactively / headless                                                 |
| `npm run e2e`                           | Build-equivalent preview + full Cypress suite                                    |
| `npm run e2e:percy`                     | Same, with Percy visual snapshots (requires `PERCY_TOKEN`)                       |

## Project structure

```
src/
  api/          # storage adapter (localStorage) and quiz client
  components/   # one file per screen/UI component, with .test.jsx and .stories.jsx siblings
  data/         # static content: tiers/modules, industries, badges, levels, fallback quiz bank
  observability/# error tracking + Core Web Vitals reporting hooks
  store/        # Zustand store — all app state and mutations
  theme/        # design tokens, global styles, icon resolution
  utils/        # pure helpers (XP/level math)
api/
  quiz.js       # Vercel serverless function proxying quiz generation
cypress/        # E2E specs, support commands, Percy config
.storybook/     # Storybook configuration and global decorators
docs/           # architecture, runbook, deployment checklist
```

## Quality gates

Every pull request into `main` runs:

- **Lint & format** — ESLint with zero warnings, Prettier check
- **Unit/integration tests** — Vitest + RTL, coverage thresholds enforced (95% statements/functions/lines, 90% branches)
- **Production build** — `vite build`
- **Storybook build** — every component has a story; a11y addon flags WCAG issues at dev time
- **E2E** — Cypress across auth, learning journey, and facilitator flows, plus a dedicated `cypress-axe` WCAG 2.1 AA suite
- **Visual regression** — Percy snapshots (when `PERCY_TOKEN` is configured)
- **Lighthouse CI** — performance, accessibility, best practices, and SEO each ≥ 90
- **CodeQL** — static security analysis

Merging to `main` requires 2 approving reviews (branch protection — see
[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)).

## Further reading

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system design, key decisions and trade-offs, roadmap
- [docs/RUNBOOK.md](docs/RUNBOOK.md) — operations: environment variables, observability, common issues
- [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) — one-time setup for GitHub, Vercel, Percy, Sentry
- [CHANGELOG.md](CHANGELOG.md) — release history
