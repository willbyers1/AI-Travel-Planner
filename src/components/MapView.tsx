import React, { useEffect, useState, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { DayItinerary, ActivityItem } from '../types/trip';
import { MapPin, Navigation, Compass, ExternalLink, Key } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapViewProps {
  destination: string;
  dayItinerary?: DayItinerary;
  selectedActivity?: ActivityItem;
  onSelectActivity?: (act: ActivityItem) => void;
}

// Map Controller Subcomponent to handle geocoding & centering
function MapController({
  destination,
  activities,
  selectedActivity,
}: {
  destination: string;
  activities: ActivityItem[];
  selectedActivity?: ActivityItem;
}) {
  const map = useMap();
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!geocoderRef.current && window.google?.maps?.Geocoder) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    if (selectedActivity?.location?.address || selectedActivity?.location?.name) {
      const addressToGeocode =
        selectedActivity.location.address || `${selectedActivity.location.name}, ${destination}`;
      if (geocoderRef.current) {
        geocoderRef.current.geocode(
          { address: addressToGeocode },
          (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              map.panTo(results[0].geometry.location);
              map.setZoom(15);
            }
          }
        );
      }
    } else if (destination && geocoderRef.current) {
      geocoderRef.current.geocode({ address: destination }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          map.panTo(results[0].geometry.location);
          map.setZoom(12);
        }
      });
    }
  }, [map, destination, selectedActivity]);

  return null;
}

// Inner Map component when key is valid
const GoogleMapInner: React.FC<MapViewProps> = ({
  destination,
  dayItinerary,
  selectedActivity,
  onSelectActivity,
}) => {
  const [activeMarkerActivity, setActiveMarkerActivity] = useState<ActivityItem | null>(null);

  useEffect(() => {
    if (selectedActivity) {
      setActiveMarkerActivity(selectedActivity);
    }
  }, [selectedActivity]);

  const activities = dayItinerary?.activities || [];

  return (
    <div className="relative w-full h-[450px] lg:h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <Map
        defaultCenter={{ lat: 48.8566, lng: 2.3522 }} // Default Paris fallback
        defaultZoom={12}
        mapId="AI_TRAVEL_PLANNER_MAP"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <MapController
          destination={destination}
          activities={activities}
          selectedActivity={selectedActivity}
        />

        {activities.map((act, index) => {
          const position = act.location?.lat && act.location?.lng
            ? { lat: act.location.lat, lng: act.location.lng }
            : null;

          // If no lat/lng provided directly, AdvancedMarker will be placed via geocoded positions or list
          if (!position) return null;

          const isSelected = activeMarkerActivity?.id === act.id;

          return (
            <AdvancedMarker
              key={act.id || index}
              position={position}
              onClick={() => {
                setActiveMarkerActivity(act);
                if (onSelectActivity) onSelectActivity(act);
              }}
            >
              <Pin
                background={isSelected ? '#06b6d4' : '#3b82f6'}
                borderColor="#0f172a"
                glyphColor="#ffffff"
                glyphText={`${index + 1}`}
              />
            </AdvancedMarker>
          );
        })}

        {activeMarkerActivity && activeMarkerActivity.location?.lat && activeMarkerActivity.location?.lng && (
          <InfoWindow
            position={{
              lat: activeMarkerActivity.location.lat,
              lng: activeMarkerActivity.location.lng,
            }}
            onCloseClick={() => setActiveMarkerActivity(null)}
          >
            <div className="p-2 text-slate-900 max-w-xs space-y-1">
              <div className="font-bold text-sm text-slate-900">
                {activeMarkerActivity.name}
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                <span>{activeMarkerActivity.location.address || destination}</span>
              </div>
              <p className="text-xs text-slate-700 line-clamp-2 mt-1">
                {activeMarkerActivity.description}
              </p>
              <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-cyan-700 border-t border-slate-200 mt-1">
                <span>Cost: {activeMarkerActivity.estimatedCost}</span>
                <span>Time: {activeMarkerActivity.time}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-lg">
        <Navigation className="w-4 h-4 text-cyan-400" />
        <span>{destination} Day {dayItinerary?.day || 1} Map Route</span>
      </div>
    </div>
  );
};

export const MapView: React.FC<MapViewProps> = (props) => {
  // If no Google Maps API key provided, render the mandatory skill splash screen
  if (!hasValidKey) {
    return (
      <div className="w-full h-[450px] lg:h-[600px] rounded-2xl bg-slate-900 border border-slate-800 p-8 flex items-center justify-center text-slate-100 shadow-xl">
        <div className="text-center max-w-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Key className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-white">Google Maps API Key Required</h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            To visualize interactive maps, daily route markers, and locations, please add your Google Maps API Key to secrets:
          </p>

          <ol className="text-xs text-slate-300 text-left space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            <li>1. Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
            <li>2. Select <strong>Secrets</strong></li>
            <li>3. Type secret name: <code className="text-cyan-400">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>4. Paste your API key and press <strong>Enter</strong></li>
          </ol>

          <p className="text-[11px] text-slate-400">
            Get an API key at{' '}
            <a
              href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
            >
              Google Cloud Console <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <GoogleMapInner {...props} />
    </APIProvider>
  );
};
