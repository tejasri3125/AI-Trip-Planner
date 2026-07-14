import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import SavedTrips from "./pages/SavedTrips";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </main>

        {/* Footer */}
        <div className="no-print">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
