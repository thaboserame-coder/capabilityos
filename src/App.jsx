import React from "react";
import { Routes, Route } from "react-router-dom";
import LearnerNav from "./components/LearnerNav.jsx";
import Toast from "./components/Toast.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CapabilityMap from "./pages/CapabilityMap.jsx";
import Academy from "./pages/Academy.jsx";
import ReportsExco from "./pages/ReportsExco.jsx";
import { COLORS, FONT_FAMILY_BODY } from "./theme/tokens.js";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: FONT_FAMILY_BODY,
        color: COLORS.text,
      }}
    >
      <LearnerNav />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/capability-map" element={<CapabilityMap />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/reports" element={<ReportsExco />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}
