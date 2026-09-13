import React from 'react';
import { AlertTriangle, RefreshCw, Key, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onOpenSettings?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onOpenSettings,
}) => {
  const isKeyError =
    message.toLowerCase().includes('key') ||
    message.toLowerCase().includes('secret') ||
    message.toLowerCase().includes('400');

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-[1.25rem] text-slate-900 shadow-sm text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">Generation Failed</h3>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 text-left font-mono overflow-x-auto">
          {message}
        </p>
      </div>

      {isKeyError && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-left space-y-2">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
            <Key className="w-4 h-4" />
            <span>How to resolve API key issues:</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 font-medium">
            <li>Ensure <code className="text-blue-700 font-bold">GEMINI_API_KEY</code> is configured in AI Studio Secrets.</li>
            <li>Open Settings (⚙️ top right) → Secrets → enter name and key value.</li>
            <li>Or click the Settings icon in the header to enter a temporary API key.</li>
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-4 h-4 text-blue-600" />
            <span>API Settings</span>
          </button>
        )}
      </div>
    </div>
  );
};
