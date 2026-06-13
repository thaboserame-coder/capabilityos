import { createTestUser } from "../test/fixtures.js";
import { TIERS } from "../data/tiers.js";
import ModuleView from "./ModuleView.jsx";

const tier1 = TIERS[0];
const [firstMod, secondMod, , , , lastMod] = tier1.mods;

export default {
  title: "Components/ModuleView",
  component: ModuleView,
  parameters: { layout: "fullscreen" },
};

export const FirstModuleIncomplete = {
  name: "First module, not yet completed (Next only)",
  parameters: {
    storeState: {
      user: createTestUser(),
      screen: { screen: "module", params: { tierId: tier1.id, moduleId: firstMod.id } },
    },
  },
};

export const ModuleCompleted = {
  name: "Completed module (Previous + Next)",
  parameters: {
    storeState: {
      user: createTestUser({ progress: [firstMod.id, secondMod.id], xp: 200 }),
      screen: { screen: "module", params: { tierId: tier1.id, moduleId: secondMod.id } },
    },
  },
};

export const LastModuleOfTier = {
  name: "Last module, not yet completed (Previous only)",
  parameters: {
    storeState: {
      user: createTestUser({ progress: tier1.mods.slice(0, 5).map((mod) => mod.id), xp: 500 }),
      screen: { screen: "module", params: { tierId: tier1.id, moduleId: lastMod.id } },
    },
  },
};

export const NotFound = {
  name: "Unknown module id",
  parameters: {
    storeState: {
      user: createTestUser(),
      screen: { screen: "module", params: { tierId: tier1.id, moduleId: "does-not-exist" } },
    },
  },
};
