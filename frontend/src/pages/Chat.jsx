import React, { useState } from "react";
import { Compass, HelpCircle } from "lucide-react";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [selectedDest, setSelectedDest] = useState("Paris");

  const destinations = ["Paris", "Tokyo", "New York", "Rome"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
          <Compass className="h-8 w-8 text-primary-600 animate-spin-slow" />
          <span>AI Travel Assistant</span>
        </h1>
        <p className="text-sm text-slate-500">
          Ask questions about culture, tipping, local delicacies, safety guidelines, and hidden gems. Grounded in document knowledge.
        </p>
      </div>

      {/* Select Destination Knowledge base */}
      <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Select Destination Knowledge base:
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {destinations.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDest(dest)}
              className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                selectedDest === dest
                  ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20"
                  : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-650 dark:text-slate-350"
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow destination={selectedDest} />
    </div>
  );
}
