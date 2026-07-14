import React from "react";
import { Sun, CloudRain, Wind, Droplets, Cloud } from "lucide-react";

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const { temperature, condition, description, humidity, wind_speed, rain_probability, is_mock } = weather;

  const getWeatherIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className="h-10 w-10 text-blue-500" />;
    if (c.includes("cloud")) return <Cloud className="h-10 w-10 text-slate-400" />;
    return <Sun className="h-10 w-10 text-amber-500 animate-pulse" />;
  };

  return (
    <div className="glass-card p-6 rounded-2xl glow-card relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
            Local Weather
          </span>
          <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mt-3">
            {temperature}°C
          </h3>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 capitalize">
            {condition} - <span className="text-slate-400 font-normal">{description}</span>
          </p>
        </div>
        <div className="p-3 bg-white dark:bg-slate-850 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80">
          {getWeatherIcon(condition)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-slate-150/50 dark:border-slate-800/50 pt-4 text-xs font-medium text-slate-500">
        {/* Rain Prob */}
        <div className="flex flex-col items-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl">
          <CloudRain className="h-4 w-4 text-blue-500 mb-1" />
          <span>Precipitation</span>
          <span className="text-slate-800 dark:text-white font-bold mt-0.5">{rain_probability}%</span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl">
          <Droplets className="h-4 w-4 text-emerald-500 mb-1" />
          <span>Humidity</span>
          <span className="text-slate-800 dark:text-white font-bold mt-0.5">{humidity}%</span>
        </div>

        {/* Wind */}
        <div className="flex flex-col items-center p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl">
          <Wind className="h-4 w-4 text-amber-500 mb-1" />
          <span>Wind Speed</span>
          <span className="text-slate-800 dark:text-white font-bold mt-0.5">{wind_speed} km/h</span>
        </div>
      </div>

      {is_mock && (
        <p className="text-[10px] text-slate-400 text-center mt-4">
          * Weather data simulated for this location
        </p>
      )}
    </div>
  );
}
