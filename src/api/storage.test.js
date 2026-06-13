import { describe, it, expect, beforeEach } from "vitest";
import {
  storage,
  loadUser,
  saveUser,
  getBoard,
  updateBoard,
  getNotes,
  saveNote,
} from "./storage.js";

describe("storage adapter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("round-trips JSON-serialisable values", () => {
    storage.set("key", { a: 1, b: ["x", "y"] });
    expect(storage.get("key")).toEqual({ a: 1, b: ["x", "y"] });
  });

  it("returns the fallback when a key is missing", () => {
    expect(storage.get("missing", "default")).toBe("default");
    expect(storage.get("missing")).toBeUndefined();
  });

  it("returns the fallback when stored JSON is corrupt", () => {
    window.localStorage.setItem("capabilityos:bad", "{not json");
    expect(storage.get("bad", "fallback")).toBe("fallback");
  });

  it("removes a stored value", () => {
    storage.set("temp", 42);
    storage.remove("temp");
    expect(storage.get("temp")).toBeUndefined();
  });

  it("lists all values under a prefix", () => {
    storage.set("notes:alice", ["a"]);
    storage.set("notes:bob", ["b"]);
    storage.set("other", ["c"]);
    const results = storage.list("notes:");
    expect(results).toHaveLength(2);
    expect(results).toEqual(expect.arrayContaining([["a"], ["b"]]));
  });

  it("namespaces keys so other apps' localStorage entries don't collide", () => {
    storage.set("shared", "value");
    expect(window.localStorage.getItem("capabilityos:shared")).toBe('"value"');
  });
});

describe("user profile persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns undefined when no user has been saved", () => {
    expect(loadUser()).toBeUndefined();
  });

  it("saves and reloads a user profile", () => {
    const user = {
      name: "Thabo Serame",
      industry: "Technology & Software",
      progress: ["t1m1"],
      xp: 100,
      badges: ["first"],
      streak: 1,
      last: "2026-06-12T00:00:00.000Z",
      perfectQuizzes: 0,
    };
    saveUser(user);
    expect(loadUser()).toEqual(user);
  });
});

describe("leaderboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty", () => {
    expect(getBoard()).toEqual([]);
  });

  it("inserts a new entry", () => {
    updateBoard({
      name: "Alice",
      xp: 100,
      lv: "AI Curious",
      mods: 1,
      streak: 0,
      last: "now",
      ind: "Technology",
    });
    expect(getBoard()).toHaveLength(1);
    expect(getBoard()[0].name).toBe("Alice");
  });

  it("updates an existing entry by name instead of duplicating it", () => {
    updateBoard({
      name: "Alice",
      xp: 100,
      lv: "AI Curious",
      mods: 1,
      streak: 0,
      last: "now",
      ind: "Technology",
    });
    updateBoard({
      name: "Alice",
      xp: 250,
      lv: "AI Aware",
      mods: 2,
      streak: 1,
      last: "later",
      ind: "Technology",
    });
    const board = getBoard();
    expect(board).toHaveLength(1);
    expect(board[0].xp).toBe(250);
    expect(board[0].lv).toBe("AI Aware");
  });
});

describe("facilitator notes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty for a learner with no notes", () => {
    expect(getNotes("Nomsa Khumalo")).toEqual([]);
  });

  it("saves a note with an id and timestamp", () => {
    const note = saveNote("Nomsa Khumalo", "Great progress this week.");
    expect(note.learnerName).toBe("Nomsa Khumalo");
    expect(note.text).toBe("Great progress this week.");
    expect(note.id).toMatch(/^note_/);
    expect(typeof note.createdAt).toBe("string");

    const notes = getNotes("Nomsa Khumalo");
    expect(notes).toHaveLength(1);
    expect(notes[0]).toEqual(note);
  });

  it("appends multiple notes in order", () => {
    saveNote("Sipho Ndlovu", "First note");
    saveNote("Sipho Ndlovu", "Second note");
    const notes = getNotes("Sipho Ndlovu");
    expect(notes.map((n) => n.text)).toEqual(["First note", "Second note"]);
  });
});
