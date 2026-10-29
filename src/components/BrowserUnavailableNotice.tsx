import React from 'react';
import { Compass, Globe, Wrench } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface BrowserUnavailableNoticeProps {
  onBackToSites?: () => void;
}

/**
 * Rendered in the main view space in place of the in-site browser.
 * The browser is currently disabled, so every entry point that would have
 * opened it lands here instead.
 */
export const BrowserUnavailableNotice: React.FC<BrowserUnavailableNoticeProps> = ({
  onBackToSites,
}) => {
  const { currentAccentHex, accentRgb } = useSettings();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">In-Site Browser</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Browse websites and proxies without leaving GameVault
        </p>
      </div>

      {/* Unavailable Placeholder */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-amber-900/40 bg-neutral-900/20 py-20 px-4 text-center">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-800/50 bg-amber-500/10 text-amber-400 shadow-sm">
          <Compass className="h-7 w-7 stroke-[2]" />
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-amber-800/60 bg-neutral-950 text-amber-400">
            <Wrench className="h-3 w-3" />
          </span>
        </div>

        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-400">
          Temporarily Unavailable
        </span>

        <h2 className="text-sm font-semibold text-neutral-200">
          The in-site browser is not working anymore
        </h2>

        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-400">
          I'm trying to fix it. Until it's back, every site in the directory still opens normally in
          your own browser.
        </p>

        {onBackToSites && (
          <button
            type="button"
            onClick={onBackToSites}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            style={{
              borderColor: `rgba(${accentRgb}, 0.45)`,
              backgroundColor: `rgba(${accentRgb}, 0.12)`,
              color: currentAccentHex,
            }}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Browse game sites</span>
          </button>
        )}
      </div>
    </div>
  );
};
