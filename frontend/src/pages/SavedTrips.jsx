import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-serif"; // wait, react-router-dom!
import { useNavigate as useNav } from "react-router-dom";
import { Compass, Trash2, Calendar, MapPin, DollarSign, Eye, EyeOff, Printer, ArrowRight } from "lucide-react";
import { tripService, authService } from "../services/api";
import WeatherCard from "../components/WeatherCard";
import HotelCard from "../components/HotelCard";
import AttractionCard from "../components/AttractionCard";
import BudgetCard from "../components/BudgetCard";
import ItineraryCard from "../components/ItineraryCard";
import MapComponent from "../components/MapComponent";

export default function SavedTrips() {
  const navigate = useNav();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [parsedPlan, setParsedPlan] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getSavedTrips();
      setTrips(data);
    } catch (err) {
      console.error("Failed to load saved trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this saved trip?")) return;

    try {
      await tripService.deleteTrip(id);
      setTrips(trips.filter((t) => t.id !== id));
      if (selectedTrip?.id === id) {
        setSelectedTrip(null);
        setParsedPlan(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip.");
    }
  };

  const handleSelectTrip = (trip) => {
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(null);
      setParsedPlan(null);
      return;
    }
    
    setSelectedTrip(trip);
    try {
      // Parse itinerary JSON stored in DB
      const plan = JSON.parse(trip.itinerary_json);
      setParsedPlan(plan);
    } catch (err) {
      console.error(err);
      alert("Failed to parse saved itinerary data.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="no-print space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white">Saved Travel Plans</h1>
        <p className="text-sm text-slate-500">Access, preview, or manage your saved AI itineraries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List of saved trips */}
        <div className="no-print lg:col-span-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl animate-pulse h-32"></div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="glass-card p-10 text-center rounded-2xl border-dashed border-2 border-slate-205">
              <Compass className="h-12 w-12 text-slate-300 mx-auto animate-spin-slow" />
              <h4 className="font-bold text-slate-750 dark:text-white mt-3">No saved trips found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                Go to the planner page to create and save itineraries.
              </p>
              <button
                onClick={() => navigate("/planner")}
                className="btn-primary py-2 px-4 text-xs font-bold mt-4 flex items-center gap-1 mx-auto"
              >
                <span>Planner Page</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            trips.map((trip) => {
              const isSelected = selectedTrip?.id === trip.id;
              return (
                <div
                  key={trip.id}
                  onClick={() => handleSelectTrip(trip)}
                  className={`glass-card p-5 rounded-2xl cursor-pointer transition-all duration-200 border hover:shadow-md flex justify-between items-center ${
                    isSelected
                      ? "border-primary-500 bg-primary-50/10 dark:bg-primary-950/10"
                      : "border-slate-200/50 dark:border-slate-800"
                  }`}
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      {trip.days} Days • {trip.style}
                    </span>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-lg truncate">
                      {trip.destination}
                    </h3>
                    <p className="text-xs text-slate-400">
                      From {trip.source} • {trip.budget} budget
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDeleteTrip(e, trip.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-400 transition-colors"
                      title="Delete saved trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl">
                      {isSelected ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected preview column */}
        <div className="lg:col-span-8 space-y-6 print-container">
          {!selectedTrip ? (
            <div className="no-print glass-card py-20 px-8 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800/80">
              <Eye className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-700" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">Select an itinerary to preview</h3>
              <p className="text-slate-500 dark:text-slate-450 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                Click any of your saved trips in the sidebar to review the full details, weather conditions, places recommendations, and interactive map.
              </p>
            </div>
          ) : (
            parsedPlan && (
              <div className="space-y-6">
                {/* Save header info */}
                <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-200/50 dark:border-slate-850">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-full">
                      Saved Travel Plan
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-3">
                      Trip to {selectedTrip.destination}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-semibold">
                      {selectedTrip.days} Days Travel plan • {selectedTrip.style} ({selectedTrip.budget})
                    </p>
                  </div>
                  
                  <div className="no-print flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 dark:bg-slate-800 dark:hover:bg-slate-755 transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>

                {/* Grid: Weather & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <WeatherCard weather={parsedPlan.weather} />
                  <BudgetCard
                    budgetBreakdown={parsedPlan.itinerary.budget_breakdown}
                    totalCost={parsedPlan.itinerary.total_cost_estimate}
                    budgetCategory={parsedPlan.itinerary.budget_category}
                  />
                </div>

                {/* Grid: Map & Attractions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 space-y-6">
                    <AttractionCard
                      attractions={parsedPlan.places.attractions}
                      restaurants={parsedPlan.places.restaurants}
                    />
                    <HotelCard hotels={parsedPlan.places.hotels} />
                  </div>
                  <div className="lg:col-span-6 h-[400px] lg:h-auto min-h-[400px]">
                    <MapComponent
                      hotels={parsedPlan.places.hotels}
                      attractions={parsedPlan.places.attractions}
                      restaurants={parsedPlan.places.restaurants}
                    />
                  </div>
                </div>

                {/* Day-Wise Details */}
                <div className="glass-card p-6 rounded-3xl space-y-6">
                  <ItineraryCard itinerary={parsedPlan.itinerary.itinerary} />
                  
                  {/* Transport & local tips */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                    <h4 className="font-extrabold text-slate-800 dark:text-white">Local Travel Advice</h4>
                    <div className="space-y-2 text-sm text-slate-655 dark:text-slate-350 leading-relaxed">
                      <p className="font-semibold text-slate-750 dark:text-slate-200">
                        🚍 Transport: <span className="font-normal text-slate-600 dark:text-slate-400">{parsedPlan.itinerary.transport_suggestions}</span>
                      </p>
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-750 dark:text-slate-200 block">💡 Safety & Tips:</span>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                          {parsedPlan.itinerary.local_tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
