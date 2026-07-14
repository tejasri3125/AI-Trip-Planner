import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Clock, Compass, Sun, Sunset, Sunrise } from "lucide-react";

export default function ItineraryCard({ itinerary }) {
  const [expandedDay, setExpandedDay] = useState(1);

  if (!itinerary || itinerary.length === 0) return null;

  const toggleDay = (dayNum) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const getPeriodIcon = (time) => {
    const t = time.toLowerCase();
    if (t.includes("morning")) return <Sunrise className="h-5 w-5 text-amber-500" />;
    if (t.includes("afternoon")) return <Sun className="h-5 w-5 text-primary-500" />;
    return <Sunset className="h-5 w-5 text-indigo-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Day-by-Day Itinerary</h3>
      </div>

      <div className="space-y-3">
        {itinerary.map((dayData) => {
          const isExpanded = expandedDay === dayData.day;
          return (
            <div
              key={dayData.day}
              className="glass-card rounded-2xl overflow-hidden transition-all duration-300 border border-slate-100 dark:border-slate-800/80"
            >
              {/* Header */}
              <button
                onClick={() => toggleDay(dayData.day)}
                className="w-full flex items-center justify-between p-5 text-left bg-slate-50/50 dark:bg-slate-900/30"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md shadow-primary-500/20">
                    D{dayData.day}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">
                      Day {dayData.day} Schedule
                    </span>
                    <h4 className="font-extrabold text-slate-850 dark:text-white leading-tight">
                      {dayData.theme}
                    </h4>
                  </div>
                </div>
                <div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                  {dayData.activities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      {/* Timeline bar connecting activities */}
                      {idx < dayData.activities.length - 1 && (
                        <div className="absolute top-8 left-[18px] bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                      )}
                      
                      {/* Icon */}
                      <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-850 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-850 text-slate-500 shrink-0">
                        {getPeriodIcon(activity.time)}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {activity.time}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-850 dark:text-white mb-1.5 leading-snug">
                          {activity.title}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
