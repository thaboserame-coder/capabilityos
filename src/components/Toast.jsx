import { useEffect } from "react";
import { Award, Check, Info } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS } from "../theme/tokens.js";

const VARIANT_STYLES = {
  info: { icon: Info, accent: COLORS.acc },
  success: { icon: Check, accent: COLORS.green },
  badge: { icon: Award, accent: COLORS.gold },
};

const AUTO_DISMISS_MS = 4000;

/**
 * Toast notification rendered in the bottom-right corner, driven entirely by
 * `useAppStore`'s `toast` slice. Auto-dismisses after `AUTO_DISMISS_MS`.
 *
 * Accessibility: uses `role="status"` + `aria-live="polite"` so screen
 * readers announce XP/badge notifications without interrupting the user's
 * current focus.
 */
export default function Toast() {
  const toast = useAppStore((state) => state.toast);
  const dismissToast = useAppStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dismissToast(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const { icon: Icon, accent } = VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-in"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 20px",
        borderRadius: 12,
        background: COLORS.surf2,
        border: `1px solid ${COLORS.borderH}`,
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        maxWidth: 360,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: `${accent}22`,
          color: accent,
          flexShrink: 0,
        }}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
      <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        type="button"
        onClick={dismissToast}
        aria-label="Dismiss notification"
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: COLORS.muted,
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
