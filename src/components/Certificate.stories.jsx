import { createTestUser, ALL_MODULE_IDS } from "../test/fixtures.js";
import { TIERS } from "../data/tiers.js";
import Certificate from "./Certificate.jsx";

const [tier1, , tier3] = TIERS;

export default {
  title: "Components/Certificate",
  component: Certificate,
  parameters: { layout: "fullscreen" },
};

export const Overview = {
  name: "Overview — mix of locked and unlocked certificates",
  parameters: {
    storeState: {
      user: createTestUser({
        progress: tier1.mods.map((mod) => mod.id),
        xp: 600,
        badges: ["first", "t1"],
      }),
      screen: { screen: "certificate" },
    },
  },
};

export const OverviewAllUnlocked = {
  name: "Overview — every certificate unlocked",
  parameters: {
    storeState: {
      user: createTestUser({
        progress: ALL_MODULE_IDS,
        xp: 2150,
        badges: ["first", "five", "ten", "t1", "t2", "t3", "all"],
      }),
      screen: { screen: "certificate" },
    },
  },
};

export const CertificateUnlocked = {
  name: "Certificate view — tier fully completed",
  parameters: {
    storeState: {
      user: createTestUser({
        name: "Lerato Mahlangu",
        progress: tier3.mods.map((mod) => mod.id),
        xp: 600,
        badges: ["first", "t3"],
      }),
      screen: { screen: "certificate", params: { tierId: tier3.id } },
    },
  },
};

export const CertificateLocked = {
  name: "Certificate view — tier not yet completed",
  parameters: {
    storeState: {
      user: createTestUser({ progress: tier1.mods.slice(0, 1).map((mod) => mod.id), xp: 100 }),
      screen: { screen: "certificate", params: { tierId: tier1.id } },
    },
  },
};
