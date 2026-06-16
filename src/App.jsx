import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LearnerNav from "./components/LearnerNav.jsx";
import Toast from "./components/Toast.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Learning from "./pages/Learning.jsx";
import ModuleReader from "./pages/ModuleReader.jsx";
import PromptLab from "./pages/PromptLab.jsx";
import Achievements from "./pages/Achievements.jsx";
import UseCaseLibrary from "./pages/UseCaseLibrary.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import ReportsExco from "./pages/ReportsExco.jsx";
import { useAppStore } from "./store/AppStore.jsx";
import { COLORS, FONT_FAMILY_BODY } from "./theme/tokens.js";

function ProtectedLayout() {
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
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/module/:tierId/:moduleId" element={<ModuleReader />} />
          <Route path="/prompt-lab" element={<PromptLab />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/use-cases" element={<UseCaseLibrary />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/reports" element={<ReportsExco />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  const { auth } = useAppStore();

  if (!auth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          fontFamily: FONT_FAMILY_BODY,
          color: COLORS.text,
        }}
      >
        <Login />
        <Toast />
      </div>
    );
  }

  return <ProtectedLayout />;
}
