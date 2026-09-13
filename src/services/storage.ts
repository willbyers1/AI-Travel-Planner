import { Trip } from '../types/trip';

const STORAGE_KEY = 'ai_travel_planner_saved_trips_v1';

export const storageService = {
  getSavedTrips(): Trip[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.error('Failed to read saved trips from localStorage:', e);
      return [];
    }
  },

  getTripById(id: string): Trip | null {
    const trips = this.getSavedTrips();
    return trips.find((t) => t.id === id) || null;
  },

  saveTrip(trip: Trip): boolean {
    try {
      const trips = this.getSavedTrips();
      const existingIndex = trips.findIndex((t) => t.id === trip.id);
      const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

      if (existingIndex >= 0) {
        trips[existingIndex] = updatedTrip;
      } else {
        trips.unshift(updatedTrip);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return true;
    } catch (e) {
      console.error('Failed to save trip to localStorage:', e);
      return false;
    }
  },

  updateTripName(id: string, newName: string): boolean {
    try {
      const trips = this.getSavedTrips();
      const trip = trips.find((t) => t.id === id);
      if (trip) {
        trip.name = newName;
        trip.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update trip name:', e);
      return false;
    }
  },

  duplicateTrip(id: string): Trip | null {
    try {
      const original = this.getTripById(id);
      if (!original) return null;

      const duplicated: Trip = {
        ...JSON.parse(JSON.stringify(original)),
        id: 'trip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: `${original.name || original.request.destination} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.saveTrip(duplicated);
      return duplicated;
    } catch (e) {
      console.error('Failed to duplicate trip:', e);
      return null;
    }
  },

  deleteTrip(id: string): boolean {
    try {
      const trips = this.getSavedTrips();
      const filtered = trips.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete trip from localStorage:', e);
      return false;
    }
  },

  exportTripJSON(trip: Trip) {
    const filename = `${trip.request.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.json`;
    const blob = new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
