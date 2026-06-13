import { expect, userEvent, within } from "@storybook/test";
import Login from "./Login.jsx";

export default {
  title: "Components/Login",
  component: Login,
};

export const Default = {};

/**
 * Submitting without a name shows the inline validation error
 * (`role="alert"`, see `Login.test.jsx`).
 */
export const ValidationError = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /continue/i }));
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Please enter your name to continue.",
    );
  },
};

/**
 * Filling in the form (without submitting) — useful for visual review of
 * the input/select styling.
 */
export const Filled = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/full name/i), "Thabo Serame");
    await userEvent.selectOptions(canvas.getByLabelText(/industry/i), "Mining & Resources");
  },
};
