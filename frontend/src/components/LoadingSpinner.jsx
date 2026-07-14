import React, { useState, useEffect } from "react";
import { Compass } from "lucide-react";

export default function LoadingSpinner({ message = "Generating your custom AI itinerary..." }) {
  const [tipIndex, setTipIndex] = useState(0);
  const loadingTips = [
    "Consulting local RAG travel documents...",
    "Retrieving live weather information...",
    "Searching for matching hotels & attractions...",
    "Crafting day-by-day activity timelines...",
    "Calculating budget estimates..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="relative p-6 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-xl">
          <Compass className="h-16 w-16 text-primary-600 dark:text-primary-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{message}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm animate-pulse">
        {loadingTips[tipIndex]}
      </p>
    </div>
  );
}
