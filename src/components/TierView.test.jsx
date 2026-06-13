import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TierView from "./TierView.jsx";
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
    screen: { screen: "tier", params: {} },
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

describe("TierView", () => {
  it("shows a not-found message and dashboard link when the tier doesn't exist", async () => {
    resetStore({ user: BASE_USER, screen: { screen: "tier", params: { tierId: "nope" } } });
    render(<TierView />);

    expect(screen.getByText("Tier not found.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /back to dashboard/i }));
    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard", params: {} });
  });

  it("lists modules with their completion state", () => {
    const tier = TIERS[0];
    resetStore({
      user: { ...BASE_USER, progress: [tier.mods[0].id] },
      screen: { screen: "tier", params: { tierId: tier.id } },
    });
    render(<TierView />);

    expect(screen.getByRole("heading", { name: tier.name })).toBeInTheDocument();
    expect(screen.getByText(`1. ${tier.mods[0].title}`)).toBeInTheDocument();
    expect(screen.getByText(`2. ${tier.mods[1].title}`)).toBeInTheDocument();
  });

  it("navigates to a module when its row is clicked", async () => {
    const tier = TIERS[0];
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "tier", params: { tierId: tier.id } },
    });
    render(<TierView />);

    await userEvent.click(screen.getByText(`1. ${tier.mods[0].title}`).closest("button"));

    expect(useAppStore.getState().screen).toEqual({
      screen: "module",
      params: { tierId: tier.id, moduleId: tier.mods[0].id },
    });
  });

  it("shows a certificate-ready banner once every module in the tier is complete", async () => {
    const tier = TIERS[2];
    resetStore({
      user: { ...BASE_USER, progress: tier.mods.map((m) => m.id) },
      screen: { screen: "tier", params: { tierId: tier.id } },
    });
    render(<TierView />);

    expect(
      screen.getByText(new RegExp(`completed every module in ${tier.name}`, "i")),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /view certificate/i }));
    expect(useAppStore.getState().screen).toEqual({
      screen: "certificate",
      params: { tierId: tier.id },
    });
  });

  it("calls goBack when the back button is clicked", async () => {
    const tier = TIERS[0];
    resetStore({
      user: { ...BASE_USER },
      navStack: [{ screen: "dashboard" }],
      screen: { screen: "tier", params: { tierId: tier.id } },
    });
    render(<TierView />);

    await userEvent.click(screen.getByRole("button", { name: /^back$/i }));

    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard" });
    expect(useAppStore.getState().navStack).toEqual([]);
  });
});
