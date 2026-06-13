import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FacilitatorDashboard from "./FacilitatorDashboard.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { getTotalModuleCount } from "../data/tiers.js";
import { DEMO_COHORT } from "../data/demoCohort.js";

const BASE_USER = {
  name: "Thabo Serame",
  industry: "Mining & Resources",
  progress: [],
  xp: 0,
  badges: [],
  streak: 0,
  last: new Date().toISOString(),
  perfectQuizzes: 0,
};

function resetStore(overrides = {}) {
  window.localStorage.clear();
  useAppStore.setState({
    screen: { screen: "facilitator" },
    navStack: [],
    user: { ...BASE_USER },
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
    ...overrides,
  });
}

beforeEach(() => resetStore());

describe("FacilitatorDashboard", () => {
  it("renders every learner in the cohort, sorted by XP", () => {
    render(<FacilitatorDashboard />);

    for (const learner of DEMO_COHORT) {
      expect(screen.getByText(learner.name)).toBeInTheDocument();
    }

    const rows = screen.getAllByRole("row").slice(1); // skip header row
    const sortedByXp = [...DEMO_COHORT].sort((a, b) => b.xp - a.xp);
    expect(within(rows[0]).getByText(sortedByXp[0].name)).toBeInTheDocument();
  });

  it("selects the highest-XP learner by default and shows their notes panel", () => {
    render(<FacilitatorDashboard />);

    const topLearner = [...DEMO_COHORT].sort((a, b) => b.xp - a.xp)[0];
    expect(screen.getByRole("heading", { name: `Notes — ${topLearner.name}` })).toBeInTheDocument();
    expect(screen.getByText("No notes yet.")).toBeInTheDocument();
  });

  it("switches the notes panel when a different learner is selected", async () => {
    render(<FacilitatorDashboard />);

    const otherLearner = DEMO_COHORT.find((l) => l.name !== "Nomsa Khumalo");
    await userEvent.click(screen.getByText(otherLearner.name).closest("tr"));

    expect(
      screen.getByRole("heading", { name: `Notes — ${otherLearner.name}` }),
    ).toBeInTheDocument();
  });

  it("adds a note for the selected learner", async () => {
    render(<FacilitatorDashboard />);

    const addButton = screen.getByRole("button", { name: /add note/i });
    expect(addButton).toBeDisabled();

    const textarea = screen.getByLabelText(/add a note for/i);
    await userEvent.type(textarea, "Great progress this week");
    expect(addButton).toBeEnabled();

    await userEvent.click(addButton);

    expect(screen.getByText("Great progress this week")).toBeInTheDocument();
    expect(screen.queryByText("No notes yet.")).not.toBeInTheDocument();
    expect(textarea).toHaveValue("");
  });

  it("calls goBack when the back button is clicked", async () => {
    resetStore({ user: { ...BASE_USER }, navStack: [{ screen: "dashboard" }] });
    render(<FacilitatorDashboard />);

    await userEvent.click(screen.getByRole("button", { name: /^back$/i }));

    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard" });
  });
});
