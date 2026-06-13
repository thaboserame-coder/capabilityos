describe("Learning journey", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.login("Journey Learner", "Technology & Software");
  });

  it("lets a learner open a module, mark it complete, and earn XP", () => {
    cy.findByText("AI Executive").click();
    cy.findByRole("heading", { name: "AI Executive" }).should("be.visible");

    cy.findByText("1. The AI mandate: why boards can no longer delegate").click();
    cy.findByRole("heading", { name: /the ai mandate/i }).should("be.visible");

    cy.percySnapshot("Module view - before completion");

    cy.findByRole("button", { name: /mark as complete/i }).click();
    cy.findByText("Completed").should("be.visible");

    // XP toast confirms the store updated.
    cy.contains("+100 XP").should("be.visible");

    cy.findByRole("button", { name: /back to ai executive/i }).click();
    cy.findByRole("progressbar", { name: /1 of \d+ modules complete/ }).should("exist");
  });

  it("takes a quiz and reaches the results screen", () => {
    cy.findByText("AI Executive").click();
    cy.findByText("1. The AI mandate: why boards can no longer delegate").click();
    cy.findByRole("button", { name: /take the quiz/i }).click();

    cy.findByRole("heading", { name: /the ai mandate/i }).should("be.visible");

    // Answer every question (pick the first option each time — fallback
    // questions are randomized, so we only assert the result shape, not
    // pass/fail).
    cy.get("ol > li").each(($question) => {
      cy.wrap($question).find("button.qopt").first().click();
    });

    cy.percySnapshot("Quiz - all answered");

    cy.findByRole("button", { name: /submit answers/i }).click();
    cy.contains(/^\d+ \/ \d+ correct$/).should("be.visible");
    cy.findByRole("button", { name: /back to module/i }).should("be.visible");

    cy.percySnapshot("Quiz - results");
  });

  it("navigates between modules using Previous and Next", () => {
    cy.findByText("AI Executive").click();
    cy.findByText("1. The AI mandate: why boards can no longer delegate").click();

    cy.findByRole("button", { name: /next/i }).should("be.visible");
    cy.findByRole("button", { name: /previous/i }).should("not.exist");

    cy.findByRole("button", { name: /next/i }).click();
    cy.findByRole("button", { name: /previous/i }).should("be.visible");
  });
});
