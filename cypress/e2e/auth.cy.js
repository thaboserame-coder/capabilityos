describe("Authentication", () => {
  beforeEach(() => {
    cy.resetApp();
  });

  it("shows a validation error when submitting without a name", () => {
    cy.visit("/");
    cy.findByRole("heading", { name: /capabilityos/i }).should("be.visible");

    cy.findByRole("button", { name: /continue/i }).click();
    cy.findByRole("alert").should("contain.text", "Please enter your name to continue.");

    cy.percySnapshot("Login - validation error");
  });

  it("creates a new learner profile and lands on the dashboard", () => {
    cy.visit("/");
    cy.findByLabelText(/full name/i).type("Lerato Mahlangu");
    cy.findByLabelText(/industry/i).select("Technology & Software");
    cy.findByRole("button", { name: /continue/i }).click();

    cy.findByRole("heading", { name: /welcome back, lerato/i }).should("be.visible");
    cy.findByRole("navigation", { name: "Primary" }).should("be.visible");
    cy.contains("0 XP").should("be.visible");

    cy.percySnapshot("Learner dashboard - new learner");
  });

  it("resumes an existing learner's progress when they sign in again with the same name", () => {
    cy.login("Resuming Learner", "Agriculture");

    // Complete the first module of Tier 1 so there's saved progress.
    cy.findByText("AI Executive").click();
    cy.findByText(/the ai mandate/i).click();
    cy.findByRole("button", { name: /mark as complete/i }).click();
    cy.findByRole("heading", { name: "Welcome back, Resuming" }).should("not.exist"); // sanity: still on module
    cy.findByRole("button", { name: /log out/i }).click();

    // Sign back in with the same name.
    cy.login("Resuming Learner", "Agriculture");
    cy.contains("100 XP").should("be.visible");
  });
});
