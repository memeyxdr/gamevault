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

export type ViewMode = 'home' | 'categories' | 'all-sites' | 'best-games' | 'best-websites' | 'favorites' | 'category-detail';
export type DisplayDensity = 'grid' | 'list';

