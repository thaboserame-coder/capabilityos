import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { useAppStore } from "./store/useAppStore.js";
import { getTotalModuleCount, TIERS } from "./data/tiers.js";

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
    screen: { screen: "login" },
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

describe("App", () => {
  it("shows the login screen when no user is signed in", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /capabilityos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("signs a learner in and shows the dashboard with navigation", async () => {
    render(<App />);

    await userEvent.type(screen.getByLabelText(/full name/i), "Thabo Serame");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /welcome back, thabo/i })).toBeInTheDocument();
  });

  it("renders the facilitator dashboard when the screen is 'facilitator'", () => {
    resetStore({ user: BASE_USER, screen: { screen: "facilitator" } });
    render(<App />);

    expect(screen.getByRole("heading", { name: /facilitator dashboard/i })).toBeInTheDocument();
  });

  it("renders the tier view when the screen is 'tier'", () => {
    const tier = TIERS[0];
    resetStore({ user: BASE_USER, screen: { screen: "tier", params: { tierId: tier.id } } });
    render(<App />);

    expect(screen.getByRole("heading", { name: tier.name })).toBeInTheDocument();
  });

  it("renders the certificates overview when the screen is 'certificate'", () => {
    resetStore({ user: BASE_USER, screen: { screen: "certificate", params: {} } });
    render(<App />);

    expect(screen.getByRole("heading", { name: "Certificates" })).toBeInTheDocument();
  });
});
