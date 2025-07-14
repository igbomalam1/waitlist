import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinWaitlist from "./pages/waitlist/JoinWaitlist";
import Dashboard from "./pages/waitlist/Dashboard";
import GetCode from "./pages/waitlist/GetCode";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/other/LandingPage"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/waitlist" element={<JoinWaitlist />} />
        <Route path="/waitlist/dashboard/:userId" element={<Dashboard />} />
        <Route path="/get-code" element={<GetCode />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;