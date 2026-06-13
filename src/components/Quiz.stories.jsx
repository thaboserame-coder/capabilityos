import { expect, userEvent, within } from "@storybook/test";
import { createTestUser } from "../test/fixtures.js";
import { TIERS } from "../data/tiers.js";
import Quiz from "./Quiz.jsx";

const tier1 = TIERS[0];
const firstMod = tier1.mods[0];

export default {
  title: "Components/Quiz",
  component: Quiz,
  parameters: { layout: "fullscreen" },
};

const baseStoreState = {
  user: createTestUser(),
  screen: { screen: "quiz", params: { tierId: tier1.id, moduleId: firstMod.id } },
};

/**
 * No backend is available in Storybook, so `generateQuiz` resolves with the
 * offline fallback question bank (see `src/api/quizClient.js`).
 */
export const Active = {
  name: "Quiz loaded, no answers selected yet",
  parameters: { storeState: baseStoreState },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: /submit answers/i });
  },
};

export const Submitted = {
  name: "All questions answered (first option) and submitted",
  parameters: { storeState: baseStoreState },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: /submit answers/i });

    const questions = canvasElement.querySelectorAll("ol > li");
    for (const question of questions) {
      const firstOption = question.querySelector(".qopt");
      await userEvent.click(firstOption);
    }

    await userEvent.click(canvas.getByRole("button", { name: /submit answers/i }));
    await expect(canvas.getByText(/\/ \d+ correct/)).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: /back to module/i })).toBeInTheDocument();
  },
};
