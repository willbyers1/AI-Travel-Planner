import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, HelpCircle, ExternalLink, Sparkles, Check } from 'lucide-react';
import { checkServerHealth } from '../services/aiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (keys: { openAIKey?: string; geminiKey?: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveKeys,
}) => {
  const [health, setHealth] = useState<{
    hasGeminiKey: boolean;
    hasOpenAIKey: boolean;
    hasMapsKey: boolean;
  }>({ hasGeminiKey: false, hasOpenAIKey: false, hasMapsKey: false });

  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkServerHealth().then(setHealth);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys({
      openAIKey: openAIKey.trim() || undefined,
      geminiKey: geminiKey.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-[1.25rem] p-6 sm:p-8 max-w-lg w-full text-slate-900 shadow-lg space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">API Keys & Settings</h2>
            <p className="text-xs text-slate-500">
              Configure environment keys for AI Generation and Google Maps
            </p>
          </div>
        </div>

        {/* Server Health Status Badges */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div className="font-semibold text-slate-700">Runtime API Status:</div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-mono font-bold ${
                health.hasGeminiKey
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <Check className="w-3 h-3" /> Gemini API Key: {health.hasGeminiKey ? 'Injected' : 'Not set'}
            </span>

            <span
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-mono font-bold ${
                health.hasMapsKey
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <Check className="w-3 h-3" /> Google Maps Key: {health.hasMapsKey ? 'Injected' : 'Not set'}
            </span>
          </div>
        </div>

        {/* AI Key input form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Optional Custom Gemini API Key
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Optional Custom OpenAI API Key
            </label>
            <input
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* AI Studio Secret Instructions */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-blue-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Permanent Setup (AI Studio Secrets):</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 font-mono text-[11px]">
              <li>Click <strong>Settings</strong> (⚙️ top right corner of AI Studio UI).</li>
              <li>Select <strong>Secrets</strong>.</li>
              <li>Add key name <code className="text-blue-700 font-bold">GEMINI_API_KEY</code> or <code className="text-blue-700 font-bold">GOOGLE_MAPS_PLATFORM_KEY</code>.</li>
            </ol>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{savedSuccess ? 'Keys Applied!' : 'Save Session Keys'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
