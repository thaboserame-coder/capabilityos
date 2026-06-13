// Cypress support file, loaded before every spec.

// Adds `cy.findByRole`, `cy.findByLabelText`, etc. (Testing Library queries,
// matching the queries used in the unit/integration test suite).
import "@testing-library/cypress/add-commands";

// Adds `cy.injectAxe()` / `cy.checkA11y()` for WCAG 2.1 AA checks in E2E.
import "cypress-axe";

// Adds `cy.percySnapshot()` for visual regression. No-ops locally unless run
// via `percy exec -- cypress run` with PERCY_TOKEN set (see package.json).
import "@percy/cypress";

import "./commands";
