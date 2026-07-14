import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Compass, Sparkles, Plus, Check, Mic, MicOff, Save, Printer, ArrowLeft } from "lucide-react";
import { tripService, authService } from "../services/api";
import WeatherCard from "../components/WeatherCard";
import HotelCard from "../components/HotelCard";
import AttractionCard from "../components/AttractionCard";
import BudgetCard from "../components/BudgetCard";
import ItineraryCard from "../components/ItineraryCard";
import MapComponent from "../components/MapComponent";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function Planner() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Form State
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("Standard");
  const [style, setStyle] = useState("Solo");
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  // Speech Dictation for Interests
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  // Result state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripPlan, setTripPlan] = useState(null);
  
  // Selection coords for Map centering
  const [mapFocusCoords, setMapFocusCoords] = useState(null);
  
  // Trip saving state
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    
    // Check if preset destination passed from home
    if (location.state?.presetDestination) {
      setDestination(location.state.presetDestination);
      setSource("London"); // default sensible source
    }
  }, [location]);

  // Interests definitions
  const interestsList = [
    { id: "nature", label: "Nature & Parks", icon: "🌲" },
    { id: "food", label: "Local Food", icon: "🍲" },
    { id: "history", label: "History & Culture", icon: "🏛️" },
    { id: "shopping", label: "Shopping Centers", icon: "🛍️" },
    { id: "beaches", label: "Beaches & Relaxation", icon: "🏖️" }
  ];

  const handleToggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  // Setup Web Speech API for voice dictating interests/preferences
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    
    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase();
      // Match words against interests list
      const matched = [];
      if (text.includes("nature") || text.includes("park") || text.includes("forest")) matched.push("nature");
      if (text.includes("food") || text.includes("eat") || text.includes("restaurant") || text.includes("dining")) matched.push("food");
      if (text.includes("history") || text.includes("culture") || text.includes("museum") || text.includes("art")) matched.push("history");
      if (text.includes("shop") || text.includes("market") || text.includes("mall")) matched.push("shopping");
      if (text.includes("beach") || text.includes("sand") || text.includes("ocean") || text.includes("relaxation")) matched.push("beaches");
      
      if (matched.length > 0) {
        // Merge interests
        setSelectedInterests((prev) => [...new Set([...prev, ...matched])]);
      } else {
        setSpeechError(`Transcribed: "${text}" (No matching travel interest found. Try: nature, food, history, shopping, beaches)`);
      }
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
      setSpeechError("Speech recognition failed. Please try again.");
    };

    recognition.start();
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!source || !destination) {
      setError("Please specify both a starting city and a target destination.");
      return;
    }

    setLoading(true);
    setError("");
    setTripPlan(null);
    setIsSaved(false);
    setMapFocusCoords(null);

    const interestsToSend = selectedInterests.length > 0 ? selectedInterests : ["food", "history"];

    try {
      const plan = await tripService.planTrip({
        source,
        destination,
        days: Number(days),
        budget,
        style,
        interests: interestsToSend
      });
      setTripPlan(plan);
    } catch (err) {
      console.error(err);
      setError("Failed to generate plan. Please verify the backend is running and Gemini configurations are set.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!authService.isAuthenticated()) {
      alert("Please sign in or create an account to save itineraries.");
      navigate("/login");
      return;
    }

    setSaveLoading(true);
    try {
      const interestsToSend = selectedInterests.length > 0 ? selectedInterests : ["food", "history"];
      await tripService.saveTrip({
        source,
        destination,
        days: Number(days),
        budget,
        style,
        interests: interestsToSend,
        itinerary_json: JSON.stringify(tripPlan)
      });
      setIsSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save trip. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectCoords = (place) => {
    if (place.lat && place.lng) {
      setMapFocusCoords([place.lat, place.lng]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button visible in print preview mode */}
      <button onClick={() => navigate("/")} className="no-print text-sm font-semibold flex items-center gap-1.5 text-slate-500 hover:text-slate-750 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="no-print lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary-600 animate-pulse" />
              <span>Create New Plan</span>
            </h2>
            <p className="text-xs text-slate-500">Provide details to generate custom itinerary</p>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-5">
            {/* Source */}
            <div>
              <label className="form-label">Starting City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. London"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="form-label">Destination City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Paris or Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Days & Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Budget Level</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="form-input pl-10 appearance-none font-semibold text-sm"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="form-label">Travel Style</label>
              <div className="grid grid-cols-3 gap-2">
                {["Solo", "Couple", "Family", "Adventure", "Luxury"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      style === item
                        ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20"
                        : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700/80 text-slate-600 dark:text-slate-350"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests checklist */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="form-label mb-0">Interests</label>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isListening
                      ? "bg-red-500 border-red-500 text-white animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  title="Speak interests like: nature, food, history, shopping, beaches"
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListening ? "Listening..." : "Dictate"}</span>
                </button>
              </div>

              {speechError && (
                <p className="text-[10px] text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg leading-tight">
                  {speechError}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {interestsList.map((interest) => {
                  const isChecked = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleToggleInterest(interest.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-450"
                          : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700/80 text-slate-650 dark:text-slate-350"
                      }`}
                    >
                      <span className="text-sm">{interest.icon}</span>
                      <span className="truncate">{interest.label}</span>
                      {isChecked && <Check className="h-3.5 w-3.5 shrink-0 ml-auto text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2">
              <Sparkles className="h-4.5 w-4.5" />
              <span>Generate AI Plan</span>
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-6 print-container">
          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} onRetry={() => setError("")} />}

          {!loading && !error && !tripPlan && (
            <div className="glass-card py-20 px-8 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800/80">
              <Compass className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-700 animate-bounce" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">Your travel plan details will appear here</h3>
              <p className="text-slate-500 dark:text-slate-450 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                Configure your destination, duration, style, and interests in the planner form to generate a full grounded AI itinerary.
              </p>
            </div>
          )}

          {/* Generated Result display */}
          {tripPlan && (
            <div className="space-y-6">
              {/* Trip Title / Header */}
              <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-200/50 dark:border-slate-850 relative overflow-hidden">
                <div className="relative">
                  <span className="text-xs font-bold px-2.5 py-1 bg-primary-100 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-full">
                    AI Trip Itinerary
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-3">
                    Trip to {tripPlan.itinerary.destination}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-semibold">
                    {tripPlan.itinerary.days} Days Travel plan • {tripPlan.itinerary.travel_style} ({tripPlan.itinerary.budget_category})
                  </p>
                </div>
                
                {/* Actions */}
                <div className="no-print flex gap-2 shrink-0">
                  <button
                    onClick={handleSaveTrip}
                    disabled={isSaved || saveLoading}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                      isSaved
                        ? "bg-emerald-55 border-emerald-500 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-450"
                        : "bg-white hover:bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaved ? "Saved" : saveLoading ? "Saving..." : "Save Trip"}</span>
                  </button>
                  
                  <button
                    onClick={handlePrint}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs flex items-center gap-2 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Grid: Weather & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherCard weather={tripPlan.weather} />
                <BudgetCard
                  budgetBreakdown={tripPlan.itinerary.budget_breakdown}
                  totalCost={tripPlan.itinerary.total_cost_estimate}
                  budgetCategory={tripPlan.itinerary.budget_category}
                />
              </div>

              {/* Grid: Map and Places Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Attractions & Recommendations */}
                <div className="lg:col-span-6 space-y-6">
                  <AttractionCard
                    attractions={tripPlan.places.attractions}
                    restaurants={tripPlan.places.restaurants}
                    onSelectPlace={handleSelectCoords}
                  />
                  <HotelCard
                    hotels={tripPlan.places.hotels}
                    onSelectHotel={handleSelectCoords}
                  />
                </div>

                {/* Map Component */}
                <div className="lg:col-span-6 h-[400px] lg:h-full min-h-[400px]">
                  <MapComponent
                    hotels={tripPlan.places.hotels}
                    attractions={tripPlan.places.attractions}
                    restaurants={tripPlan.places.restaurants}
                    selectCoords={mapFocusCoords}
                  />
                </div>
              </div>

              {/* Day-Wise Details */}
              <div className="grid grid-cols-1 gap-6">
                <div className="glass-card p-6 rounded-3xl space-y-6">
                  <ItineraryCard itinerary={tripPlan.itinerary.itinerary} />
                  
                  {/* Transport & local tips */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                    <h4 className="font-extrabold text-slate-800 dark:text-white">Local Travel Advice</h4>
                    <div className="space-y-2 text-sm text-slate-655 dark:text-slate-350 leading-relaxed">
                      <p className="font-semibold text-slate-750 dark:text-slate-200">
                        🚍 Transport: <span className="font-normal text-slate-600 dark:text-slate-400">{tripPlan.itinerary.transport_suggestions}</span>
                      </p>
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-750 dark:text-slate-200 block">💡 Safety & Tips:</span>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                          {tripPlan.itinerary.local_tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
