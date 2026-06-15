import React from "react";
import { COLORS, SHADOW, RADIUS, TYPE_SCALE } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";

const TONE_COLORS = {
  info: COLORS.acc,
  success: COLORS.green,
  warning: COLORS.gold,
  danger: COLORS.danger,
};

export default function Toast() {
  const { toasts, dismissToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 1000,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `3px solid ${TONE_COLORS[toast.tone] || COLORS.acc}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.lg,
            padding: "12px 16px",
            minWidth: 240,
            maxWidth: 360,
            cursor: "pointer",
            ...TYPE_SCALE.body,
            color: COLORS.text,
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
