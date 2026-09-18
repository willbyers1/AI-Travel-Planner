import React, { useState } from 'react';
import {
  TripRequest,
  TravelStyle,
  Interest,
} from '../types/trip';
import {
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Compass,
  Utensils,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';

interface TripFormProps {
  initialDestination?: string;
  onSubmit: (request: TripRequest) => void;
  isLoading?: boolean;
}

const TRAVEL_STYLES: { id: TravelStyle; label: string; description: string }[] = [
  { id: 'Balanced', label: 'Balanced', description: 'Best mix of sights, food, and relaxation' },
  { id: 'Budget', label: 'Budget', description: 'Hostels, public transit & free sights' },
  { id: 'Luxury', label: 'Luxury', description: '5-star dining, private tours & fine stays' },
  { id: 'Adventure', label: 'Adventure', description: 'Hiking, outdoor activities & thrill' },
  { id: 'Relaxed', label: 'Relaxed', description: 'Leisurely pace, cafes & scenic views' },
  { id: 'Cultural', label: 'Cultural', description: 'Museums, historical landmarks & heritage' },
  { id: 'Romantic', label: 'Romantic', description: 'Cozy spots, scenic dining & sunset spots' },
  { id: 'Family', label: 'Family', description: 'Kid-friendly, safe & accessible spots' },
];

const INTERESTS: Interest[] = [
  'History',
  'Museums',
  'Nature',
  'Beaches',
  'Architecture',
  'Shopping',
  'Nightlife',
  'Photography',
  'Food',
  'Local culture',
  'Adventure',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'TRY', symbol: '₺', label: 'TRY (₺)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF' },
];

export const TripForm: React.FC<TripFormProps> = ({
  initialDestination = '',
  onSubmit,
  isLoading = false,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [days, setDays] = useState<number>(5);
  const [totalBudget, setTotalBudget] = useState<number>(1500);
  const [currency, setCurrency] = useState<string>('USD');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([
    'History',
    'Food',
    'Local culture',
  ]);
  const [foodPreferences, setFoodPreferences] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    destination?: string;
    days?: string;
    totalBudget?: string;
    interests?: string;
  }>({});

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length === 1) {
        setErrors((prev) => ({
          ...prev,
          interests: 'Please select at least one interest',
        }));
        return;
      }
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
      if (errors.interests) {
        setErrors((prev) => ({ ...prev, interests: undefined }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: {
      destination?: string;
      days?: string;
      totalBudget?: string;
      interests?: string;
    } = {};

    if (!destination || !destination.trim()) {
      newErrors.destination = 'Please enter a travel destination.';
    } else if (destination.trim().length < 2) {
      newErrors.destination = 'Destination name is too short.';
    }

    if (!days || days < 1) {
      newErrors.days = 'Trip duration must be at least 1 day.';
    } else if (days > 30) {
      newErrors.days = 'Maximum supported trip duration is 30 days.';
    }

    if (!totalBudget || totalBudget <= 0) {
      newErrors.totalBudget = 'Total budget must be a positive number greater than 0.';
    } else if (totalBudget < days * 15) {
      newErrors.totalBudget = `Budget might be too low for ${days} days (suggested min $${days * 15}).`;
    }

    if (selectedInterests.length === 0) {
      newErrors.interests = 'Please select at least one interest.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      destination: destination.trim(),
      days: Number(days),
      totalBudget: Number(totalBudget),
      currency,
      travelStyle,
      interests: selectedInterests,
      foodPreferences: foodPreferences.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-[1.25rem] p-6 sm:p-8 shadow-sm text-slate-900 max-w-4xl mx-auto space-y-8"
    >
      {/* Form Title */}
      <div className="border-b border-slate-100 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Travel Generator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Create Your Custom Travel Itinerary
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide your trip parameters below and let AI construct your personalized plan.
        </p>
      </div>

      {/* Row 1: Destination & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Destination Input */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Where do you want to go? <span className="text-blue-600">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (errors.destination) {
                  setErrors((prev) => ({ ...prev, destination: undefined }));
                }
              }}
              placeholder="e.g. Tokyo, Paris, Barcelona, Bali, New York"
              className={`w-full px-4 py-3 bg-slate-50 border ${
                errors.destination ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
              } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm transition-all font-medium`}
            />
          </div>
          {errors.destination && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.destination}</span>
            </p>
          )}
        </div>

        {/* Days / Duration Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Duration (Days) <span className="text-blue-600">*</span>
            </span>
            <span className="text-xs text-blue-600 font-bold">{days} Days</span>
          </label>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setDays(isNaN(val) ? 1 : Math.min(30, Math.max(1, val)));
                if (errors.days) {
                  setErrors((prev) => ({ ...prev, days: undefined }));
                }
              }}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-center text-sm focus:outline-none focus:border-blue-600"
            />
            <input
              type="range"
              min={1}
              max={14}
              value={Math.min(days, 14)}
              onChange={(e) => {
                setDays(parseInt(e.target.value, 10));
                if (errors.days) {
                  setErrors((prev) => ({ ...prev, days: undefined }));
                }
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
          {errors.days && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.days}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Total Budget & Currency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Total Estimated Budget <span className="text-blue-600">*</span>
            </span>
            <span className="text-xs text-slate-500">
              ~{Math.round(totalBudget / (days || 1))} {currency} / day
            </span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 font-bold text-sm">
              {CURRENCIES.find((c) => c.code === currency)?.symbol || '$'}
            </span>
            <input
              type="number"
              min={10}
              step={50}
              value={totalBudget}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTotalBudget(isNaN(val) ? 0 : val);
                if (errors.totalBudget) {
                  setErrors((prev) => ({ ...prev, totalBudget: undefined }));
                }
              }}
              placeholder="e.g. 1500"
              className={`w-full pl-9 pr-4 py-3 bg-slate-50 border ${
                errors.totalBudget ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600 focus:bg-white'
              } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm transition-all font-bold`}
            />
          </div>
          {errors.totalBudget && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.totalBudget}</span>
            </p>
          )}
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Travel Style */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-blue-600" />
          Select Travel Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRAVEL_STYLES.map((style) => {
            const isSelected = travelStyle === style.id;
            return (
              <button
                type="button"
                key={style.id}
                onClick={() => setTravelStyle(style.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{style.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Interests Multi-Select */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Interests & Activities (Select multiple)
          </span>
          <span className="text-xs text-slate-500">
            {selectedInterests.length} selected
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                <span>{interest}</span>
              </button>
            );
          })}
        </div>
        {errors.interests && (
          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.interests}</span>
          </p>
        )}
      </div>

      {/* Row 5: Food Preferences & Additional Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Preferences */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-amber-600" />
            Food Preferences / Dietary Needs
          </label>
          <input
            type="text"
            value={foodPreferences}
            onChange={(e) => setFoodPreferences(e.target.value)}
            placeholder="e.g. Vegetarian, Local street food, Halal, Seafood focus"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Additional Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            Special Requests / Notes
          </label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Traveling with kids, avoid early mornings, romantic spots"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Submit CTA */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Generate Itinerary</span>
        </button>
      </div>
    </form>
  );
};
