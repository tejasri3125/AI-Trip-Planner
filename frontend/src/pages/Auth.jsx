import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { authService } from "../services/api";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
        navigate("/planner");
      } else {
        await authService.register(email, password);
        // Automatically login on registration
        await authService.login(email, password);
        navigate("/planner");
      }
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "Authentication failed. Make sure the backend is running.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>

      <div className="glass-card max-w-md w-full p-8 rounded-3xl space-y-6 relative border border-slate-200/50 dark:border-slate-800 shadow-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-2xl w-fit">
              <Compass className="h-10 w-10 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-850 dark:text-white">
            {isLogin ? "Welcome Back" : "Start Planning"}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? "Log in to access your saved itineraries" : "Create an account to start saving trips"}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="form-label text-xs">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label text-xs">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? "Authenticating..." : isLogin ? "Sign In" : "Register"}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-455 pt-2">
          <span>{isLogin ? "New to TripPlanner AI? " : "Already have an account? "}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-primary-600 dark:text-primary-400 hover:underline font-bold"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
