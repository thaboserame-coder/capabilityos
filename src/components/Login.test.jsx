import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { getTotalModuleCount } from "../data/tiers.js";

function resetStore() {
  window.localStorage.clear();
  useAppStore.setState({
    screen: { screen: "login" },
    navStack: [],
    user: null,
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
  });
}

beforeEach(resetStore);

describe("Login", () => {
  it("renders the sign-in form", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: /capabilityos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows a validation error when submitted without a name", async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/enter your name/i);
    expect(useAppStore.getState().user).toBeNull();
  });

  it("logs the learner in with a trimmed name and chosen industry", async () => {
    render(<Login />);

    await userEvent.type(screen.getByLabelText(/full name/i), "  Thabo Serame  ");
    await userEvent.selectOptions(screen.getByLabelText(/industry/i), "Mining & Resources");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    const { user, screen: currentScreen } = useAppStore.getState();
    expect(user.name).toBe("Thabo Serame");
    expect(user.industry).toBe("Mining & Resources");
    expect(currentScreen).toEqual({ screen: "dashboard" });
  });
});
