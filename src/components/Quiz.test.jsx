import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quiz from "./Quiz.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { getTotalModuleCount, TIERS } from "../data/tiers.js";
import { generateQuiz } from "../api/quizClient.js";

vi.mock("../api/quizClient.js", () => ({
  generateQuiz: vi.fn(),
}));

const BASE_USER = {
  name: "Thabo Serame",
  industry: "Mining & Resources",
  progress: [],
  xp: 0,
  badges: [],
  streak: 0,
  last: new Date().toISOString(),
  perfectQuizzes: 0,
};

const tier = TIERS[0];
const mod = tier.mods[0];

const TWO_QUESTIONS = [
  {
    q: "What is machine learning?",
    options: ["Learning patterns from data", "A type of robot", "A spreadsheet", "A database"],
    correct: 0,
    explanation: "Machine learning finds patterns in historical data.",
  },
  {
    q: "What should you do with AI-generated facts?",
    options: ["Trust them blindly", "Verify them", "Ignore them", "Delete them"],
    correct: 1,
    explanation: "AI outputs can be confidently wrong, so verify before relying on them.",
  },
];

function resetStore(overrides = {}) {
  window.localStorage.clear();
  useAppStore.setState({
    screen: { screen: "quiz", params: {} },
    navStack: [],
    user: null,
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
    ...overrides,
  });
}

beforeEach(() => {
  resetStore();
  generateQuiz.mockReset();
});

describe("Quiz", () => {
  it("shows a not-available message when the module doesn't exist", () => {
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: "nope" } },
    });
    render(<Quiz />);

    expect(screen.getByText(/quiz not available/i)).toBeInTheDocument();
  });

  it("shows a loading state, then renders questions from the AI source", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "ai" });
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    expect(screen.getByText(/generating your quiz/i)).toBeInTheDocument();

    expect(await screen.findByText(`1. ${TWO_QUESTIONS[0].q}`)).toBeInTheDocument();
    expect(screen.getByText(`2. ${TWO_QUESTIONS[1].q}`)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the offline-bank notice when the fallback question source is used", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "fallback" });
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    expect(await screen.findByRole("status")).toHaveTextContent(/offline question bank/i);
  });

  it("disables submit until every question is answered, and records a perfect score", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "ai" });
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    await screen.findByText(`1. ${TWO_QUESTIONS[0].q}`);

    const submitButton = screen.getByRole("button", { name: /submit answers/i });
    expect(submitButton).toBeDisabled();

    const q1Options = screen.getAllByRole("button", { name: TWO_QUESTIONS[0].options[0] });
    await userEvent.click(q1Options[0]);
    expect(submitButton).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: TWO_QUESTIONS[1].options[1] }));
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(
      screen.getByText(`${TWO_QUESTIONS.length} / ${TWO_QUESTIONS.length} correct`),
    ).toBeInTheDocument();
    expect(screen.getByText(/marked complete/i)).toBeInTheDocument();
    expect(useAppStore.getState().user.progress).toContain(mod.id);
    expect(useAppStore.getState().user.perfectQuizzes).toBe(1);
  });

  it("offers a retry when the learner does not pass", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "ai" });
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    await screen.findByText(`1. ${TWO_QUESTIONS[0].q}`);

    // Answer both questions incorrectly.
    await userEvent.click(screen.getByRole("button", { name: TWO_QUESTIONS[0].options[1] }));
    await userEvent.click(screen.getByRole("button", { name: TWO_QUESTIONS[1].options[0] }));
    await userEvent.click(screen.getByRole("button", { name: /submit answers/i }));

    expect(screen.getByText(`0 / ${TWO_QUESTIONS.length} correct`)).toBeInTheDocument();
    expect(useAppStore.getState().user.progress).not.toContain(mod.id);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("regenerates the quiz when 'Try again' is clicked after failing", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "ai" });
    resetStore({
      user: BASE_USER,
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    await screen.findByText(`1. ${TWO_QUESTIONS[0].q}`);

    // Answer both questions incorrectly, then submit.
    await userEvent.click(screen.getByRole("button", { name: TWO_QUESTIONS[0].options[1] }));
    await userEvent.click(screen.getByRole("button", { name: TWO_QUESTIONS[1].options[0] }));
    await userEvent.click(screen.getByRole("button", { name: /submit answers/i }));

    const retryQuestions = [TWO_QUESTIONS[1], TWO_QUESTIONS[0]];
    generateQuiz.mockResolvedValue({ questions: retryQuestions, source: "fallback" });

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/offline question bank/i);
    expect(screen.getByText(`1. ${retryQuestions[0].q}`)).toBeInTheDocument();
    expect(generateQuiz).toHaveBeenCalledTimes(2);

    const submitButton = screen.getByRole("button", { name: /submit answers/i });
    expect(submitButton).toBeDisabled();
  });

  it("calls goBack when 'Back to module' is clicked", async () => {
    generateQuiz.mockResolvedValue({ questions: TWO_QUESTIONS, source: "ai" });
    resetStore({
      user: BASE_USER,
      navStack: [{ screen: "module", params: { tierId: tier.id, moduleId: mod.id } }],
      screen: { screen: "quiz", params: { tierId: tier.id, moduleId: mod.id } },
    });
    render(<Quiz />);

    await userEvent.click(screen.getByRole("button", { name: /back to module/i }));

    expect(useAppStore.getState().screen).toEqual({
      screen: "module",
      params: { tierId: tier.id, moduleId: mod.id },
    });
  });
});
