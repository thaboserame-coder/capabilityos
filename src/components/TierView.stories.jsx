import { createTestUser } from "../test/fixtures.js";
import { TIERS } from "../data/tiers.js";
import TierView from "./TierView.jsx";

const [tier1, , tier3] = TIERS;

export default {
  title: "Components/TierView",
  component: TierView,
  parameters: { layout: "fullscreen" },
};

export const NotStarted = {
  name: "Tier with no completed modules",
  parameters: {
    storeState: {
      user: createTestUser(),
      screen: { screen: "tier", params: { tierId: tier1.id } },
    },
  },
};

export const InProgress = {
  name: "Tier with some modules completed",
  parameters: {
    storeState: {
      user: createTestUser({ progress: tier1.mods.slice(0, 2).map((mod) => mod.id), xp: 200 }),
      screen: { screen: "tier", params: { tierId: tier1.id } },
    },
  },
};

export const CertificateReady = {
  name: "Every module complete — certificate banner shown",
  parameters: {
    storeState: {
      user: createTestUser({
        progress: tier3.mods.map((mod) => mod.id),
        xp: 600,
        badges: ["first", "t3"],
      }),
      screen: { screen: "tier", params: { tierId: tier3.id } },
    },
  },
};

export const NotFound = {
  name: "Unknown tier id",
  parameters: {
    storeState: {
      user: createTestUser(),
      screen: { screen: "tier", params: { tierId: "does-not-exist" } },
    },
  },
};
