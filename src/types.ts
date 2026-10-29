export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface GameSiteLink {
  id: string;
  name: string;
  url: string;
  domain: string;
  categoryId: string;
  description?: string;
  specialNotice?: string;
  passwordInfo?: string;
  isBestGame?: boolean;
  isBestWebsite?: boolean;
  rank?: number;
  mirrorUrls?: string[];
  tags: string[];
  isFavorite: boolean;
  dateAdded: string;
}

export type ViewMode =
  | 'home'
  | 'categories'
  | 'all-sites'
  | 'best-games'
  | 'best-websites'
  | 'direct-games'
  | 'favorites'
  | 'category-detail'
  | 'ai-chat'
  | 'settings'
  | 'browser';

export type DisplayDensity = 'grid' | 'list';

export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentPreset = 'orange' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose' | 'custom';

export interface GameVaultSettings {
  theme: ThemeMode;
  accentPreset: AccentPreset;
  customAccentColor: string;
  performanceMode: boolean;
  defaultView: DisplayDensity;
  openInNewTab: boolean;
  reduceMotion: boolean;
  compactRail: boolean;
  showRailLabels: boolean;
}

export const ACCENT_PRESETS: { id: AccentPreset; name: string; hex: string }[] = [
  { id: 'orange', name: 'Pumpkin Orange', hex: '#f97316' },
  { id: 'emerald', name: 'Matrix Emerald', hex: '#10b981' },
  { id: 'amber', name: 'Golden Amber', hex: '#f59e0b' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06b6d4' },
  { id: 'purple', name: 'Phantom Purple', hex: '#a855f7' },
  { id: 'rose', name: 'Arcade Rose', hex: '#f43f5e' },
];

export const DEFAULT_SETTINGS: GameVaultSettings = {
  theme: 'dark',
  accentPreset: 'orange',
  customAccentColor: '#f97316',
  performanceMode: false,
  defaultView: 'grid',
  openInNewTab: true,
  reduceMotion: false,
  compactRail: false,
  showRailLabels: false,
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  modelUsed?: string;
  isError?: boolean;
}

export interface AIModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isDefault?: boolean;
  requiresUnlock: boolean;
}

