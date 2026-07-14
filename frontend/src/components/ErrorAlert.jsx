import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-red-550 max-w-xl mx-auto my-8">
      <div className="flex gap-4">
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl h-fit">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            Something went wrong
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            {message || "We encountered an issue preparing your travel information. Please verify your connection and try again."}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
