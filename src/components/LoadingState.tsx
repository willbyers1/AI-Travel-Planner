import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  destination: string;
  days: number;
}

const LOADING_MESSAGES = [
  'Analyzing your destination & local landmarks...',
  'Finding experiences tailored to your travel style...',
  'Curating top-rated local dining & cultural highlights...',
  'Calculating daily estimated budget & activity costs...',
  'Optimizing Google Maps daily route coordinates...',
  'Finalizing your personalized travel itinerary...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({ destination, days }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(
    100,
    Math.round(((currentMessageIndex + 1) / LOADING_MESSAGES.length) * 100)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-[1.25rem] p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto my-8 space-y-8">
      {/* Animated Icon Glow */}
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 animate-pulse mx-auto">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-900 text-white border border-slate-800">
          <Sparkles className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* Main Status Heading */}
      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Planning your {days}-day trip to{' '}
          <span className="text-blue-600">
            {destination}
          </span>
        </h3>
        <p className="text-sm text-blue-600 font-semibold flex items-center justify-center gap-1.5 min-h-[24px]">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{LOADING_MESSAGES[currentMessageIndex]}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto space-y-2">
        <div className="w-full h-3 bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-mono font-medium">
          <span>{progressPercentage}% Completed</span>
          <span>AI Engine</span>
        </div>
      </div>

      {/* Step checklist preview */}
      <div className="pt-6 border-t border-slate-100 max-w-lg mx-auto text-left space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <CheckCircle2
            className={`w-4 h-4 ${
              currentMessageIndex >= 0 ? 'text-blue-600' : 'text-slate-300'
            }`}
          />
          <span>Destination & Travel Style Context</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <CheckCircle2
            className={`w-4 h-4 ${
              currentMessageIndex >= 2 ? 'text-blue-600' : 'text-slate-300'
            }`}
          />
          <span>Daily Timelines & Attraction Selections</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
          <CheckCircle2
            className={`w-4 h-4 ${
              currentMessageIndex >= 4 ? 'text-blue-600' : 'text-slate-300'
            }`}
          />
          <span>Route Optimization & Budget Breakdown</span>
        </div>
      </div>
    </div>
  );
};
