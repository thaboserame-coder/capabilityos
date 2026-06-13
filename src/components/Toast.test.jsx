import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast from "./Toast.jsx";
import { useAppStore } from "../store/useAppStore.js";

function resetStore() {
  window.localStorage.clear();
  useAppStore.setState({ toast: null });
}

beforeEach(resetStore);

describe("Toast", () => {
  it("renders nothing when there is no toast", () => {
    const { container } = render(<Toast />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the toast message with an accessible status role", () => {
    useAppStore.setState({ toast: { id: "1", message: "Module complete!", variant: "success" } });
    render(<Toast />);
    expect(screen.getByRole("status")).toHaveTextContent("Module complete!");
  });

  it("renders a badge-style toast", () => {
    useAppStore.setState({
      toast: { id: "1", message: "Badge earned: First Steps", variant: "badge" },
    });
    render(<Toast />);
    expect(screen.getByRole("status")).toHaveTextContent("Badge earned: First Steps");
  });

  it("dismisses when the close button is clicked", async () => {
    useAppStore.setState({ toast: { id: "1", message: "Hello", variant: "info" } });
    render(<Toast />);

    await userEvent.click(screen.getByRole("button", { name: /dismiss notification/i }));

    expect(useAppStore.getState().toast).toBeNull();
  });

  it("auto-dismisses after the timeout", () => {
    vi.useFakeTimers();
    useAppStore.setState({ toast: { id: "1", message: "Hello", variant: "info" } });
    render(<Toast />);

    vi.advanceTimersByTime(4000);

    expect(useAppStore.getState().toast).toBeNull();
    vi.useRealTimers();
  });
});
