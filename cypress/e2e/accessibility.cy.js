/**
 * WCAG 2.1 AA checks via cypress-axe, covering the primary screens a
 * learner and facilitator move through. Each check runs after the screen's
 * key content is visible so axe doesn't flag transient loading states.
 */
describe("Accessibility (WCAG 2.1 AA)", () => {
  beforeEach(() => {
    cy.resetApp();
  });

  it("login screen has no detectable violations", () => {
    cy.visit("/");
    cy.findByRole("heading", { name: /capabilityos/i }).should("be.visible");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("learner dashboard has no detectable violations", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("tier view has no detectable violations", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.findByText("AI Executive").click();
    cy.findByRole("heading", { name: "AI Executive" }).should("be.visible");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("module view has no detectable violations", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.findByText("AI Executive").click();
    cy.findByText("1. The AI mandate: why boards can no longer delegate").click();
    cy.findByRole("heading", { name: /the ai mandate/i }).should("be.visible");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("quiz view has no detectable violations once loaded", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.findByText("AI Executive").click();
    cy.findByText("1. The AI mandate: why boards can no longer delegate").click();
    cy.findByRole("button", { name: /take the quiz/i }).click();
    // Wait for the question list to render before injecting axe.
    cy.get("ol > li").should("have.length.greaterThan", 0);
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("certificates overview has no detectable violations", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.findByRole("button", { name: /certificates/i }).click();
    cy.findByRole("heading", { name: /certificates/i }).should("be.visible");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });

  it("facilitator dashboard has no detectable violations", () => {
    cy.login("Accessibility Tester", "Healthcare & Life Sciences");
    cy.findByRole("button", { name: /facilitator/i }).click();
    cy.findByRole("heading", { name: /facilitator dashboard/i }).should("be.visible");
    cy.injectAxe();
    cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
  });
});
