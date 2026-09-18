import React, { useState } from 'react';
import { Trip } from '../types/trip';
import {
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Check,
  Download,
  Share2,
  Sparkles,
  ArrowLeft,
  Compass,
} from 'lucide-react';

interface TripHeaderProps {
  trip: Trip;
  isSaved: boolean;
  onSave: () => void;
  onExport: () => void;
  onBackToPlan: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  isSaved,
  onSave,
  onExport,
  onBackToPlan,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-6">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBackToPlan}
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={onExport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export Itinerary JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onSave}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              isSaved
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Trip Saved' : 'Save Trip'}</span>
          </button>
        </div>
      </div>

      {/* Destination & Meta */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            {trip.request.travelStyle} Style
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {trip.request.days} Days
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Target: {trip.request.totalBudget} {trip.currency}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <MapPin className="w-8 h-8 text-cyan-400 shrink-0" />
          <span>{trip.request.destination}</span>
        </h1>

        {/* AI Summary Quote Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed relative">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="italic">{trip.summary}</p>
          </div>
        </div>

        {/* Interests Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1">Interests:</span>
          {trip.request.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700/60"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
