import React from 'react';
import { Compass, BookmarkCheck, Sparkles, MapPin, Key } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'plan' | 'saved' | 'how-it-works';
  setActiveTab: (tab: 'home' | 'plan' | 'saved' | 'how-it-works') => void;
  savedTripsCount: number;
  onOpenSettings: () => void;
  hasCustomKey?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedTripsCount,
  onOpenSettings,
  hasCustomKey = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              AI Travel Planner
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Smart itineraries powered by AI
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-slate-100 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'plan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Plan New Trip</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              activeTab === 'saved'
                ? 'bg-slate-100 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved Trips</span>
            {savedTripsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                {savedTripsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 hidden sm:flex ${
              activeTab === 'how-it-works'
                ? 'bg-slate-100 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>How It Works</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Bring Your Own Key (BYOK) Panel"
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors ml-1 flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">BYOK</span>
            {hasCustomKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Custom Key Active" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-blue-500" title="Key Panel" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
