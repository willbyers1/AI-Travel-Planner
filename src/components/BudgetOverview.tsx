import React from 'react';
import { TripBudgetBreakdown } from '../types/trip';
import {
  DollarSign,
  Utensils,
  Ticket,
  Bus,
  BedDouble,
  Wallet,
  TrendingDown,
} from 'lucide-react';

interface BudgetOverviewProps {
  breakdown: TripBudgetBreakdown;
  currency: string;
  targetBudget: number;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  breakdown,
  currency,
  targetBudget,
}) => {
  const percentUsed = Math.min(
    100,
    Math.round((breakdown.totalEstimatedCost / (targetBudget || 1)) * 100)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <span>Budget & Cost Breakdown</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          Target: {targetBudget} {currency}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">
            Estimated Total: {breakdown.totalEstimatedCost} {currency}
          </span>
          <span
            className={
              breakdown.remainingBudget >= 0 ? 'text-emerald-400' : 'text-amber-400'
            }
          >
            {breakdown.remainingBudget >= 0
              ? `${breakdown.remainingBudget} ${currency} under target`
              : `${Math.abs(breakdown.remainingBudget)} ${currency} over target`}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed <= 90
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                : percentUsed <= 100
                ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                : 'bg-gradient-to-r from-rose-500 to-amber-500'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {/* Total Cost */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Est.</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {breakdown.totalEstimatedCost} <span className="text-xs text-slate-400">{currency}</span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily Avg</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {breakdown.dailyAverage} <span className="text-xs text-slate-400">{currency}</span>
          </div>
        </div>

        {/* Food */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Food / Dining</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            ~{breakdown.foodEstimate} <span className="text-xs text-slate-400">{currency}</span>
          </div>
        </div>

        {/* Activities */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Ticket className="w-3.5 h-3.5 text-indigo-400" />
            <span>Attractions</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            ~{breakdown.activitiesEstimate} <span className="text-xs text-slate-400">{currency}</span>
          </div>
        </div>

        {/* Transport & Stay */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Bus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transit & Misc</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            ~{breakdown.transportationEstimate + (breakdown.stayEstimate || 0)}{' '}
            <span className="text-xs text-slate-400">{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
