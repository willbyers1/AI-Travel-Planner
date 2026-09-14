import React from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStartPlanning: (destination?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPlanning }) => {
  const popularDestinations = [
    { name: 'Tokyo, Japan', days: '7 Days', style: 'Cultural & Food' },
    { name: 'Paris, France', days: '5 Days', style: 'Romantic & History' },
    { name: 'Rome, Italy', days: '4 Days', style: 'History & Architecture' },
    { name: 'Reykjavik, Iceland', days: '6 Days', style: 'Nature & Adventure' },
    { name: 'Istanbul, Turkey', days: '5 Days', style: 'Culture & Food' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Hero Bento Card */}
        <div className="bg-white border border-slate-200 rounded-[1.25rem] p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Itinerary Generator</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Your next adventure,{' '}
            <span className="text-blue-600">
              planned by AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Get personalized travel itineraries tailored to your destination, budget, style, and interests in seconds. Complete with Google Maps daily routes, dining spots, and budget estimates.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Plan New Trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Custom Itineraries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Google Maps Integration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Smart Budgeting</span>
            </div>
          </div>
        </div>

        {/* Popular Quick-Start Destinations */}
        <div className="bg-white border border-slate-200 rounded-[1.25rem] p-6 shadow-sm max-w-4xl mx-auto text-center space-y-3">
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Quick-start popular destinations:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => onStartPlanning(dest.name)}
                className="px-4 py-2 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all flex items-center gap-2 group cursor-pointer shadow-none"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900">{dest.name}</span>
                <span className="text-slate-500 font-normal">• {dest.days}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
