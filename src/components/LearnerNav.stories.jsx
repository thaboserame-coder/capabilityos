import { createTestUser, TIER1_MODULE_IDS } from "../test/fixtures.js";
import LearnerNav from "./LearnerNav.jsx";

export default {
  title: "Components/LearnerNav",
  component: LearnerNav,
  parameters: { layout: "fullscreen" },
};

export const NewLearner = {
  parameters: {
    storeState: {
      user: createTestUser({ xp: 0, streak: 0 }),
      screen: { screen: "dashboard" },
    },
  },
};

export const ProgressingLearner = {
  name: "Mid-level learner with a streak",
  parameters: {
    storeState: {
      user: createTestUser({
        xp: 350,
        streak: 5,
        progress: TIER1_MODULE_IDS.slice(0, 3),
      }),
      screen: { screen: "dashboard" },
    },
  },
};

export const OnFacilitatorScreen = {
  name: "Facilitator nav item active",
  parameters: {
    storeState: {
      user: createTestUser({ xp: 1450, streak: 12 }),
      screen: { screen: "facilitator" },
    },
  },
};

export const NearMaxLevel = {
  name: "Near the highest level (AI Executive, 4000 XP)",
  parameters: {
    storeState: {
      user: createTestUser({ xp: 3950, streak: 30 }),
      screen: { screen: "dashboard" },
    },
  },
};
