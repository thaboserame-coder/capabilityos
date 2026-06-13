import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModuleView from "./ModuleView.jsx";
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

const tier = TIERS[0];
const firstMod = tier.mods[0];
const lastMod = tier.mods[tier.mods.length - 1];

function resetStore(overrides = {}) {
  window.localStorage.clear();
  useAppStore.setState({
    screen: { screen: "module", params: {} },
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

describe("ModuleView", () => {
  it("shows a not-found message and dashboard link when the module doesn't exist", async () => {
    resetStore({
      user: BASE_USER,
      screen: { screen: "module", params: { tierId: tier.id, moduleId: "nope" } },
    });
    render(<ModuleView />);

    expect(screen.getByText("Module not found.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /back to dashboard/i }));
    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard", params: {} });
  });

  it("renders the module content and lets the learner mark it complete", async () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    expect(screen.getByRole("heading", { name: firstMod.title })).toBeInTheDocument();
    expect(screen.getByText(`${tier.level} · Module 1 of ${tier.mods.length}`)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /mark as complete/i }));

    expect(useAppStore.getState().user.progress).toContain(firstMod.id);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows 'Completed' without a complete button when the module is already done", () => {
    resetStore({
      user: { ...BASE_USER, progress: [firstMod.id] },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mark as complete/i })).not.toBeInTheDocument();
  });

  it("navigates to the quiz when 'Take the quiz' is clicked", async () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    await userEvent.click(screen.getByRole("button", { name: /take the quiz/i }));

    expect(useAppStore.getState().screen).toEqual({
      screen: "quiz",
      params: { tierId: tier.id, moduleId: firstMod.id },
    });
  });

  it("only shows a 'Next' link for the first module", () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
  });

  it("only shows a 'Previous' link for the last module", () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: lastMod.id } },
    });
    render(<ModuleView />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^next$/i })).not.toBeInTheDocument();
  });

  it("navigates to the next module when 'Next' is clicked", async () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(useAppStore.getState().screen).toEqual({
      screen: "module",
      params: { tierId: tier.id, moduleId: tier.mods[1].id },
    });
  });

  it("navigates to the previous module when 'Previous' is clicked", async () => {
    resetStore({
      user: { ...BASE_USER },
      screen: { screen: "module", params: { tierId: tier.id, moduleId: lastMod.id } },
    });
    render(<ModuleView />);

    await userEvent.click(screen.getByRole("button", { name: /previous/i }));

    expect(useAppStore.getState().screen).toEqual({
      screen: "module",
      params: { tierId: tier.id, moduleId: tier.mods[tier.mods.length - 2].id },
    });
  });

  it("calls goBack when the back-to-tier button is clicked", async () => {
    resetStore({
      user: { ...BASE_USER },
      navStack: [{ screen: "tier", params: { tierId: tier.id } }],
      screen: { screen: "module", params: { tierId: tier.id, moduleId: firstMod.id } },
    });
    render(<ModuleView />);

    await userEvent.click(
      screen.getByRole("button", { name: new RegExp(`back to ${tier.name}`, "i") }),
    );

    expect(useAppStore.getState().screen).toEqual({ screen: "tier", params: { tierId: tier.id } });
  });
});
