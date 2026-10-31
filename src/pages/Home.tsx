import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorks } from '../components/HowItWorks';
import { Compass, Sparkles, MapPin, Heart } from 'lucide-react';

interface HomeProps {
  onStartPlanning: (destination?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartPlanning }) => {
  return (
    <div className="space-y-0">
      <Hero onStartPlanning={onStartPlanning} />
      <FeaturesSection />
      <HowItWorks />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">AI Travel Planner</div>
              <p className="text-[11px] text-slate-500">
                AI-driven travel itineraries, routes & budget management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-600 font-medium">
            <button
              onClick={() => onStartPlanning()}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Plan Trip
            </button>
            <span>•</span>
            <span className="text-slate-500">Powered by Gemini & Google Maps</span>
          </div>

          <div className="text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} AI Travel Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
