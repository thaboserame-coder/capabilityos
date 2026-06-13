import { describe, it, expect } from "vitest";
import { BookOpen } from "lucide-react";
import { ICONS, getIcon } from "./icons.js";

describe("getIcon", () => {
  it("resolves every known icon key to a component", () => {
    for (const key of Object.keys(ICONS)) {
      expect(getIcon(key)).toBe(ICONS[key]);
    }
  });

  it("falls back to BookOpen for an unknown key", () => {
    expect(getIcon("does-not-exist")).toBe(BookOpen);
    expect(getIcon(undefined)).toBe(BookOpen);
  });
});
