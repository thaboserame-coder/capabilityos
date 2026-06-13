import Toast from "./Toast.jsx";

/**
 * Toast is driven entirely by `useAppStore`'s `toast` slice (see
 * `.storybook/preview.jsx`'s `withStore` decorator, which seeds the store
 * from each story's `parameters.storeState` before render).
 */
export default {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "padded",
  },
};

export const Info = {
  parameters: {
    storeState: {
      toast: { message: "Your progress has been saved.", variant: "info" },
    },
  },
};

export const Success = {
  parameters: {
    storeState: {
      toast: { message: "+100 XP — module complete!", variant: "success" },
    },
  },
};

export const BadgeEarned = {
  parameters: {
    storeState: {
      toast: { message: "Badge earned: First Steps", variant: "badge" },
    },
  },
};

export const Hidden = {
  name: "No toast (renders nothing)",
  parameters: {
    storeState: { toast: null },
  },
  play: async ({ canvasElement }) => {
    // Sanity check for the "nothing to show" state — Toast returns null when
    // `toast` is falsy, so the canvas should be empty.
    if (canvasElement.querySelector('[role="status"]')) {
      throw new Error("Expected no toast to render when store.toast is null");
    }
  },
};
