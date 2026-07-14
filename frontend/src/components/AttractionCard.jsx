import React, { useState } from "react";
import { Star, MapPin, Compass, Clock, Utensils } from "lucide-react";

export default function AttractionCard({ attractions, restaurants, onSelectPlace }) {
  const [activeTab, setActiveTab] = useState("attractions");

  const items = activeTab === "attractions" ? attractions : restaurants;
  const isAttraction = activeTab === "attractions";

  if ((!attractions || attractions.length === 0) && (!restaurants || restaurants.length === 0)) return null;

  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm">
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-4">
        <button
          onClick={() => setActiveTab("attractions")}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === "attractions"
              ? "border-primary-600 text-primary-600 dark:text-primary-400"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Local Attractions</span>
        </button>
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === "restaurants"
              ? "border-primary-600 text-primary-600 dark:text-primary-400"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Popular Food Spots</span>
        </button>
      </div>

      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-4 p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-xl transition-colors duration-200"
            >
              {/* Image */}
              <div className="h-28 w-full sm:w-28 shrink-0 rounded-xl overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 py-0.5 px-2 bg-black/60 backdrop-blur-sm text-white rounded-md text-[10px] font-bold flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-white leading-snug">
                      {item.name}
                    </h4>
                    {!isAttraction && item.price && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450 px-1.5 py-0.5 rounded">
                        {item.price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {isAttraction && item.opening_hours && (
                    <div className="flex items-center gap-1.5 text-slate-400 mt-2 text-[10px]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.opening_hours}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-400 mt-2 text-[10px]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{item.address}</span>
                  </div>
                </div>

                {onSelectPlace && (
                  <button
                    onClick={() => onSelectPlace(item)}
                    className="mt-3 text-left text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 hover:underline"
                  >
                    Pin on map
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-slate-400 py-6">
            No recommendations loaded.
          </p>
        )}
      </div>
    </div>
  );
}
