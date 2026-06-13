/**
 * Custom Cypress commands for CapabilityOS.
 */

/**
 * Sign in (or resume) as a learner via the UI. CapabilityOS has no real
 * authentication backend in this scaffold — entering a name either creates
 * a fresh profile or resumes an existing one with the same name (see
 * `src/store/useAppStore.js` `login`).
 *
 * @param {string} name
 * @param {string} [industry] - Must match an option in `src/data/industries.js`
 */
Cypress.Commands.add("login", (name, industry) => {
  cy.visit("/");
  cy.findByLabelText(/full name/i)
    .clear()
    .type(name);
  if (industry) {
    cy.findByLabelText(/industry/i).select(industry);
  }
  cy.findByRole("button", { name: /continue/i }).click();
  cy.findByRole("heading", { name: new RegExp(`welcome back`, "i") }).should("be.visible");
});

/**
 * Clear all learner data so each test starts from a clean slate.
 * CapabilityOS persists state to `localStorage` (see `src/api/storage.js`).
 */
Cypress.Commands.add("resetApp", () => {
  cy.clearLocalStorage();
});
