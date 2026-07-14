import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ShieldCheck, Map, CloudSun, ArrowRight, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const popularDestinations = [
    { name: "Paris", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80", tag: "Romance & Art" },
    { name: "Tokyo", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80", tag: "Tech & Tradition" },
    { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80", tag: "Urban Energy" },
    { name: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80", tag: "Ancient Wonders" }
  ];

  const handleSelectDest = (destName) => {
    navigate("/planner", { state: { presetDestination: destName } });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <span className="text-xs font-bold px-3 py-1.5 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-full uppercase tracking-wider">
            Discover the future of travel
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-slate-850 dark:text-white max-w-4xl mx-auto">
            Plan your next adventure with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
              AI Precision
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Get personalized itineraries grounded in real-time travel documents, local weather forecasts, and interactive mapping in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={() => navigate("/planner")} className="btn-primary flex items-center justify-center gap-2 py-4 px-8 text-base">
              <span>Start Planning</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => navigate("/chat")} className="btn-secondary flex items-center justify-center gap-2 py-4 px-8 text-base">
              <span>Talk to Assistant</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white">Popular Destinations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a preset destination to quickly generate sample itineraries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectDest(dest.name)}
              className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="h-48 w-full relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] bg-primary-600/80 backdrop-blur-sm px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {dest.tag}
                  </span>
                  <h4 className="text-xl font-bold mt-1">{dest.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white">Built for Smart Travelers</h2>
          <p className="text-slate-500 dark:text-slate-400">
            TripPlanner AI combines the reasoning of LLMs with local database documents and live APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* F1 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-850 dark:text-white">RAG Grounded Insights</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Every itinerary pulls citations from vetted local safety advice, dining lists, and destination guidelines.
            </p>
          </div>

          {/* F2 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
              <CloudSun className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-850 dark:text-white">Weather Forecast</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Plan with weather forecasts at hand, detailing temperature, precipitation probability, and seasonal changes.
            </p>
          </div>

          {/* F3 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
              <Map className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-850 dark:text-white">Interactive Leaflet Mapping</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              All recommended hotels, attractions, and restaurants are plotted immediately with custom icons and popup details.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-gradient-to-br from-primary-50/20 to-accent-50/20 py-16 rounded-3xl dark:from-slate-900/30">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-850 dark:text-white">Loved by Explorers</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Hear from global travelers who crafted their perfect journeys with our planner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-8">
          {/* T1 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
              "The Tokyo itinerary was spot on! The local rules RAG document gave us great hints about tipping etiquette and trash cans. The Leaflet map worked wonderfully without any setup."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center font-bold">SM</div>
              <div>
                <h5 className="font-bold text-xs">Sarah Mitchell</h5>
                <p className="text-[10px] text-slate-400">Solo Traveler, London</p>
              </div>
            </div>
          </div>

          {/* T2 */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
              "It generated a beautiful Paris honeymoon itinerary in seconds. Being able to export the whole day-by-day plan to PDF and sync it onto my phone made navigation extremely convenient."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center font-bold">JC</div>
              <div>
                <h5 className="font-bold text-xs">James Carter</h5>
                <p className="text-[10px] text-slate-400">Couple Traveler, San Francisco</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
