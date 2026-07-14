import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Compass, Menu, X, LogOut, User as UserIcon, Calendar } from "lucide-react";
import { authService } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check dark mode preference
    const isDark = localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Sync auth status
    setUser(authService.getCurrentUser());
  }, [location]);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("darkMode", String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
              <Compass className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin-slow" />
              <span>TripPlanner AI</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-semibold transition-colors duration-200 ${isActive("/") ? "text-primary-600 dark:text-primary-400" : "text-slate-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400"}`}>
              Home
            </Link>
            <Link to="/planner" className={`font-semibold transition-colors duration-200 ${isActive("/planner") ? "text-primary-600 dark:text-primary-400" : "text-slate-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400"}`}>
              Trip Planner
            </Link>
            <Link to="/chat" className={`font-semibold transition-colors duration-200 ${isActive("/chat") ? "text-primary-600 dark:text-primary-400" : "text-slate-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400"}`}>
              Chat Assistant
            </Link>
            {user && (
              <Link to="/saved" className={`font-semibold transition-colors duration-200 ${isActive("/saved") ? "text-primary-600 dark:text-primary-400" : "text-slate-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400"}`}>
                Saved Trips
              </Link>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 transition-all duration-200">
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/60 dark:text-red-400 transition-all duration-200 flex items-center gap-2 text-sm font-semibold">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-nav absolute top-16 left-0 w-full p-4 space-y-3 shadow-lg flex flex-col border-t border-slate-200 dark:border-slate-800">
          <Link to="/" onClick={() => setIsOpen(false)} className={`py-2 px-4 rounded-xl font-semibold ${isActive("/") ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" : "text-slate-600 dark:text-slate-300"}`}>
            Home
          </Link>
          <Link to="/planner" onClick={() => setIsOpen(false)} className={`py-2 px-4 rounded-xl font-semibold ${isActive("/planner") ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" : "text-slate-600 dark:text-slate-300"}`}>
            Trip Planner
          </Link>
          <Link to="/chat" onClick={() => setIsOpen(false)} className={`py-2 px-4 rounded-xl font-semibold ${isActive("/chat") ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" : "text-slate-600 dark:text-slate-300"}`}>
            Chat Assistant
          </Link>
          {user && (
            <Link to="/saved" onClick={() => setIsOpen(false)} className={`py-2 px-4 rounded-xl font-semibold ${isActive("/saved") ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" : "text-slate-600 dark:text-slate-300"}`}>
              Saved Trips
            </Link>
          )}

          {user ? (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <UserIcon className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3">
              <UserIcon className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
