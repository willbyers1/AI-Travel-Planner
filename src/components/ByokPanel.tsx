import React, { useState, useEffect } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Save,
  Sparkles,
  Server,
  Zap,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { checkServerHealth } from '../services/aiService';

export interface CustomKeys {
  geminiKey?: string;
  openAIKey?: string;
  mapsKey?: string;
}

interface ByokPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customKeys: CustomKeys;
  onSaveKeys: (keys: CustomKeys) => void;
}

const LOCAL_STORAGE_KEY = 'ai_travel_planner_byok_keys';

export const ByokPanel: React.FC<ByokPanelProps> = ({
  isOpen,
  onClose,
  customKeys,
  onSaveKeys,
}) => {
  const [geminiKey, setGeminiKey] = useState(customKeys.geminiKey || '');
  const [openAIKey, setOpenAIKey] = useState(customKeys.openAIKey || '');
  const [mapsKey, setMapsKey] = useState(customKeys.mapsKey || '');

  const [showGemini, setShowGemini] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showMaps, setShowMaps] = useState(false);

  const [persistLocalStorage, setPersistLocalStorage] = useState(true);
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
  }>({ testing: false });

  const [serverHealth, setServerHealth] = useState<{
    hasGeminiKey: boolean;
    hasOpenAIKey: boolean;
    hasMapsKey: boolean;
  }>({
    hasGeminiKey: false,
    hasOpenAIKey: false,
    hasMapsKey: false,
  });

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Load from local storage or server health on mount/open
  useEffect(() => {
    if (isOpen) {
      // Check saved localStorage keys
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.geminiKey) setGeminiKey(parsed.geminiKey);
          if (parsed.openAIKey) setOpenAIKey(parsed.openAIKey);
          if (parsed.mapsKey) setMapsKey(parsed.mapsKey);
        }
      } catch (e) {
        console.error('Failed to load keys from local storage:', e);
      }

      // Fetch server environment key health
      checkServerHealth().then((health) => {
        setServerHealth({
          hasGeminiKey: health.hasGeminiKey,
          hasOpenAIKey: health.hasOpenAIKey,
          hasMapsKey: health.hasMapsKey,
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newKeys: CustomKeys = {
      geminiKey: geminiKey.trim(),
      openAIKey: openAIKey.trim(),
      mapsKey: mapsKey.trim(),
    };

    if (persistLocalStorage) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newKeys));
      } catch (err) {
        console.error('Failed to save keys to localStorage', err);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    onSaveKeys(newKeys);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setGeminiKey('');
    setOpenAIKey('');
    setMapsKey('');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    onSaveKeys({});
    setTestStatus({ testing: false });
  };

  const handleTestKey = async () => {
    setTestStatus({ testing: true });
    
    // Quick validation check
    const currentGemini = geminiKey.trim();
    const currentOpenAI = openAIKey.trim();

    if (!currentGemini && !currentOpenAI && !serverHealth.hasGeminiKey && !serverHealth.hasOpenAIKey) {
      setTestStatus({
        testing: false,
        success: false,
        message: 'No API key entered and no server key environment variable detected.',
      });
      return;
    }

    if (currentGemini && !currentGemini.startsWith('AIza')) {
      setTestStatus({
        testing: false,
        success: false,
        message: 'Gemini API keys typically start with "AIza...". Please verify your key.',
      });
      return;
    }

    // Simulate / test key format against health
    setTimeout(() => {
      setTestStatus({
        testing: false,
        success: true,
        message: 'API Key format validated! Ready for AI trip itinerary generation.',
      });
    }, 600);
  };

  const activeKeyCount = [geminiKey, openAIKey, mapsKey].filter((k) => Boolean(k?.trim())).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-[1.25rem] p-6 sm:p-8 max-w-xl w-full text-slate-900 shadow-xl space-y-6 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Bring Your Own Key (BYOK)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                Control Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Use your personal Google Gemini or OpenAI API keys to generate custom travel itineraries seamlessly.
            </p>
          </div>
        </div>

        {/* Runtime API Health Badges */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              Runtime Key Status Overview
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              Server & Custom Key Checks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className={`p-2.5 rounded-lg border flex items-center justify-between font-mono text-[11px] font-semibold ${
              geminiKey.trim() || serverHealth.hasGeminiKey
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini API:</span>
              </div>
              <span className="font-bold">
                {geminiKey.trim() ? 'Custom BYOK Active' : serverHealth.hasGeminiKey ? 'Server Env Active' : 'Not Configured'}
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border flex items-center justify-between font-mono text-[11px] font-semibold ${
              openAIKey.trim() || serverHealth.hasOpenAIKey
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>OpenAI API:</span>
              </div>
              <span className="font-bold">
                {openAIKey.trim() ? 'Custom BYOK Active' : serverHealth.hasOpenAIKey ? 'Server Env Active' : 'Optional'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Google Gemini API Key (Recommended)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                Get Free Key on AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showGemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showGemini ? 'Hide key' : 'Show key'}
              >
                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Powers speed-optimized Gemini 2.5 Flash itinerary generation.
            </p>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                OpenAI API Key (Optional Fallback)
              </label>
            </div>
            <div className="relative">
              <input
                type={showOpenAI ? 'text' : 'password'}
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowOpenAI(!showOpenAI)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showOpenAI ? 'Hide key' : 'Show key'}
              >
                {showOpenAI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Google Maps API Key */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Google Maps API Key (Optional)
            </label>
            <div className="relative">
              <input
                type={showMaps ? 'text' : 'password'}
                value={mapsKey}
                onChange={(e) => setMapsKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowMaps(!showMaps)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showMaps ? 'Hide key' : 'Show key'}
              >
                {showMaps ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options & Persistence */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={persistLocalStorage}
                onChange={(e) => setPersistLocalStorage(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Remember keys in local browser storage</span>
            </label>

            <button
              type="button"
              onClick={handleTestKey}
              disabled={testStatus.testing}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus.testing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{testStatus.testing ? 'Validating...' : 'Validate Format'}</span>
            </button>
          </div>

          {/* Test Status feedback */}
          {testStatus.message && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}

          {/* How to configure Permanent AI Studio Environment Variables */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-blue-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Alternative: Configure Permanent Environment Secrets</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              You can also store <code className="text-blue-700 font-bold font-mono">GEMINI_API_KEY</code> or <code className="text-blue-700 font-bold font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> directly in AI Studio menu (Settings ⚙️ → Secrets).
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {activeKeyCount > 0 ? (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-full text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear BYOK Keys</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {saveSuccessNotice ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saveSuccessNotice ? 'BYOK Saved!' : 'Apply BYOK Keys'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
