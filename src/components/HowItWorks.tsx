import React from 'react';
import { FormInput, Cpu, MapPin, Bookmark } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: FormInput,
      title: 'Enter Destination & Budget',
      description:
        'Specify where you want to go, trip length, total budget, travel style, and specific interests or dietary preferences.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'AI Crafts Your Itinerary',
      description:
        'Our AI engine analyzes top attractions, optimal travel times, local dining, and daily cost limits to generate your trip.',
    },
    {
      step: '03',
      icon: MapPin,
      title: 'Explore Route & Map',
      description:
        'Review the daily timeline with interactive Google Maps route pins, time slots, estimated costs, and travel tips.',
    },
    {
      step: '04',
      icon: Bookmark,
      title: 'Save & Manage Trips',
      description:
        'Save your trip locally to review offline, duplicate to edit variations, or export to share with friends.',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
            How AI Travel Planner Works
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            From idea to complete itinerary in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-[1.25rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-slate-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
