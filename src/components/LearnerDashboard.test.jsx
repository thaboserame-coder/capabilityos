import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LearnerDashboard from "./LearnerDashboard.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { getTotalModuleCount, TIERS } from "../data/tiers.js";

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
    screen: { screen: "dashboard" },
    navStack: [],
    user: null,
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
    ...overrides,
  });
}

beforeEach(() => resetStore());

describe("LearnerDashboard", () => {
  it("renders nothing when there is no user", () => {
    const { container } = render(<LearnerDashboard />);
    expect(container).toBeEmptyDOMElement();
  });

  it("greets the learner by first name and shows overall progress", () => {
    resetStore({ user: BASE_USER });
    render(<LearnerDashboard />);

    expect(screen.getByRole("heading", { name: /welcome back, thabo/i })).toBeInTheDocument();
    expect(
      screen.getByText(`0 of ${getTotalModuleCount()} modules complete · Mining & Resources`),
    ).toBeInTheDocument();
  });

  it("renders a tier card for every tier with progress information", () => {
    resetStore({ user: BASE_USER });
    render(<LearnerDashboard />);

    for (const tier of TIERS) {
      const card = screen.getByText(tier.name).closest("button");
      expect(
        within(card).getByRole("progressbar", {
          name: `0 of ${tier.mods.length} modules complete`,
        }),
      ).toBeInTheDocument();
    }
  });

  it("navigates to a tier when its card is clicked", async () => {
    resetStore({ user: BASE_USER });
    render(<LearnerDashboard />);

    const t1Card = screen.getByText(TIERS[0].name).closest("button");
    await userEvent.click(t1Card);

    expect(useAppStore.getState().screen).toEqual({
      screen: "tier",
      params: { tierId: TIERS[0].id },
    });
  });

  it("shows all badges, with earned badges visually distinguished", () => {
    const userWithBadge = { ...BASE_USER, progress: ["t1m1"], badges: ["first"] };
    resetStore({ user: userWithBadge });
    render(<LearnerDashboard />);

    expect(screen.getByText("First Steps")).toBeInTheDocument();
    expect(screen.getByText("Building Momentum")).toBeInTheDocument();

    const earnedBadge = screen.getByText("First Steps").closest("div[class]");
    expect(earnedBadge).toHaveClass("badge-pop");

    const unearnedBadge = screen.getByText("Building Momentum").closest("div[class]");
    expect(unearnedBadge).toBeNull();
  });
});
