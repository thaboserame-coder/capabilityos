import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { INDUSTRIES } from "../data/industries.js";

const AppContext = createContext(null);

const INITIAL_STATE = {
  learner: {
    name: "Thabo Serame",
    role: "Learner",
    industryId: "transportation-logistics",
    xp: 870,
    completedModuleIds: ["mod-fleet-intelligence-101"],
  },
};

export function AppProvider({ children }) {
  const [learner, setLearner] = useState(INITIAL_STATE.learner);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, tone = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    // Auto-dismiss after 4s — calm, not gimmicky.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const awardXP = useCallback(
    (amount, reason) => {
      setLearner((prev) => ({ ...prev, xp: prev.xp + amount }));
      addToast(reason ? `+${amount} XP — ${reason}` : `+${amount} XP`, "success");
    },
    [addToast]
  );

  const completeModule = useCallback(
    (moduleId, xpAmount) => {
      setLearner((prev) => {
        if (prev.completedModuleIds.includes(moduleId)) return prev;
        return {
          ...prev,
          completedModuleIds: [...prev.completedModuleIds, moduleId],
          xp: prev.xp + xpAmount,
        };
      });
      addToast(`Module complete — +${xpAmount} XP`, "success");
    },
    [addToast]
  );

  const currentIndustry = useMemo(
    () => INDUSTRIES.find((i) => i.id === learner.industryId) || INDUSTRIES[0],
    [learner.industryId]
  );

  const value = useMemo(
    () => ({
      learner,
      currentIndustry,
      toasts,
      addToast,
      dismissToast,
      awardXP,
      completeModule,
    }),
    [learner, currentIndustry, toasts, addToast, dismissToast, awardXP, completeModule]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within an AppProvider");
  return ctx;
}
