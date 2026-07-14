import React from "react";
import { Star, MapPin, Landmark } from "lucide-react";

export default function HotelCard({ hotels, onSelectHotel }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Landmark className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recommended Stays</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels.map((hotel, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="h-44 w-full relative">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 py-1 px-2.5 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{hotel.rating}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="font-bold text-slate-850 dark:text-white leading-snug">
                    {hotel.name}
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450 px-2 py-0.5 rounded-md">
                    {hotel.price}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {hotel.description}
                </p>
                <div className="flex items-center gap-1.5 text-slate-400 mt-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="text-[11px] truncate">{hotel.address}</span>
                </div>
              </div>

              {onSelectHotel && (
                <button
                  onClick={() => onSelectHotel(hotel)}
                  className="mt-4 w-full py-2 bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 hover:bg-primary-100 hover:dark:bg-slate-750 font-semibold rounded-xl text-xs transition-colors duration-200"
                >
                  Locate on Map
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
