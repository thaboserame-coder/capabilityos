import { describe, it, expect } from "vitest";
import { getLevel, getNextLevel, getLevelProgressPct } from "./xp.js";
import { LEVELS } from "../data/levels.js";

describe("getLevel", () => {
  it("returns the first level for 0 XP", () => {
    expect(getLevel(0).name).toBe("AI Curious");
  });

  it("returns the highest level whose minimum is met", () => {
    expect(getLevel(299).name).toBe("AI Curious");
    expect(getLevel(300).name).toBe("AI Aware");
    expect(getLevel(2999).name).toBe("AI Strategist");
  });

  it("returns the top level once XP meets its minimum", () => {
    const top = LEVELS[LEVELS.length - 1];
    expect(getLevel(top.min).name).toBe(top.name);
    expect(getLevel(top.min + 10_000).name).toBe(top.name);
  });

  it("falls back to the first level for negative XP", () => {
    expect(getLevel(-50).name).toBe(LEVELS[0].name);
  });
});

describe("getNextLevel", () => {
  it("returns the following level when one exists", () => {
    expect(getNextLevel(0)?.name).toBe("AI Aware");
    expect(getNextLevel(300)?.name).toBe("AI Apprentice");
  });

  it("returns null at the top level", () => {
    const top = LEVELS[LEVELS.length - 1];
    expect(getNextLevel(top.min)).toBeNull();
  });
});

describe("getLevelProgressPct", () => {
  it("computes percentage progress toward the next level", () => {
    // Level 1 spans 0-300; 150 XP is halfway.
    expect(getLevelProgressPct(150)).toBe(50);
  });

  it("returns 0 at the very start of a level", () => {
    expect(getLevelProgressPct(0)).toBe(0);
  });

  it("clamps negative progress to 0", () => {
    expect(getLevelProgressPct(-50)).toBe(0);
  });

  it("returns 100 once the top level is reached", () => {
    const top = LEVELS[LEVELS.length - 1];
    expect(getLevelProgressPct(top.min)).toBe(100);
    expect(getLevelProgressPct(top.min + 5000)).toBe(100);
  });
});
