import { describe, it, expect } from "vitest";
import { GLOBAL_CSS } from "./GlobalStyles.jsx";

describe("GLOBAL_CSS", () => {
  it("references the Spectral display typeface", () => {
    expect(GLOBAL_CSS).toContain("Spectral");
  });

  it("references the Archivo body typeface", () => {
    expect(GLOBAL_CSS).toContain("Archivo");
  });
});
