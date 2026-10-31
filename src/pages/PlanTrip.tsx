import React, { useState } from 'react';
import { Key, Sparkles, CheckCircle2 } from 'lucide-react';
import { TripRequest, Trip } from '../types/trip';
import { TripForm } from '../components/TripForm';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { generateTripItinerary } from '../services/aiService';

interface PlanTripProps {
  initialDestination?: string;
  onTripGenerated: (trip: Trip) => void;
  customKeys?: { openAIKey?: string; geminiKey?: string };
  onOpenSettings: () => void;
}

export const PlanTrip: React.FC<PlanTripProps> = ({
  initialDestination = '',
  onTripGenerated,
  customKeys,
  onOpenSettings,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<TripRequest | null>(null);

  const hasCustomKey = Boolean(customKeys?.geminiKey || customKeys?.openAIKey);

  const handleSubmit = async (request: TripRequest) => {
    setCurrentRequest(request);
    setLoading(true);
    setError(null);

    try {
      const generatedTrip = await generateTripItinerary(request, customKeys);
      setLoading(false);
      onTripGenerated(generatedTrip);
    } catch (err: any) {
      console.error('Trip generation error:', err);
      setLoading(false);
      setError(
        err.message || 'Failed to generate itinerary. Please verify your request parameters and API keys.'
      );
    }
  };

  if (loading && currentRequest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState
          destination={currentRequest.destination}
          days={currentRequest.days}
        />
      </div>
    );
  }

  if (error && currentRequest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          message={error}
          onRetry={() => handleSubmit(currentRequest)}
          onOpenSettings={onOpenSettings}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* BYOK Info Banner */}
      <div className="max-w-4xl mx-auto bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5 text-blue-900 font-semibold">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold flex items-center gap-1.5 text-sm text-slate-900">
              Bring Your Own Key (BYOK)
              {hasCustomKey && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Key Active
                </span>
              )}
            </span>
            <p className="text-slate-600 font-normal text-xs">
              {hasCustomKey
                ? 'Your custom API key is active and ready for AI trip generation.'
                : 'Need custom speed or limits? Optionally add your personal Gemini or OpenAI key.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{hasCustomKey ? 'Manage BYOK Keys' : 'Configure BYOK Key'}</span>
        </button>
      </div>

      <TripForm
        initialDestination={initialDestination}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};
