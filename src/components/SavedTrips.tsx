import React, { useState } from 'react';
import { Trip } from '../types/trip';
import {
  BookmarkCheck,
  Search,
  Calendar,
  DollarSign,
  Trash2,
  Edit2,
  Copy,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Compass,
} from 'lucide-react';

interface SavedTripsProps {
  trips: Trip[];
  onOpenTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
  onDuplicateTrip: (id: string) => void;
  onRenameTrip: (id: string, newName: string) => void;
  onPlanNewTrip: () => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({
  trips,
  onOpenTrip,
  onDeleteTrip,
  onDuplicateTrip,
  onRenameTrip,
  onPlanNewTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [renameModalTrip, setRenameModalTrip] = useState<{ id: string; name: string } | null>(null);

  const filteredTrips = trips.filter(
    (t) =>
      t.request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.request.travelStyle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameModalTrip && renameModalTrip.name.trim()) {
      onRenameTrip(renameModalTrip.id, renameModalTrip.name.trim());
      setRenameModalTrip(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Trips ({trips.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, manage, rename, or export your saved travel plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
            />
          </div>

          <button
            onClick={onPlanNewTrip}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {trips.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-[1.25rem] p-8 max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Saved Trips Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate your first AI itinerary and click "Save Trip" to keep it stored here.
          </p>
          <button
            onClick={onPlanNewTrip}
            className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Plan Your First Trip</span>
          </button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No saved trips matched "{searchQuery}".
        </div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white border border-slate-200 rounded-[1.25rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{trip.request.travelStyle} Style</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono font-medium">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="line-clamp-1">{trip.name || trip.request.destination}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                    {trip.summary}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {trip.request.days} Days
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-1 font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {trip.totalEstimatedCost} {trip.currency}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setRenameModalTrip({ id: trip.id, name: trip.name || trip.request.destination })
                    }
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Rename Trip"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDuplicateTrip(trip.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Duplicate Trip"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(trip.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenTrip(trip)}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[1.25rem] p-6 max-w-sm w-full space-y-4 shadow-lg text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Delete Saved Trip?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this trip itinerary? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTrip(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModalTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRenameSubmit}
            className="bg-white border border-slate-200 rounded-[1.25rem] p-6 max-w-sm w-full space-y-4 shadow-lg text-slate-900"
          >
            <h3 className="text-lg font-bold text-slate-900">Rename Trip Itinerary</h3>
            <input
              type="text"
              value={renameModalTrip.name}
              onChange={(e) =>
                setRenameModalTrip({ ...renameModalTrip, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameModalTrip(null)}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Save Name
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
