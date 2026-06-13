import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GlobalStyles, GLOBAL_CSS } from "./GlobalStyles.jsx";

describe("GlobalStyles", () => {
  it("renders a <style> element containing the global stylesheet", () => {
    const { container } = render(<GlobalStyles />);
    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    expect(style.textContent).toBe(GLOBAL_CSS);
  });

  it("uses the corrected 'Cormorant Garamond' font family (see CHANGELOG)", () => {
    expect(GLOBAL_CSS).toContain("Cormorant+Garamond");
    expect(GLOBAL_CSS).not.toContain("Cormorant+Garant");
  });
});
