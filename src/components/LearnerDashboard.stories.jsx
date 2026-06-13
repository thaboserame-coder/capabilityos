import { ALL_MODULE_IDS, createTestUser, TIER1_MODULE_IDS } from "../test/fixtures.js";
import LearnerDashboard from "./LearnerDashboard.jsx";

export default {
  title: "Components/LearnerDashboard",
  component: LearnerDashboard,
  parameters: { layout: "fullscreen" },
};

export const NewLearner = {
  name: "New learner (no progress, no badges)",
  parameters: {
    storeState: {
      user: createTestUser(),
      screen: { screen: "dashboard" },
    },
  },
};

export const InProgress = {
  name: "Learner with partial progress and an earned badge",
  parameters: {
    storeState: {
      user: createTestUser({
        xp: 350,
        streak: 5,
        progress: TIER1_MODULE_IDS.slice(0, 3),
        badges: ["first"],
      }),
      screen: { screen: "dashboard" },
    },
  },
};

export const AllComplete = {
  name: "Learner who has completed every module",
  parameters: {
    storeState: {
      user: createTestUser({
        xp: 2150,
        streak: 21,
        progress: ALL_MODULE_IDS,
        badges: ["first", "five", "ten", "t1", "t2", "t3", "all"],
        perfectQuizzes: 3,
      }),
      screen: { screen: "dashboard" },
    },
  },
};
