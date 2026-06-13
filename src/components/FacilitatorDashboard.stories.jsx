import { expect, userEvent, within } from "@storybook/test";
import { createTestUser } from "../test/fixtures.js";
import FacilitatorDashboard from "./FacilitatorDashboard.jsx";

export default {
  title: "Components/FacilitatorDashboard",
  component: FacilitatorDashboard,
  parameters: { layout: "fullscreen" },
};

const baseStoreState = {
  user: createTestUser({ name: "Facilitator Tester", industry: "Education & Training" }),
  screen: { screen: "facilitator" },
};

export const Default = {
  name: "Default cohort view (first learner selected, no notes)",
  parameters: { storeState: baseStoreState },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Nomsa Khumalo")).toBeInTheDocument();
    await expect(canvas.getByText("James Okonkwo")).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: /notes — nomsa khumalo/i }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("No notes yet.")).toBeInTheDocument();
  },
};

export const WithExistingNotes = {
  name: "Learner with existing notes",
  parameters: {
    storeState: {
      ...baseStoreState,
      notesByLearner: {
        "Sarah Dlamini": [
          {
            id: "n1",
            text: "Strong progress in Tier 1 — ready for the AI Executive track.",
            createdAt: new Date("2026-05-01T09:00:00Z").toISOString(),
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Sarah Dlamini"));
    await expect(
      canvas.getByRole("heading", { name: /notes — sarah dlamini/i }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(/strong progress in tier 1/i)).toBeInTheDocument();
  },
};

export const AddingANote = {
  name: "Selecting a learner and drafting a note",
  parameters: { storeState: baseStoreState },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Sarah Dlamini"));
    const textarea = canvas.getByLabelText(/add a note for sarah dlamini/i);
    await userEvent.type(textarea, "Follow up about the AI mandate module next session.");
    await expect(canvas.getByRole("button", { name: /add note/i })).toBeEnabled();
  },
};
