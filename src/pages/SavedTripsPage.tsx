import React from 'react';
import { Trip } from '../types/trip';
import { SavedTrips } from '../components/SavedTrips';

interface SavedTripsPageProps {
  trips: Trip[];
  onOpenTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
  onDuplicateTrip: (id: string) => void;
  onRenameTrip: (id: string, newName: string) => void;
  onPlanNewTrip: () => void;
}

export const SavedTripsPage: React.FC<SavedTripsPageProps> = (props) => {
  return <SavedTrips {...props} />;
};
