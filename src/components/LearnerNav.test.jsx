import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LearnerNav from "./LearnerNav.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { getTotalModuleCount } from "../data/tiers.js";
import { getLevel, getNextLevel, getLevelProgressPct } from "../utils/xp.js";

const TEST_USER = {
  name: "Thabo Serame",
  industry: "Mining & Resources",
  progress: [],
  xp: 350,
  badges: [],
  streak: 5,
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

describe("LearnerNav", () => {
  it("renders nothing when there is no user", () => {
    const { container } = render(<LearnerNav />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the learner's level, XP progress, and streak", () => {
    resetStore({ user: TEST_USER });
    render(<LearnerNav />);

    const level = getLevel(TEST_USER.xp);
    const next = getNextLevel(TEST_USER.xp);
    const pct = getLevelProgressPct(TEST_USER.xp);

    expect(screen.getByText(level.name)).toBeInTheDocument();
    expect(screen.getByText(`${TEST_USER.xp} XP / ${next.min} XP`)).toBeInTheDocument();
    expect(screen.getByText(String(TEST_USER.streak))).toBeInTheDocument();

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", String(pct));
    expect(bar).toHaveAttribute("aria-label", `${pct}% progress toward ${next.name}`);
  });

  it("marks the active screen with aria-current", () => {
    resetStore({ user: TEST_USER, screen: { screen: "facilitator" } });
    render(<LearnerNav />);

    expect(screen.getByRole("button", { name: "Facilitator" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });

  it("navigates when a nav button is clicked", async () => {
    resetStore({ user: TEST_USER, screen: { screen: "dashboard" } });
    render(<LearnerNav />);

    await userEvent.click(screen.getByRole("button", { name: "Certificates" }));

    expect(useAppStore.getState().screen).toEqual({ screen: "certificate", params: {} });
  });

  it("logs the user out when 'Log out' is clicked", async () => {
    resetStore({ user: TEST_USER, screen: { screen: "dashboard" } });
    render(<LearnerNav />);

    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().screen).toEqual({ screen: "login" });
  });

  it("navigates to the dashboard when the logo is clicked", async () => {
    resetStore({ user: TEST_USER, screen: { screen: "facilitator" } });
    render(<LearnerNav />);

    await userEvent.click(screen.getByRole("button", { name: "CapabilityOS" }));

    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard", params: {} });
  });

  it("navigates to the dashboard when the Dashboard nav button is clicked", async () => {
    resetStore({ user: TEST_USER, screen: { screen: "facilitator" } });
    render(<LearnerNav />);

    await userEvent.click(screen.getByRole("button", { name: "Dashboard" }));

    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard", params: {} });
  });

  it("navigates to the facilitator view when the Facilitator nav button is clicked", async () => {
    resetStore({ user: TEST_USER, screen: { screen: "dashboard" } });
    render(<LearnerNav />);

    await userEvent.click(screen.getByRole("button", { name: "Facilitator" }));

    expect(useAppStore.getState().screen).toEqual({ screen: "facilitator", params: {} });
  });

  it("shows 'max level' and hides the next-level XP target once the learner reaches the top level", () => {
    const maxLevelUser = { ...TEST_USER, xp: 5000 };
    resetStore({ user: maxLevelUser });
    render(<LearnerNav />);

    const pct = getLevelProgressPct(maxLevelUser.xp);
    expect(getNextLevel(maxLevelUser.xp)).toBeNull();

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", String(pct));
    expect(bar).toHaveAttribute("aria-label", `${pct}% progress toward max level`);
    expect(screen.getByText(`${maxLevelUser.xp} XP`)).toBeInTheDocument();
  });
});
