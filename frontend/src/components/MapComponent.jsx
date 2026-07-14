import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset path issues in React
// We construct a custom SVG pin to avoid loading standard asset files that might be missing
const createCustomIcon = (type) => {
  let color = "#2563eb"; // default primary blue
  if (type === "hotel") color = "#f59e0b"; // amber
  if (type === "restaurant") color = "#10b981"; // emerald

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    className: "custom-map-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component helper to handle map pan/zoom changes reactively
function MapRefocus({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ hotels = [], attractions = [], restaurants = [], selectCoords = null }) {
  // Compute default center
  let defaultCenter = [48.8566, 2.3522]; // Default to Paris
  if (selectCoords) {
    defaultCenter = selectCoords;
  } else if (attractions.length > 0 && attractions[0].lat) {
    defaultCenter = [attractions[0].lat, attractions[0].lng];
  } else if (hotels.length > 0 && hotels[0].lat) {
    defaultCenter = [hotels[0].lat, hotels[0].lng];
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-lg relative min-h-[350px] md:min-h-[500px]">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Focus center refocus element */}
        <MapRefocus center={selectCoords || defaultCenter} />

        {/* Hotels Markers */}
        {hotels.map((hotel, idx) => (
          hotel.lat && (
            <Marker key={`hotel-${idx}`} position={[hotel.lat, hotel.lng]} icon={createCustomIcon("hotel")}>
              <Popup>
                <div className="text-slate-900 font-semibold p-1">
                  <h4 className="font-bold text-sm text-amber-600">{hotel.name}</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">{hotel.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold">{hotel.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Attractions Markers */}
        {attractions.map((attraction, idx) => (
          attraction.lat && (
            <Marker key={`attraction-${idx}`} position={[attraction.lat, attraction.lng]} icon={createCustomIcon("attraction")}>
              <Popup>
                <div className="text-slate-900 font-semibold p-1">
                  <h4 className="font-bold text-sm text-blue-600">{attraction.name}</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">{attraction.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold">{attraction.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Restaurants Markers */}
        {restaurants.map((restaurant, idx) => (
          restaurant.lat && (
            <Marker key={`restaurant-${idx}`} position={[restaurant.lat, restaurant.lng]} icon={createCustomIcon("restaurant")}>
              <Popup>
                <div className="text-slate-900 font-semibold p-1">
                  <h4 className="font-bold text-sm text-emerald-600">{restaurant.name}</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">{restaurant.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold">{restaurant.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
