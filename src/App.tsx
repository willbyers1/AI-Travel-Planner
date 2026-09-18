import React, { useState, useEffect } from 'react';
import { Trip } from './types/trip';
import { storageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { ByokPanel, CustomKeys } from './components/ByokPanel';
import { Home } from './pages/Home';
import { PlanTrip } from './pages/PlanTrip';
import { TripResult } from './pages/TripResult';
import { SavedTripsPage } from './pages/SavedTripsPage';
import { HowItWorks } from './components/HowItWorks';

type ActiveTab = 'home' | 'plan' | 'result' | 'saved' | 'how-it-works';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [quickDestination, setQuickDestination] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customKeys, setCustomKeys] = useState<CustomKeys>({});

  // Load saved trips and saved BYOK keys on mount
  useEffect(() => {
    const loaded = storageService.getSavedTrips();
    setSavedTrips(loaded);

    try {
      const savedKeys = localStorage.getItem('ai_travel_planner_byok_keys');
      if (savedKeys) {
        setCustomKeys(JSON.parse(savedKeys));
      }
    } catch (e) {
      console.error('Error reading BYOK keys from localStorage:', e);
    }
  }, []);

  const refreshSavedTrips = () => {
    const loaded = storageService.getSavedTrips();
    setSavedTrips(loaded);
  };

  const handleStartPlanning = (destination?: string) => {
    if (destination) {
      setQuickDestination(destination);
    }
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripGenerated = (trip: Trip) => {
    setCurrentTrip(trip);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTrip = () => {
    if (!currentTrip) return;
    storageService.saveTrip(currentTrip);
    refreshSavedTrips();
  };

  const handleDeleteTrip = (id: string) => {
    storageService.deleteTrip(id);
    refreshSavedTrips();
    if (currentTrip && currentTrip.id === id) {
      setCurrentTrip(null);
      setActiveTab('saved');
    }
  };

  const handleDuplicateTrip = (id: string) => {
    storageService.duplicateTrip(id);
    refreshSavedTrips();
  };

  const handleRenameTrip = (id: string, newName: string) => {
    storageService.updateTripName(id, newName);
    refreshSavedTrips();
    if (currentTrip && currentTrip.id === id) {
      setCurrentTrip({ ...currentTrip, name: newName });
    }
  };

  const handleOpenSavedTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentTripSaved = Boolean(
    currentTrip && savedTrips.some((t) => t.id === currentTrip.id)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab === 'result' ? 'plan' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedTripsCount={savedTrips.length}
        onOpenSettings={() => setSettingsOpen(true)}
        hasCustomKey={Boolean(customKeys.geminiKey || customKeys.openAIKey || customKeys.mapsKey)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home onStartPlanning={handleStartPlanning} />
        )}

        {activeTab === 'plan' && (
          <PlanTrip
            initialDestination={quickDestination}
            onTripGenerated={handleTripGenerated}
            customKeys={customKeys}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}

        {activeTab === 'result' && currentTrip && (
          <TripResult
            trip={currentTrip}
            isSaved={isCurrentTripSaved}
            onSaveTrip={handleSaveTrip}
            onExportTrip={() => storageService.exportTripJSON(currentTrip)}
            onBackToPlan={() => {
              setActiveTab('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'saved' && (
          <SavedTripsPage
            trips={savedTrips}
            onOpenTrip={handleOpenSavedTrip}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onRenameTrip={handleRenameTrip}
            onPlanNewTrip={() => handleStartPlanning()}
          />
        )}

        {activeTab === 'how-it-works' && (
          <div className="py-12">
            <HowItWorks />
          </div>
        )}
      </main>

      {/* Bring Your Own Key (BYOK) Control Panel */}
      <ByokPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        customKeys={customKeys}
        onSaveKeys={(keys) => setCustomKeys(keys)}
      />
    </div>
  );
}
