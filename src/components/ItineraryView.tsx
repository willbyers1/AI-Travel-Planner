import React from 'react';
import { DayItinerary, ActivityItem } from '../types/trip';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Ticket,
  Bus,
  BedDouble,
  Compass,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

interface ItineraryViewProps {
  days: DayItinerary[];
  currency: string;
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
  selectedActivityId?: string;
  onSelectActivity: (activity: ActivityItem) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  days,
  currency,
  selectedDay,
  onSelectDay,
  selectedActivityId,
  onSelectActivity,
}) => {
  const currentDay = days.find((d) => d.day === selectedDay) || days[0];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-emerald-400" />;
      case 'hotel':
        return <BedDouble className="w-4 h-4 text-purple-400" />;
      case 'activity':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      default:
        return <Ticket className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'transport':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'hotel':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'activity':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Day Tabs Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Daily Itinerary</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {days.length} Total Days
          </span>
        </div>

        {/* Day selector pill tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((d) => {
            const isActive = d.day === selectedDay;
            return (
              <button
                key={d.day}
                onClick={() => onSelectDay(d.day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>Day {d.day}</span>
                <span className="text-[10px] opacity-80 font-normal">
                  (~{d.estimatedDailyCost} {currency})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Day Header */}
      {currentDay && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Day {currentDay.day} Highlights
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {currentDay.title}
            </h4>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
            Est. Daily Cost: <span className="text-cyan-400 font-bold">{currentDay.estimatedDailyCost} {currency}</span>
          </div>
        </div>
      )}

      {/* Activities Timeline */}
      <div className="space-y-4 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {currentDay?.activities.map((activity, index) => {
          const isSelected = selectedActivityId === activity.id;

          return (
            <div
              key={activity.id || index}
              className={`relative pl-10 transition-all rounded-xl p-4 border ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Timeline marker icon */}
              <div
                className={`absolute left-2.5 top-5 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                  isSelected
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                    : 'bg-slate-900 border-slate-700 text-cyan-400'
                }`}
              >
                {index + 1}
              </div>

              {/* Activity details header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.time}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1 capitalize ${getActivityBadgeColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                      <span>{activity.type}</span>
                    </span>
                  </div>

                  <h5 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{activity.name}</span>
                  </h5>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                    {activity.estimatedCost > 0
                      ? `${activity.estimatedCost} ${currency}`
                      : 'Free / Included'}
                  </span>

                  <button
                    onClick={() => onSelectActivity(activity)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              {activity.location?.address && (
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="line-clamp-1">{activity.location.address}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                {activity.description}
              </p>

              {/* Tips or duration footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Duration: {activity.durationMinutes} mins
                </span>

                {activity.tips && (
                  <span className="flex items-center gap-1 text-amber-300/90 italic text-[11px]">
                    <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                    Tip: {activity.tips}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
