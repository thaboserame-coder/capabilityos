import { Shield, Flame, LogOut, LayoutDashboard, Users as UsersIcon } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { getLevel, getNextLevel, getLevelProgressPct } from "../utils/xp.js";

/**
 * Persistent top navigation bar shown on every authenticated screen.
 * Displays the learner's level, XP progress toward the next level, current
 * streak, and links to the dashboard and facilitator view.
 */
export default function LearnerNav() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const logout = useAppStore((state) => state.logout);

  if (!user) return null;

  const level = getLevel(user.xp);
  const next = getNextLevel(user.xp);
  const pct = getLevelProgressPct(user.xp);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "14px 24px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: "rgba(3,11,22,0.85)",
        backdropFilter: "blur(8px)",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        className="nb"
        onClick={() => navigateTo("dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontSize: 18,
            fontWeight: 500,
            color: COLORS.text,
          }}
        >
          CapabilityOS
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 220, flex: 1 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: level.color,
            border: `1px solid ${level.color}55`,
            borderRadius: 999,
            padding: "3px 10px",
            whiteSpace: "nowrap",
          }}
        >
          {level.name}
        </span>
        <div
          aria-label={`${pct}% progress toward ${next ? next.name : "max level"}`}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            background: COLORS.surf3,
            overflow: "hidden",
            minWidth: 80,
          }}
        >
          <div
            className="xp-bar"
            style={{
              height: "100%",
              width: `${pct}%`,
              background: COLORS.acc,
              borderRadius: 999,
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: COLORS.muted2, whiteSpace: "nowrap" }}>
          {user.xp} XP{next ? ` / ${next.min} XP` : ""}
        </span>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.fire, fontSize: 13 }}
      >
        <Flame size={16} aria-hidden="true" />
        <span>{user.streak}</span>
        <span className="visually-hidden">day streak</span>
      </div>

      <nav aria-label="Primary" style={{ display: "flex", gap: 8 }}>
        <NavButton
          icon={LayoutDashboard}
          label="Dashboard"
          active={screen.screen === "dashboard"}
          onClick={() => navigateTo("dashboard")}
        />
        <NavButton
          icon={UsersIcon}
          label="Facilitator"
          active={screen.screen === "facilitator"}
          onClick={() => navigateTo("facilitator")}
        />
        <NavButton
          icon={Shield}
          label="Certificates"
          active={screen.screen === "certificate"}
          onClick={() => navigateTo("certificate")}
        />
        <NavButton icon={LogOut} label="Log out" onClick={logout} />
      </nav>
    </header>
  );
}

/**
 * @param {{ icon: React.ComponentType<{size?: number}>, label: string, active?: boolean, onClick: () => void }} props
 */
function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className="nb"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={label}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${active ? COLORS.borderH : "transparent"}`,
        background: active ? COLORS.surf2 : "transparent",
        color: active ? COLORS.text : COLORS.muted2,
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      <Icon size={15} aria-hidden="true" />
      <span style={{ display: "none" }} className="nb-label">
        {label}
      </span>
    </button>
  );
}
