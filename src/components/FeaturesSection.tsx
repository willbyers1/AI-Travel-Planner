import React from 'react';
import {
  Sparkles,
  DollarSign,
  UtensilsCrossed,
  Map,
  BookmarkCheck,
  Zap,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Itineraries',
      description:
        'Generates comprehensive day-by-day travel schedules tailored strictly to your duration, style, and unique interests.',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Planning',
      description:
        'Calculates real-time estimates for food, activities, stay, and local transit so you stay strictly within budget.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Local Places & Dining',
      description:
        'Recommends top-rated local dining spots, hidden gems, and must-visit landmarks tailored to your preferences.',
    },
    {
      icon: Map,
      title: 'Interactive Google Maps',
      description:
        'Visualizes daily route points and activity pins directly on interactive Google Maps with zoom and location focusing.',
    },
    {
      icon: BookmarkCheck,
      title: 'Saved Trip Storage',
      description:
        'Save your itineraries locally, revisit them anytime, export as JSON, or duplicate to customize future variations.',
    },
    {
      icon: Zap,
      title: 'Instant Customization',
      description:
        'Select multiple interests—from history to nightlife or photography—to craft a truly personalized experience.',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Features & Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
            Everything you need for perfect trip planning
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Designed for travelers who want effortless, intelligent, and flexible trip organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-[1.25rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {feature.description}
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
