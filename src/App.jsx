import { useAppStore } from "./store/useAppStore.js";
import Login from "./components/Login.jsx";
import LearnerNav from "./components/LearnerNav.jsx";
import LearnerDashboard from "./components/LearnerDashboard.jsx";
import TierView from "./components/TierView.jsx";
import ModuleView from "./components/ModuleView.jsx";
import Quiz from "./components/Quiz.jsx";
import Certificate from "./components/Certificate.jsx";
import FacilitatorDashboard from "./components/FacilitatorDashboard.jsx";
import Toast from "./components/Toast.jsx";

/**
 * Root component. Renders the screen named in `useAppStore().screen.screen`.
 *
 * This is a deliberately simple "screen switch" router rather than a
 * library-based router (e.g. React Router). CapabilityOS has no deep-linkable
 * URLs in this scaffold — every screen is reached via in-app navigation and
 * state is restored from `localStorage` on reload regardless of URL. See
 * docs/ARCHITECTURE.md "Routing" for the documented trade-off and the
 * recommended migration path (React Router + URL-based state) if/when
 * shareable deep links to specific tiers/modules become a requirement.
 */
export default function App() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);

  if (!user) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <LearnerNav />
      <ScreenSwitch screen={screen.screen} />
      <Toast />
    </div>
  );
}

/** @param {{ screen: string }} props */
function ScreenSwitch({ screen }) {
  switch (screen) {
    case "tier":
      return <TierView />;
    case "module":
      return <ModuleView />;
    case "quiz":
      return <Quiz />;
    case "certificate":
      return <Certificate />;
    case "facilitator":
      return <FacilitatorDashboard />;
    case "dashboard":
    default:
      return <LearnerDashboard />;
  }
}
