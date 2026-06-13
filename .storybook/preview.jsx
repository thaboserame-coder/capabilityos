import { useMemo } from "react";
import { GlobalStyles } from "../src/theme/GlobalStyles.jsx";
import { useAppStore } from "../src/store/useAppStore.js";
import { baseStoreState } from "../src/test/fixtures.js";
import { COLORS } from "../src/theme/tokens.js";

/**
 * Seeds the module-level Zustand store with the `storeState` provided in a
 * story's `parameters` before the story renders.
 *
 * CapabilityOS components read directly from `useAppStore` (a singleton),
 * so Storybook stories configure the same state a test would via
 * `useAppStore.setState(...)` rather than passing props.
 *
 * Named (and capitalized) like a component — Storybook decorators are
 * rendered exactly like a function component receiving `(Story, context)`,
 * so `eslint-plugin-react-hooks` requires the PascalCase name to permit the
 * `useMemo` call below.
 */
function WithStore(Story, context) {
  const seed = context.parameters.storeState ?? {};
  // Re-seed whenever the story's declared state changes (new story, or args
  // changed via controls), but only once per render of that state. Depend on
  // the serialized form rather than `seed` itself, since `seed` is a new
  // object on every render even when its contents are unchanged.
  const seedKey = JSON.stringify(seed);
  useMemo(() => {
    useAppStore.setState(baseStoreState(seed));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: re-seed only when the serialized seed changes, see comment above
  }, [seedKey]);

  return (
    <>
      <GlobalStyles />
      <Story />
    </>
  );
}

/** @type {import('@storybook/react').Preview} */
const preview = {
  decorators: [WithStore],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "app",
      values: [{ name: "app", value: COLORS.bg }],
    },
    a11y: {
      // Run the same WCAG 2.1 AA ruleset as the Cypress accessibility suite
      // (cypress/e2e/accessibility.cy.js) so violations surface in Storybook
      // during development, not just in CI.
      config: {
        runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    },
  },
};

export default preview;
