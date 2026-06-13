/**
 * Global Vitest setup, loaded via `vite.config.js` `test.setupFiles`.
 *
 * - Extends `expect` with `@testing-library/jest-dom` matchers
 *   (`toBeInTheDocument`, `toHaveAttribute`, etc.)
 * - Cleans up the DOM between tests
 * - Provides a `matchMedia` stub, since `prefers-reduced-motion` is
 *   referenced in `GlobalStyles` and jsdom does not implement `matchMedia`
 * - Resets `localStorage` between tests so the storage adapter
 *   (`src/api/storage.js`) starts from a clean slate each test
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  window.localStorage.clear();
});

if (typeof window.matchMedia !== "function") {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
