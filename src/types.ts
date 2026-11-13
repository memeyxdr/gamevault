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
  | 'settings';

/** Edge the persistent navigation bar can be docked to on wide screens. */
export type NavPosition = 'left' | 'right' | 'top' | 'bottom';

export const NAV_POSITIONS: { id: NavPosition; label: string; description: string }[] = [
  { id: 'left', label: 'Left', description: 'Vertical rail on the left edge' },
  { id: 'right', label: 'Right', description: 'Vertical rail on the right edge' },
  { id: 'top', label: 'Top', description: 'Horizontal bar under the header' },
  { id: 'bottom', label: 'Bottom', description: 'Horizontal bar along the bottom' },
];

export type DisplayDensity = 'grid' | 'list';

export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentPreset = 'orange' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose' | 'custom';

export const DEFAULT_CLOAK_TITLE = 'Google Classroom';

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
  navPosition: NavPosition;
  cloakEnabled: boolean;
  cloakTitle: string;
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
  accentPreset: 'purple',
  customAccentColor: '#a855f7',
  performanceMode: false,
  defaultView: 'grid',
  openInNewTab: true,
  reduceMotion: false,
  compactRail: false,
  showRailLabels: true,
  navPosition: 'left',
  cloakEnabled: false,
  cloakTitle: DEFAULT_CLOAK_TITLE,
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
