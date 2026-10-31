import React, { useState } from 'react';
import { Trip, ActivityItem } from '../types/trip';
import { TripHeader } from '../components/TripHeader';
import { BudgetOverview } from '../components/BudgetOverview';
import { ItineraryView } from '../components/ItineraryView';
import { MapView } from '../components/MapView';

interface TripResultProps {
  trip: Trip;
  isSaved: boolean;
  onSaveTrip: () => void;
  onExportTrip: () => void;
  onBackToPlan: () => void;
}

export const TripResult: React.FC<TripResultProps> = ({
  trip,
  isSaved,
  onSaveTrip,
  onExportTrip,
  onBackToPlan,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | undefined>(
    trip.days?.[0]?.activities?.[0]
  );

  const currentDayItinerary = trip.days.find((d) => d.day === selectedDay) || trip.days[0];

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
    const dayObj = trip.days.find((d) => d.day === dayNum);
    if (dayObj && dayObj.activities.length > 0) {
      setSelectedActivity(dayObj.activities[0]);
    }
  };

  const handleSelectActivity = (activity: ActivityItem) => {
    setSelectedActivity(activity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Banner */}
      <TripHeader
        trip={trip}
        isSaved={isSaved}
        onSave={onSaveTrip}
        onExport={onExportTrip}
        onBackToPlan={onBackToPlan}
      />

      {/* Budget Breakdown Overview */}
      <BudgetOverview
        breakdown={trip.budgetBreakdown}
        currency={trip.currency}
        targetBudget={trip.request.totalBudget}
      />

      {/* Main Split Layout: Itinerary Timeline & Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Itinerary Timeline */}
        <div className="lg:col-span-7">
          <ItineraryView
            days={trip.days}
            currency={trip.currency}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            selectedActivityId={selectedActivity?.id}
            onSelectActivity={handleSelectActivity}
          />
        </div>

        {/* Right Column: Google Maps Interactive View */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <MapView
            destination={trip.request.destination}
            dayItinerary={currentDayItinerary}
            selectedActivity={selectedActivity}
            onSelectActivity={handleSelectActivity}
          />

          {/* General Travel Tips Section */}
          {trip.tips && trip.tips.length > 0 && (
            <div className="p-6 rounded-[1.25rem] bg-slate-900 text-white shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>💡 Travel Advice for {trip.request.destination}</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed font-normal">
                {trip.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
