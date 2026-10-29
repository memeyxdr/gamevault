import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GameVaultSettings, DEFAULT_SETTINGS, ACCENT_PRESETS, ThemeMode } from '../types';

export const SETTINGS_STORAGE_KEY = 'gamevault_settings_v14';

interface SettingsContextValue {
  settings: GameVaultSettings;
  updateSettings: (partial: Partial<GameVaultSettings>) => void;
  resetSettings: () => void;
  resetAllData: () => void;
  resolvedTheme: 'dark' | 'light';
  currentAccentHex: string;
  accentRgb: string;
  accentContrast: string;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 249, g: 115, b: 22 }; // Fallback to orange
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 249, g: 115, b: 22 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Calculate readable text contrast (white vs dark text)
export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // ITU-R BT.709 relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0a0a0a' : '#ffffff';
}

export const SettingsProvider: React.FC<{
  children: React.ReactNode;
  onDataReset?: () => void;
}> = ({ children, onDataReset }) => {
  const [settings, setSettings] = useState<GameVaultSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
      }
      // Migrate display mode if existing
      const legacyDisplayMode = localStorage.getItem('gamevault_display_mode');
      if (legacyDisplayMode === 'list' || legacyDisplayMode === 'grid') {
        return {
          ...DEFAULT_SETTINGS,
          defaultView: legacyDisplayMode,
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'dark' | 'light' = useMemo(() => {
    if (settings.theme === 'system') {
      return systemTheme;
    }
    return settings.theme;
  }, [settings.theme, systemTheme]);

  // Compute active accent hex
  const currentAccentHex = useMemo(() => {
    if (settings.accentPreset === 'custom') {
      const hex = settings.customAccentColor;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return hex;
      }
      return '#f97316';
    }
    const preset = ACCENT_PRESETS.find((p) => p.id === settings.accentPreset);
    return preset ? preset.hex : '#f97316';
  }, [settings.accentPreset, settings.customAccentColor]);

  const { r, g, b } = useMemo(() => hexToRgb(currentAccentHex), [currentAccentHex]);
  const accentRgb = `${r}, ${g}, ${b}`;
  const accentContrast = useMemo(() => getContrastColor(currentAccentHex), [currentAccentHex]);

  // Apply theme & accent variables & performance class to DOM
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // 1. Theme application
    root.setAttribute('data-theme', resolvedTheme);
    if (resolvedTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // 2. Accent colors in CSS variables
    root.style.setProperty('--gv-accent', currentAccentHex);
    root.style.setProperty('--gv-accent-rgb', accentRgb);
    root.style.setProperty('--gv-accent-contrast', accentContrast);

    // 3. Performance Mode
    if (settings.performanceMode) {
      root.classList.add('performance-mode');
    } else {
      root.classList.remove('performance-mode');
    }

    // 4. Accessibility: Reduce Motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [
    resolvedTheme,
    currentAccentHex,
    accentRgb,
    accentContrast,
    settings.performanceMode,
    settings.reduceMotion,
  ]);

  // Persist to localStorage
  const updateSettings = useCallback((partial: Partial<GameVaultSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
        if (next.defaultView) {
          localStorage.setItem('gamevault_display_mode', next.defaultView);
        }
      } catch {
        // Storage full or disabled
      }
      return next;
    });
  }, []);

  // Reset Settings to Default
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('gamevault_display_mode', DEFAULT_SETTINGS.defaultView);
    } catch {
      // Storage unavailable
    }
  }, []);

  // Reset All Local Data (First-visit experience)
  const resetAllData = useCallback(() => {
    try {
      // Clear all GameVault-specific keys
      const keysToClear = [
        SETTINGS_STORAGE_KEY,
        'gamevault_settings_v14',
        'gamevault_display_mode',
        'gamevault_sites_v14',
        'gamevault_sites_v13',
        'gamevault_sites_v12',
        'gamevault_categories_v14',
        'gamevault_categories_v13',
        'gamevault_starred_sites_v14',
        'gamevault_starred_sites_v13',
        'gamevault_starred_sites_v12',
        'gamevault_seen_v1_4_redesign_modal',
        'gamevault_seen_v1_2_modal',
        'gamevault_seen_proxy_disclaimer_v1',
        'gamevault_seen_early_dev_notice_v1',
      ];

      for (const k of keysToClear) {
        localStorage.removeItem(k);
      }
      
      // Also iterate and wipe any other gamevault_* keys safely
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gamevault_')) {
          allKeys.push(key);
        }
      }
      allKeys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Storage unavailable
    }

    // Reset settings state
    setSettings(DEFAULT_SETTINGS);

    // Notify app if callback provided
    if (onDataReset) {
      onDataReset();
    }
  }, [onDataReset]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        resetAllData,
        resolvedTheme,
        currentAccentHex,
        accentRgb,
        accentContrast,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
