# Architecture

## From prototype to production

The original CapabilityOS was a single 777-line `.jsx` file: all screens,
state, styling, and content in one component tree, with state threaded
through `useState` and prop drilling 5–6 levels deep. It worked, but it was
unreviewable (one diff touches everything), untestable in isolation, and had
no quality gates.

This rewrite keeps the **same product** — same screens, same content, same
visual design — and restructures it along conventional boundaries so each
piece can be built, tested, and reviewed independently:

```
src/data/      → content & domain data (no React, no side effects)
src/theme/     → design tokens, global styles, icon resolution
src/api/       → I/O boundary (localStorage adapter, quiz client)
src/store/     → application state + mutations (Zustand)
src/components/→ one screen/component per file, each with .test.jsx + .stories.jsx
src/utils/     → pure functions (XP/level math)
src/observability/ → error tracking + web vitals integration points
```

This is a pragmatic application of Domain-Driven Design boundaries
(domain/content vs. application state vs. presentation vs. I/O) without
introducing a framework or folder-per-feature scheme the team would need to
learn — every import in `src/components/*.jsx` makes the dependency
direction explicit: components depend on `store`, `data`, and `theme`; never
the reverse.

## State management

All application state lives in a single Zustand store
(`src/store/useAppStore.js`): the current screen/nav stack, the logged-in
learner's profile, the facilitator cohort board, per-learner notes, and the
active toast. Components subscribe only to the slices of state they read
(`useAppStore((state) => state.user)`), so an XP change re-renders the nav
badge and dashboard but not, say, the quiz in progress.

**Why Zustand over Redux or Context:** no reducer/action boilerplate (state
and the functions that mutate it live together, which keeps "fix at the
root" easy — there is exactly one place `completeModule` can be implemented);
selector-based subscriptions avoid the re-render storms a single
`Context.Provider` would cause at this granularity; and the store is plain
JS, so `src/store/useAppStore.test.js` exercises every mutation without
rendering React at all.

The full rationale is documented in the JSDoc block at the top of
`useAppStore.js`, including the migration path to per-feature stores if
CapabilityOS is split into independently-deployed micro-frontends.

## Routing

CapabilityOS uses a **screen-switch router**: `App.jsx`'s `ScreenSwitch`
renders one of `LearnerDashboard | TierView | ModuleView | Quiz | Certificate
| FacilitatorDashboard` based on `store.screen.screen`, with `navigateTo` /
`goBack` maintaining a small in-memory nav stack.

**Trade-off, explicit:** there are no deep-linkable URLs — refreshing the
page always returns to the dashboard (the learner's _progress_ is restored
from `localStorage`, but not their _position_ in the UI). This was a
deliberate choice to avoid adding React Router for a single-tenant,
single-session learning app where every screen is reached via in-app
navigation.

**When to revisit:** if facilitators need to share a link to a specific
learner's certificate, or learners need browser back/forward to feel native,
migrate `navigateTo(screen, params)` calls to `navigate(path)` from React
Router and derive `screen.screen`/`screen.params` from `useParams()` — the
store's `screen`/`navStack` shape was kept URL-shaped (`{screen, params}`)
specifically to make this a mechanical change rather than a rewrite.

## Persistence and the I/O boundary

`src/api/storage.js` is the only module that touches `localStorage`. Every
other module reads/writes through `loadUser`, `saveUser`, `getBoard`,
`updateBoard`, `getNotes`, and `saveNote`. This means:

- Component and store tests can run in `jsdom` without a real browser.
- Swapping `localStorage` for a real backend (REST API, Supabase, etc.) is a
  one-file change — the store's call sites don't change, only
  `storage.js`'s implementations (which would become `async`; the store
  would then need to handle loading states, tracked as a roadmap item below).

There is **no authentication**: a learner's name doubles as their identifier.
This is appropriate for an internal pilot/demo but is the first thing to
replace before a multi-tenant launch — see "Roadmap".

## Quiz generation and the serverless boundary

`src/api/quizClient.js` calls `/api/quiz` (a Vercel serverless function,
`api/quiz.js`), which proxies to the Anthropic API using a server-side
`ANTHROPIC_API_KEY`. The key never reaches the browser. If the function is
unavailable, returns a non-200, or `ANTHROPIC_API_KEY` is unset (503), the
client transparently falls back to the static question bank in
`src/data/fallbackQuiz.js` — the learning experience is fully functional
without any AI backend configured, which is also why Storybook and Cypress
(which run with no `/api` routes available) work without mocking.

## Testing strategy

The test pyramid mirrors the layers above:

- **Pure functions** (`src/utils/xp.js`, `src/data/*`) — plain Vitest, no
  rendering.
- **Store** (`src/store/useAppStore.test.js`) — exercises every action
  against a real (in-memory `localStorage`) storage adapter.
- **Components** (`src/components/*.test.jsx`) — Vitest + React Testing
  Library, seeding the store via `resetStore()`/`setState` and asserting on
  rendered output and user interactions.
- **Component catalogue** (`src/components/*.stories.jsx`) — Storybook
  stories cover each component's significant states (empty, in-progress,
  complete, not-found, error) and double as visual documentation; several
  include `play` functions that exercise interactions and are checked by the
  a11y addon.
- **End-to-end** (`cypress/e2e/*.cy.js`) — full user journeys (auth, learning
  journey, facilitator) against the production build, plus a dedicated
  `accessibility.cy.js` that runs `cypress-axe` (WCAG 2.1 AA) on every major
  screen.
- **Visual regression** (Percy, via `.percy.yml` and the E2E suite) —
  snapshots at 1280px and 768px widths with animations frozen.

Coverage thresholds (95% statements/functions/lines, 90% branches — see
`vite.config.js`) are enforced in CI and fail the build if not met.

## Accessibility

Accessibility is checked at four layers, each catching different classes of
issue:

1. **Static**: `eslint-plugin-jsx-a11y` (build-time, via `eslint.config.js`).
2. **Dev-time**: `@axe-core/react`, wired into `src/main.jsx` (development
   builds only), logs live WCAG violations to the console as you use the app.
3. **Component-level**: Storybook's `addon-a11y` runs axe against every story.
4. **End-to-end**: `cypress-axe` runs against the real rendered app for the
   login, dashboard, tier, module, quiz, certificate, and facilitator screens
   (`cypress/e2e/accessibility.cy.js`), targeting WCAG 2.1 A/AA.

## Observability

`src/observability/errorTracking.js` installs global `error` and
`unhandledrejection` handlers and exposes `captureException` for components
to call directly. `src/observability/webVitals.js` reports Core Web Vitals
(LCP, CLS, INP, FCP, TTFB) via `web-vitals`. Both are **integration points,
not full vendor integrations** — by default they log to the console in
development and, if `VITE_ERROR_ENDPOINT` / `VITE_ANALYTICS_ENDPOINT` are
set, POST to those endpoints. See [RUNBOOK.md](RUNBOOK.md) for wiring up a
real provider (e.g. Sentry, Datadog RUM).

## Security

- The only secret (`ANTHROPIC_API_KEY`) lives server-side in the Vercel
  function and is never sent to the client.
- `vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, and `Permissions-Policy` headers on every response.
- CodeQL runs weekly and on every PR/push to `main`.
- Dependabot keeps npm and GitHub Actions dependencies current
  (`.github/dependabot.yml`).

## Roadmap

Items intentionally **out of scope** for this scaffold, in rough priority
order for a production launch:

1. **Real authentication** — replace name-as-identifier with a proper
   identity provider (SSO/OAuth), and move learner profiles from
   `localStorage` to a backend database.
2. **URL-based routing** — see "Routing" above.
3. **Vendor observability integration** — Sentry/Datadog instead of the
   shim in `src/observability/`.
4. **Live CI verification, real usability testing (5 users), and stakeholder
   sign-off** — these require running accounts (Vercel/Percy/Sentry/GitHub)
   and human participants, and are tracked as setup tasks in
   [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) rather than code changes.
