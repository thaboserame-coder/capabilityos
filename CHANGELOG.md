# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — Production-ready rewrite

Rewrite of the original single-file prototype into a hardened, production-ready
platform. Product behavior (screens, content, gamification, visual design) is
unchanged; everything else is new.

### Added

- Layered architecture: `src/data`, `src/theme`, `src/api`, `src/store`,
  `src/components`, `src/utils`, `src/observability` (see
  `docs/ARCHITECTURE.md`).
- Zustand-based application state (`src/store/useAppStore.js`), replacing
  prop-drilled `useState`.
- PropTypes and JSDoc type annotations across all components and modules.
- ESLint (flat config, zero warnings) + Prettier, with Storybook and Cypress
  rule sets.
- Vitest + React Testing Library unit/integration test suite with enforced
  coverage thresholds (95% statements/functions/lines, 90% branches).
- Storybook 8 component catalogue (`addon-essentials`, `addon-a11y`,
  `addon-interactions`) with stories for every component.
- Cypress 13 E2E suite: authentication, learning journey, facilitator
  dashboard, and a dedicated `cypress-axe` WCAG 2.1 AA accessibility suite.
- Percy visual regression configuration (`.percy.yml`,
  `npm run e2e:percy`).
- GitHub Actions workflows: CI (lint/test/build/Storybook), E2E + Percy,
  Lighthouse CI (performance/accessibility/best-practices/SEO ≥ 90), CodeQL,
  and Vercel deployment.
- `vercel.json` with SPA rewrites and security headers; `.env.example`
  documenting all environment variables.
- `@axe-core/react` wired into `src/main.jsx` for dev-time accessibility
  warnings.
- Documentation suite: `README.md`, `docs/ARCHITECTURE.md`,
  `docs/RUNBOOK.md`, `docs/DEPLOYMENT_CHECKLIST.md`, this changelog.
- `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md`, and
  `.github/dependabot.yml` supporting the 2-approval review policy.

### Changed

- Quiz generation moved from (implicit) direct client calls to a Vercel
  serverless proxy (`api/quiz.js`) so the Anthropic API key is never exposed
  to the browser, with a documented offline fallback.

[Unreleased]: #
[0.1.0]: #
