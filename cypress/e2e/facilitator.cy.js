describe("Facilitator dashboard", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.login("Facilitator Tester", "Education & Training");
    cy.findByRole("button", { name: /facilitator/i }).click();
    cy.findByRole("heading", { name: /facilitator dashboard/i }).should("be.visible");
  });

  it("shows the cohort table with the highest-XP learner selected by default", () => {
    cy.findByRole("cell", { name: "Nomsa Khumalo" }).should("be.visible");
    cy.findByRole("cell", { name: "James Okonkwo" }).should("be.visible");

    cy.findByRole("heading", { name: /notes — nomsa khumalo/i }).should("be.visible");
    cy.contains("No notes yet.").should("be.visible");

    cy.percySnapshot("Facilitator dashboard - default selection");
  });

  it("switches the notes panel when another learner is selected", () => {
    cy.findByText("James Okonkwo").click();
    cy.findByRole("heading", { name: /notes — james okonkwo/i }).should("be.visible");
  });

  it("lets a facilitator add a note for the selected learner", () => {
    cy.findByText("Sarah Dlamini").click();
    cy.findByRole("heading", { name: /notes — sarah dlamini/i }).should("be.visible");

    cy.findByRole("button", { name: /add note/i }).should("be.disabled");

    cy.findByLabelText(/add a note for sarah dlamini/i).type(
      "Strong progress this week — keep encouraging.",
    );
    cy.findByRole("button", { name: /add note/i })
      .should("not.be.disabled")
      .click();

    cy.contains("Strong progress this week — keep encouraging.").should("be.visible");
    cy.contains("No notes yet.").should("not.exist");

    cy.percySnapshot("Facilitator dashboard - note added");
  });

  it("returns to the learner dashboard via Back", () => {
    cy.findByRole("button", { name: /^back$/i }).click();
    cy.findByRole("heading", { name: /welcome back/i }).should("be.visible");
  });
});
