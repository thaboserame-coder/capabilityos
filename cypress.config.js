import { defineConfig } from "cypress";

/**
 * Cypress E2E configuration.
 *
 * Tests run against the production build served by `vite preview`
 * (see `npm run e2e`, which uses `start-server-and-test`). This ensures
 * E2E coverage exercises the same bundle that gets deployed, not the
 * dev server with HMR middleware.
 */
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
