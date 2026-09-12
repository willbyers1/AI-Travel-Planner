export type TravelStyle =
  | 'Budget'
  | 'Balanced'
  | 'Luxury'
  | 'Adventure'
  | 'Relaxed'
  | 'Cultural'
  | 'Romantic'
  | 'Family';

export type Interest =
  | 'History'
  | 'Museums'
  | 'Nature'
  | 'Beaches'
  | 'Architecture'
  | 'Shopping'
  | 'Nightlife'
  | 'Photography'
  | 'Food'
  | 'Local culture'
  | 'Adventure';

export interface TripRequest {
  destination: string;
  days: number;
  totalBudget: number;
  currency: string;
  travelStyle: TravelStyle;
  interests: Interest[];
  foodPreferences?: string;
  additionalNotes?: string;
}

export interface ActivityLocation {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface ActivityItem {
  id: string;
  time: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'activity' | 'transport' | 'hotel';
  description: string;
  estimatedCost: number;
  durationMinutes: number;
  location: ActivityLocation;
  tips?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  estimatedDailyCost: number;
  activities: ActivityItem[];
}

export interface TripBudgetBreakdown {
  totalEstimatedCost: number;
  dailyAverage: number;
  foodEstimate: number;
  activitiesEstimate: number;
  transportationEstimate: number;
  stayEstimate?: number;
  remainingBudget: number;
}

export interface Trip {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  request: TripRequest;
  summary: string;
  currency: string;
  totalEstimatedCost: number;
  budgetBreakdown: TripBudgetBreakdown;
  days: DayItinerary[];
  tips: string[];
  destinationImage?: string;
}
