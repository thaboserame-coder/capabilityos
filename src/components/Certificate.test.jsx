import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Certificate from "./Certificate.jsx";
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
    screen: { screen: "certificate", params: {} },
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

describe("Certificate", () => {
  it("renders nothing when there is no user", () => {
    const { container } = render(<Certificate />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists every tier with its lock status when no tier is selected", () => {
    const completedTier = TIERS[0];
    const user = { ...BASE_USER, progress: completedTier.mods.map((m) => m.id) };
    resetStore({ user, screen: { screen: "certificate", params: {} } });
    render(<Certificate />);

    expect(screen.getByRole("heading", { name: "Certificates" })).toBeInTheDocument();

    const unlockedButton = screen.getByText(completedTier.name).closest("button");
    expect(unlockedButton).not.toBeDisabled();
    expect(screen.getByText("Certificate unlocked — select to view")).toBeInTheDocument();

    const lockedTier = TIERS[1];
    const lockedButton = screen.getByText(lockedTier.name).closest("button");
    expect(lockedButton).toBeDisabled();
    expect(screen.getByText(`0 / ${lockedTier.mods.length} modules complete`)).toBeInTheDocument();
  });

  it("navigates to a tier's certificate when its unlocked card is clicked", async () => {
    const completedTier = TIERS[0];
    const user = { ...BASE_USER, progress: completedTier.mods.map((m) => m.id) };
    resetStore({ user, screen: { screen: "certificate", params: {} } });
    render(<Certificate />);

    await userEvent.click(screen.getByText(completedTier.name).closest("button"));

    expect(useAppStore.getState().screen).toEqual({
      screen: "certificate",
      params: { tierId: completedTier.id },
    });
  });

  it("shows a locked message when the selected tier isn't complete yet", async () => {
    const tier = TIERS[0];
    resetStore({
      user: { ...BASE_USER },
      navStack: [{ screen: "dashboard" }],
      screen: { screen: "certificate", params: { tierId: tier.id } },
    });
    render(<Certificate />);

    expect(
      screen.getByText(new RegExp(`Complete every module in ${tier.name}`, "i")),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard" });
  });

  it("renders the certificate card when the selected tier is complete", () => {
    const tier = TIERS[0];
    resetStore({
      user: { ...BASE_USER, progress: tier.mods.map((m) => m.id) },
      screen: { screen: "certificate", params: { tierId: tier.id } },
    });
    render(<Certificate />);

    expect(screen.getByRole("heading", { name: "Certificate of Completion" })).toBeInTheDocument();
    expect(screen.getByText(BASE_USER.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(tier.name))).toBeInTheDocument();
  });
});
