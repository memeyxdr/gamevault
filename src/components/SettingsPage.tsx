import React, { useEffect, useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Palette,
  Zap,
  LayoutGrid,
  List,
  ExternalLink,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  ShieldAlert,
  X,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { ACCENT_PRESETS, AccentPreset, ThemeMode, DisplayDensity } from '../types';

const ERROR_REPORT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw/viewform?usp=dialog';
const GAME_SUGGESTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdhulN_Qrg7223ug-iI4J3KmN5nJSepxTMDyFNSov4IE4xH8A/viewform?usp=dialog';

interface SettingsPageProps {
  onBackToHome?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    resetAllData,
    resolvedTheme,
    currentAccentHex,
    accentContrast,
  } = useSettings();

  // Modals for confirmations
  const [showResetSettingsModal, setShowResetSettingsModal] = useState(false);
  const [showResetDataModal, setShowResetDataModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState<string | null>(null);

  // Custom hex color input state
  const [customHexInput, setCustomHexInput] = useState(settings.customAccentColor || '#f97316');
  const [hexError, setHexError] = useState<string | null>(null);

  useEffect(() => {
    setCustomHexInput(settings.customAccentColor || '#f97316');
  }, [settings.customAccentColor]);

  const triggerToast = (msg: string) => {
    setResetSuccessToast(msg);
    setTimeout(() => {
      setResetSuccessToast(null);
    }, 2800);
  };

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setHexError(null);
      updateSettings({
        accentPreset: 'custom',
        customAccentColor: val,
      });
    } else {
      setHexError('Please enter a valid 6-character hex code (e.g. #ea580c)');
    }
  };

  const handleCustomColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHexInput(val);
    setHexError(null);
    updateSettings({
      accentPreset: 'custom',
      customAccentColor: val,
    });
  };

  const handleConfirmResetSettings = () => {
    resetSettings();
    setShowResetSettingsModal(false);
    triggerToast('Settings restored to defaults');
  };

  const handleConfirmResetData = () => {
    setShowResetDataModal(false);
    triggerToast('All GameVault local data has been wiped');
    setTimeout(() => {
      resetAllData();
      window.location.reload();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-2">
      {/* 1. Header with Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm border border-neutral-800 bg-neutral-900"
              style={{ color: currentAccentHex }}
            >
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              Settings & Preferences
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Customize your GameVault appearance, performance, browsing habits, and local storage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowResetSettingsModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Settings</span>
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color: currentAccentHex }} />
          <h2 className="text-sm sm:text-base font-semibold text-white font-mono uppercase tracking-wider">
            Support & Feedback
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={ERROR_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 hover:border-red-500/40 hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span>
                <span className="block text-sm font-semibold text-neutral-100">Report an issue</span>
                <span className="block mt-0.5 text-xs text-neutral-400">Report a broken link or other GameVault issue.</span>
              </span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
          </a>
          <a
            href={GAME_SUGGESTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 hover:border-emerald-500/40 hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-emerald-400" />
              <span>
                <span className="block text-sm font-semibold text-neutral-100">Suggest a game or site</span>
                <span className="block mt-0.5 text-xs text-neutral-400">Share a title for the GameVault directory.</span>
              </span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
          </a>
        </div>
      </section>

      {/* 2. Appearance Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" style={{ color: currentAccentHex }} />
          <h2 className="text-sm sm:text-base font-semibold text-white font-mono uppercase tracking-wider">
            Appearance
          </h2>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6 space-y-6 shadow-sm">
          {/* Theme Selector */}
          <div className="space-y-3">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-neutral-200 block">
                Color Theme
              </label>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select your preferred visual style across the application.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'dark' as ThemeMode,
                  label: 'Dark Theme',
                  desc: 'Classic GameVault nighttime aesthetic',
                  icon: Moon,
                },
                {
                  id: 'light' as ThemeMode,
                  label: 'Light Theme',
                  desc: 'Clean daytime high-contrast interface',
                  icon: Sun,
                },
                {
                  id: 'system' as ThemeMode,
                  label: 'System Sync',
                  desc: `Automatically follows device OS (${resolvedTheme})`,
                  icon: Monitor,
                },
              ].map((themeOpt) => {
                const Icon = themeOpt.icon;
                const isSelected = settings.theme === themeOpt.id;
                return (
                  <button
                    key={themeOpt.id}
                    type="button"
                    onClick={() => updateSettings({ theme: themeOpt.id })}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500/80 bg-neutral-900 shadow-md ring-1'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-900/60'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: currentAccentHex,
                            boxShadow: `0 0 12px rgba(${currentAccentHex}, 0.15)`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300"
                        style={isSelected ? { color: currentAccentHex } : {}}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {isSelected && (
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                          style={{
                            backgroundColor: currentAccentHex,
                            color: accentContrast,
                          }}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {themeOpt.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      {themeOpt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-neutral-800/80" />

          {/* Accent Color Selector */}
          <div className="space-y-3.5">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-neutral-200 block">
                Accent Color
              </label>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select a preset color or specify a custom color code for buttons, badges, and focus rings.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = settings.accentPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        accentPreset: preset.id,
                        customAccentColor: preset.hex,
                      })
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 shadow-md ring-1'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                    }`}
                    style={isSelected ? {
                      borderColor: currentAccentHex,
                      boxShadow: `0 0 0 1px ${currentAccentHex}30, 0 6px 18px ${currentAccentHex}18`,
                    } : undefined}
                  >
                    <span
                      className="h-5 w-5 rounded-full shrink-0 shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-neutral-950 stroke-[3]" />
                      )}
                    </span>
                    <span className="text-xs font-medium text-neutral-200 truncate">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Picker & Live Hex Input */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-800 p-2 rounded-xl">
                <div className="relative flex items-center">
                  <input
                    type="color"
                    id="accent-color-picker"
                    value={currentAccentHex}
                    onChange={handleCustomColorPicker}
                    className="h-8 w-10 rounded cursor-pointer border-0 bg-transparent p-0"
                    title="Choose custom accent color"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="accent-color-picker" className="text-[10px] font-mono uppercase text-neutral-400">
                    Custom Hex Color
                  </label>
                  <input
                    type="text"
                    value={customHexInput}
                    onChange={handleCustomHexChange}
                    onBlur={() => {
                      if (hexError) {
                        setCustomHexInput(settings.customAccentColor || '#f97316');
                        setHexError(null);
                      }
                    }}
                    placeholder="#f97316"
                    aria-label="Custom accent hex color"
                    className="bg-transparent border-0 p-0 text-xs font-mono font-semibold text-white focus:outline-none focus:ring-0 uppercase w-24"
                  />
                </div>
              </div>

              {/* Live Preview Sample Badge */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-bold font-mono shadow-xs transition-all"
                  style={{
                    backgroundColor: currentAccentHex,
                    color: accentContrast,
                  }}
                >
                  Button Preview
                </span>

                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-mono border transition-all"
                  style={{
                    backgroundColor: `rgba(${parseInt(currentAccentHex.slice(1, 3), 16)}, ${parseInt(
                      currentAccentHex.slice(3, 5),
                      16
                    )}, ${parseInt(currentAccentHex.slice(5, 7), 16)}, 0.15)`,
                    borderColor: `rgba(${parseInt(currentAccentHex.slice(1, 3), 16)}, ${parseInt(
                      currentAccentHex.slice(3, 5),
                      16
                    )}, ${parseInt(currentAccentHex.slice(5, 7), 16)}, 0.5)`,
                    color: currentAccentHex,
                  }}
                >
                  Badge Preview
                </span>

                <span
                  className="px-2.5 py-1 rounded-md text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: `rgba(${parseInt(currentAccentHex.slice(1, 3), 16)}, ${parseInt(currentAccentHex.slice(3, 5), 16)}, ${parseInt(currentAccentHex.slice(5, 7), 16)}, 0.10)`,
                    borderColor: `rgba(${parseInt(currentAccentHex.slice(1, 3), 16)}, ${parseInt(currentAccentHex.slice(3, 5), 16)}, ${parseInt(currentAccentHex.slice(5, 7), 16)}, 0.28)`,
                    color: currentAccentHex,
                  }}
                >
                  Soft tint
                </span>

                <span className="text-[11px] text-neutral-400 font-mono">
                  Text contrast: <strong className="text-neutral-200">{accentContrast === '#ffffff' ? 'Light text' : 'Dark text'}</strong>
                </span>
              </div>
            </div>

            {hexError && <p className="text-xs text-red-400 mt-1">{hexError}</p>}
          </div>
        </div>
      </section>

      {/* 3. Performance Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color: currentAccentHex }} />
          <h2 className="text-sm sm:text-base font-semibold text-white font-mono uppercase tracking-wider">
            Performance
          </h2>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-neutral-200">
                  Performance Mode
                </span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.2 text-[10px] font-mono font-medium text-emerald-400">
                  School Chromebook Recommended
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Reduces expensive visual effects, suppresses ambient background glow orbs, and disables heavy CSS backdrop blurs. Dramatically improves framerate and smoothness on low-spec hardware without breaking any site functionality.
              </p>
            </div>

            {/* Accessible Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.performanceMode}
              onClick={() =>
                updateSettings({ performanceMode: !settings.performanceMode })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.performanceMode ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.performanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Performance Status Box */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start gap-3 text-xs text-neutral-300">
            <Info className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white">
                Status:{' '}
                {settings.performanceMode ? (
                  <span className="text-emerald-400">Active (Heavy Blurs & Glows Disabled)</span>
                ) : (
                  <span className="text-neutral-400">Off (Full Visual Fidelity & Blurs Enabled)</span>
                )}
              </span>
              <p className="text-[11px] text-neutral-400 leading-normal">
                {settings.performanceMode
                  ? 'All backdrop blurs, glow shadows, and background gradient filters are suppressed to ensure minimal CPU/GPU load.'
                  : 'Full Halloween aesthetic with atmospheric glowing jack-o’-lantern glows, translucent blur navbars, and animated accents.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Browsing Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" style={{ color: currentAccentHex }} />
          <h2 className="text-sm sm:text-base font-semibold text-white font-mono uppercase tracking-wider">
            Browsing
          </h2>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6 space-y-6 shadow-sm">
          {/* Default Directory View Mode */}
          <div className="space-y-3">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-neutral-200 block">
                Default Directory Layout
              </label>
              <p className="text-xs text-neutral-400 mt-0.5">
                Choose the preferred view layout when browsing All Sites, Best Games, and Favorites.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'grid' as DisplayDensity,
                  label: 'Blocks (Grid)',
                  desc: 'Card blocks layout with descriptions, tags, and quick-action links.',
                  icon: LayoutGrid,
                },
                {
                  id: 'list' as DisplayDensity,
                  label: 'Compact (List)',
                  desc: 'High-density tabular list showing maximum games on screen.',
                  icon: List,
                },
              ].map((viewOpt) => {
                const Icon = viewOpt.icon;
                const isSelected = settings.defaultView === viewOpt.id;
                return (
                  <button
                    key={viewOpt.id}
                    type="button"
                    onClick={() => updateSettings({ defaultView: viewOpt.id })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white/60 bg-neutral-900 shadow-md ring-1 ring-white/20'
                        : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300 shrink-0"
                      style={isSelected ? { color: currentAccentHex } : {}}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {viewOpt.label}
                        </span>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0" style={{ color: currentAccentHex }} />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {viewOpt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-neutral-800/80" />

          {/* Open Links in New Tab Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-neutral-200">
                  Open External Links in a New Tab
                </span>
                <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] font-mono text-neutral-400">
                  target={settings.openInNewTab ? '"_blank"' : '"_self"'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                When enabled, clicking on game links, mirrors, and proxy gateways launches them in a new browser tab so you never lose your place in GameVault.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.openInNewTab}
              onClick={() =>
                updateSettings({ openInNewTab: !settings.openInNewTab })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.openInNewTab ? 'bg-orange-500' : 'bg-neutral-800'
              }`}
              style={settings.openInNewTab ? { backgroundColor: currentAccentHex } : {}}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.openInNewTab ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Privacy and Local Data Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white font-mono uppercase tracking-wider">
            Privacy and Local Data
          </h2>
        </div>

        <div className="rounded-2xl border border-red-950/40 bg-neutral-900/50 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <span>Reset Local Data</span>
                <span className="rounded bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-mono px-1.5 py-0.2">
                  First-Visit State
                </span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Makes GameVault behave as if you are visiting for the very first time. Clears locally stored starred bookmarks, site modifications, disclaimer dismissals, and saved preferences.
              </p>
              <p className="text-[11px] text-neutral-400 pt-1">
                <strong className="text-neutral-300">Technical Note:</strong> Browser HTTP disk cache and service worker caches are governed by the browser engine and cannot be wiped via client script. This action safely wipes all GameVault localStorage data.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetDataModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 hover:border-red-500/60 px-4 py-2.5 text-xs font-semibold text-red-300 hover:text-red-200 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm shadow-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset Local Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Modal: Reset Settings to Default */}
      {showResetSettingsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowResetSettingsModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl text-neutral-100 animate-modal-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    Reset Settings to Default?
                  </h3>
                  <p className="text-xs text-neutral-400">Restore default appearance & browsing options</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowResetSettingsModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
              This will restore your theme to <strong>Dark</strong>, accent color to <strong>Pumpkin Orange</strong>, disable Performance Mode, and reset browsing view to <strong>Blocks</strong>. Your starred sites will not be touched.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetSettingsModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetSettings}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reset Local Data (First Visit State) */}
      {showResetDataModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowResetDataModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-red-500/40 bg-neutral-900/95 p-6 shadow-2xl text-neutral-100 animate-modal-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/40 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    Reset All GameVault Data?
                  </h3>
                  <p className="text-xs text-red-400">Simulate a clean first-time visit</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowResetDataModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/70 p-3.5 rounded-xl border border-red-950/60 space-y-2">
              <p>
                <strong className="text-red-300">Warning:</strong> This will erase all GameVault-specific client storage, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[11px]">
                <li>All starred / bookmarked game links</li>
                <li>Customized site lists and rank cache</li>
                <li>Theme, accent colors, and performance mode settings</li>
                <li>Dismissed disclaimer banners & notice flags</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetDataModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetData}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-neutral-950 text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-500/20 active:scale-95"
              >
                Wipe Local Data & Reload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {resetSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-orange-500/50 bg-neutral-900/95 px-5 py-2.5 shadow-2xl backdrop-blur-md text-orange-400 text-xs sm:text-sm font-semibold tracking-wide font-mono animate-toast-in shadow-orange-500/20">
          <Check className="h-4 w-4 text-orange-400 stroke-[3]" />
          <span>{resetSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
