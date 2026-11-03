import React, { useEffect, useState } from 'react';
import {
  Gamepad2,
  Globe,
  ExternalLink,
  RotateCw,
  ArrowLeft,
  Play,
  Star,
  History,
  MousePointerClick,
  Search,
  SlidersHorizontal,
  Check,
  X,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { GAME_SUGGESTION_URL } from './SettingsPage';

interface DirectGamesPageProps {
  onBrowseSites?: () => void;
  /** Lets the shell know a game is on screen so it can drop its padding and hand over the whole view space. */
  onPlayingChange?: (isPlaying: boolean) => void;
}

interface DirectGame {
  id: string;
  name: string;
  description?: string;
  url: string;
  category: GameCategory;
  tags?: string[];
}

type GameCategory = 'Arcade' | 'Driving' | 'Shooter' | 'Sports' | 'Puzzle' | 'Idle' | 'Sandbox';

const GAME_CATEGORIES: GameCategory[] = [
  'Arcade',
  'Driving',
  'Shooter',
  'Sports',
  'Puzzle',
  'Idle',
  'Sandbox',
];

const CATEGORY_FILTER_OPTIONS: (GameCategory | 'all')[] = ['all', ...GAME_CATEGORIES];

const categoryLabel = (value: GameCategory | 'all') => (value === 'all' ? 'All games' : value);

type SortMode = 'default' | 'az' | 'za';

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: 'default', label: 'Default order' },
  { id: 'az', label: 'Name A–Z' },
  { id: 'za', label: 'Name Z–A' },
];

const FAVORITES_STORAGE_KEY = 'gamevault_direct_favorites_v1';
const RECENT_STORAGE_KEY = 'gamevault_direct_recent_v1';
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type RecentPlays = Record<string, number>;

const readFavorites = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const readRecentPlays = (): RecentPlays => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const cutoff = Date.now() - RECENT_WINDOW_MS;
    const kept = Object.entries(parsed as Record<string, unknown>)
      .filter(([, at]) => typeof at === 'number' && at >= cutoff) as [string, number][];
    return Object.fromEntries(kept);
  } catch {
    return {};
  }
};

const timeAgo = (at: number): string => {
  const minutes = Math.floor((Date.now() - at) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
const DIRECT_GAMES: DirectGame[] = [
  {
    id: 'n-gon',
    name: 'n-gon',
    category: 'Shooter',
    url: 'https://landgreen.github.io/n-gon/',
    tags: ['shooter', 'physics', 'arena', 'browser'],
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/flappy-bird/game.html',
  },
  {
    id: 'bottle-flip',
    name: 'Bottle Flip',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bottle-flip/game.html',
  },
  {
    id: 'rooftop-snipers',
    name: 'Rooftop Snipers',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/rooftop-snipers/game.html',
  },
  {
    id: 'motox3m',
    name: 'Moto X3M',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m/game.html',
  },
  {
    id: 'basket-random',
    name: 'Basket Random',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/basket-random/game.html',
  },
  {
    id: 'tanuki-sunset',
    name: 'Tanuki Sunset',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/tanuki-sunset/game.html',
  },
  {
    id: 'snow-ride',
    name: 'Snow Ride',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/snow-ride/game.html',
  },
  {
    id: 'cluster-rush',
    name: 'Cluster Rush',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/cluster-rush/game.html',
  },
  {
    id: 'blumgi-rocket',
    name: 'Blumgi Rocket',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/blumgi-rocket/game.html',
  },
  {
    id: 'slope',
    name: 'Slope',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/slope/game.html',
  },
  {
    id: 'drift-boss',
    name: 'Drift Boss',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/drift-boss/game.html',
  },
  {
    id: 'crazy-cars',
    name: 'Crazy Cars',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/crazy-cars/game.html',
  },
  {
    id: 'cookie-clicker',
    name: 'Cookie Clicker',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/cookie-clicker/game.html',
  },
  {
    id: 'drive-mad',
    name: 'Drive Mad',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/drive-mad/game.html',
  },
  {
    id: '2048',
    name: '2048',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/2048/game.html',
  },
  {
    id: 'sandboxels',
    name: 'Sandboxels',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/sandboxels/',
  },
  {
    id: '8-ball',
    name: '8-Ball',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/8-ball/game.html',
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/geometry-dash/game.html',
  },
  {
    id: 'retro-bowl',
    name: 'Retro Bowl',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/retro-bowl/game.html',
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/subway-surfers/game.html',
  },
  {
    id: '10-minutes-till-dawn',
    name: '10 Minutes Till Dawn',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/10-minutes-till-dawn/game.html',
  },
  {
    id: '1v1-lol',
    name: '1v1 LOL',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/1v1-lol/game.html',
  },
  {
    id: '1v1-soccer',
    name: '1v1 Soccer',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/1v1-soccer/game.html',
  },
  {
    id: '3d-bowling',
    name: '3D Bowling',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/3d-bowling/game.html',
  },
  {
    id: 'ages-of-conflict',
    name: 'Ages Of Conflict',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/ages-of-conflict/game.html',
  },
  {
    id: 'among-us',
    name: 'Among Us',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/among-us/game.html',
  },
  {
    id: 'angry-sharks',
    name: 'Angry Sharks',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/angry-sharks/game.html',
  },
  {
    id: 'apple-shooter',
    name: 'Apple Shooter',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/apple-shooter/game.html',
  },
  {
    id: 'aquapark-slides',
    name: 'Aquapark Slides',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/aquapark-slides/game.html',
  },
  {
    id: 'arcane-archer',
    name: 'Arcane Archer',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/arcane-archer/game.html',
  },
  {
    id: 'awesome-tanks-2',
    name: 'Awesome Tanks 2',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/awesome-tanks-2/game.html',
  },
  {
    id: 'backrooms',
    name: 'Backrooms',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/backrooms/game.html',
  },
  {
    id: 'backrooms-2d',
    name: 'Backrooms 2D',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/backrooms-2d/game.html',
  },
  {
    id: 'bacon-may-die',
    name: 'Bacon May Die',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bacon-may-die/game.html',
  },
  {
    id: 'bad-ice-cream',
    name: 'Bad Ice Cream',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bad-ice-cream/game.html',
  },
  {
    id: 'baldis-basics',
    name: 'Baldis Basics',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/baldis-basics/game.html',
  },
  {
    id: 'ballistic',
    name: 'Ballistic',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/ballistic/game.html',
  },
  {
    id: 'basketball-stars',
    name: 'Basketball Stars',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/basketball-stars/game.html',
  },
  {
    id: 'big-tower-tiny-square',
    name: 'Big Tower Tiny Square',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/big-tower-tiny-square/game.html',
  },
  {
    id: 'bitcoin-clicker',
    name: 'Bitcoin Clicker',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/bitcoin-clicker/game.html',
  },
  {
    id: 'bl',
    name: 'BL',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bl/game.html',
  },
  {
    id: 'bloonstd-4',
    name: 'Bloonstd 4',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bloonstd-4/game.html',
  },
  {
    id: 'bloxors',
    name: 'Bloxors',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/bloxors/game.html',
  },
  {
    id: 'bob-the-robber-2',
    name: 'Bob The Robber 2',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/bob-the-robber-2/game.html',
  },
  {
    id: 'boxel-rebound',
    name: 'Boxel Rebound',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/boxel-rebound/game.html',
  },
  {
    id: 'boxing-random',
    name: 'Boxing Random',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/boxing-random/game.html',
  },
  {
    id: 'blumgi-slime',
    name: 'Blumgi Slime',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/blumgi-slime/game.html',
  },
  {
    id: 'cars-simulator',
    name: 'Cars Simulator',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/cars-simulator/game.html',
  },
  {
    id: 'circlo',
    name: 'Circlo',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/circlo/game.html',
  },
  {
    id: 'circlo-2',
    name: 'Circlo 2',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/circlo-2/game.html',
  },
  {
    id: 'climb-over-it',
    name: 'Climb Over It',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/climb-over-it/game.html',
  },
  {
    id: 'core-ball',
    name: 'Core Ball',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/core-ball/game.html',
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/crossy-road/game.html',
  },
  {
    id: 'csgo-clicker',
    name: 'CS:GO Clicker',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/csgo-clicker/game.html',
  },
  {
    id: 'deal-or-no-deal',
    name: 'Deal Or No Deal',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/deal-or-no-deal/game.html',
  },
  {
    id: 'death-run-3d',
    name: 'Death Run 3D',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/death-run-3d/game.html',
  },
  {
    id: 'doge-miner',
    name: 'Doge Miner',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/doge-miner/game.html',
  },
  {
    id: 'draw-the-hill',
    name: 'Draw The Hill',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/draw-the-hill/game.html',
  },
  {
    id: 'doodle-jump',
    name: 'Doodle Jump',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/doodle-jump/game.html',
  },
  {
    id: 'duck-life-4',
    name: 'Duck Life 4',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/duck-life-4/game.html',
  },
  {
    id: 'elastic-face',
    name: 'Elastic Face',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/elastic-face/game.html',
  },
  {
    id: 'fire-boy-water-girl',
    name: 'Fire Boy Water Girl',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/fire-boy-water-girl/game.html',
  },
  {
    id: 'flash-tetris',
    name: 'Flash Tetris',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/flash-tetris/game.html',
  },
  {
    id: 'fnaf',
    name: 'FNAF',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/fnaf/game.html',
  },
  {
    id: 'football-legends',
    name: 'Football Legends',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/football-legends/game.html',
  },
  {
    id: 'football-strike',
    name: 'Football Strike',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/football-strike/game.html',
  },
  {
    id: 'funny-shooter-2',
    name: 'Funny Shooter 2',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/funny-shooter-2/game.html',
  },
  {
    id: 'fruit-ninja',
    name: 'Fruit Ninja',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/fruit-ninja/game.html',
  },
  {
    id: 'getaway-shootout',
    name: 'Getaway Shootout',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/getaway-shootout/game.html',
  },
  {
    id: 'getting-over-it',
    name: 'Getting Over It',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/getting-over-it/game.html',
  },
  {
    id: 'google-feud',
    name: 'Google Feud',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/google-feud/game.html',
  },
  {
    id: 'idle-breakout',
    name: 'Idle Breakout',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/idle-breakout/game.html',
  },
  {
    id: 'iron-snout',
    name: 'Iron Snout',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/iron-snout/game.html',
  },
  {
    id: 'just-fall',
    name: 'Just Fall',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/just-fall/game.html',
  },
  {
    id: 'idle-mining',
    name: 'Idle Mining',
    category: 'Idle',
    url: 'https://viberverse.github.io/games/idle-mining/game.html',
  },
  {
    id: 'mario-bros',
    name: 'Mario Bros',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/mario-bros/game.html',
  },
  {
    id: 'learn-to-fly',
    name: 'Learn To Fly',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/learn-to-fly/game.html',
  },
  {
    id: 'merge-round-racers',
    name: 'Merge Round Racers',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/merge-round-racers/game.html',
  },
  {
    id: 'minecraft-15',
    name: 'Minecraft 15',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/minecraft-15/game.html',
  },
  {
    id: 'minecraft-18',
    name: 'Minecraft 18',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/minecraft-18/game.html',
  },
  {
    id: 'miniputt',
    name: 'Miniputt',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/miniputt/game.html',
  },
  {
    id: 'motox3m-spooky',
    name: 'Motox3m Spooky',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m-spooky/game.html',
  },
  {
    id: 'motox3m-pool',
    name: 'Motox3m Pool',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m-pool/game.html',
  },
  {
    id: 'motox3m-winter',
    name: 'Motox3m Winter',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m-winter/game.html',
  },
  {
    id: 'motox3m2',
    name: 'Motox3m2',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/motox3m2/game.html',
  },
  {
    id: 'mr-bullet',
    name: 'Mr Bullet',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/mr-bullet/game.html',
  },
  {
    id: 'nut-simulator',
    name: 'Nut Simulator',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/nut-simulator/game.html',
  },
  {
    id: 'ovo',
    name: 'OvO',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/ovo/game.html',
  },
  {
    id: 'ovo-2',
    name: 'OvO 2',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/ovo-2/game.html',
  },
  {
    id: 'paper-io-2',
    name: 'Paper IO 2',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/paper-io-2/game.html',
  },
  {
    id: 'ovo-dimensions',
    name: 'OvO Dimensions',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/ovo-dimensions/game.html',
  },
  {
    id: 'retro-bowl-college',
    name: 'Retro Bowl College',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/retro-bowl-college/game.html',
  },
  {
    id: 'rise-higher',
    name: 'Rise Higher',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/rise-higher/game.html',
  },
  {
    id: 'scrap-metal',
    name: 'Scrap Metal',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/scrap-metal/game.html',
  },
  {
    id: 'slope-2',
    name: 'Slope 2',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/slope-2/game.html',
  },
  {
    id: 'snowbattle',
    name: 'Snowbattle',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/snowbattle/game.html',
  },
  {
    id: 'soccer-random',
    name: 'Soccer Random',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/soccer-random/game.html',
  },
  {
    id: 'soccer-skills',
    name: 'Soccer Skills',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/soccer-skills/game.html',
  },
  {
    id: 'stick-duel-battle',
    name: 'Stick Duel Battle',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/stick-duel-battle/game.html',
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/stack/game.html',
  },
  {
    id: 'paper-io-3',
    name: 'Paper IO 3',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/paper-io-3/game.html',
  },
  {
    id: 'stickman-hook',
    name: 'Stickman Hook',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/stickman-hook/game.html',
  },
  {
    id: 'stick-merge',
    name: 'Stick Merge',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/stick-merge/game.html',
  },
  {
    id: 'subway-surfers-ny',
    name: 'Subway Surfers Ny',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/subway-surfers-ny/game.html',
  },
  {
    id: 'super-mario-64',
    name: 'Super Mario 64',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/super-mario-64/game.html',
  },
  {
    id: 'superhot',
    name: 'Superhot',
    category: 'Shooter',
    url: 'https://viberverse.github.io/games/superhot/game.html',
  },
  {
    id: 'tag',
    name: 'Tag',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/tag/game.html',
  },
  {
    id: 'temple-run-2',
    name: 'Temple Run 2',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/temple-run-2/game.html',
  },
  {
    id: 'there-is-no-game',
    name: 'There Is No Game',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/there-is-no-game/game.html',
  },
  {
    id: 'tiny-fishing',
    name: 'Tiny Fishing',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/tiny-fishing/game.html',
  },
  {
    id: 'toss-the-turtle',
    name: 'Toss The Turtle',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/toss-the-turtle/game.html',
  },
  {
    id: 'tunnel-rush',
    name: 'Tunnel Rush',
    category: 'Driving',
    url: 'https://viberverse.github.io/games/tunnel-rush/game.html',
  },
  {
    id: 'volley-random',
    name: 'Volley Random',
    category: 'Sports',
    url: 'https://viberverse.github.io/games/volley-random/game.html',
  },
  {
    id: 'wordle',
    name: 'Wordle',
    category: 'Puzzle',
    url: 'https://viberverse.github.io/games/wordle/game.html',
  },
  {
    id: 'worlds-hardest-game',
    name: 'Worlds Hardest Game',
    category: 'Sandbox',
    url: 'https://viberverse.github.io/games/worlds-hardest-game/game.html',
  },
  {
    id: 'territorial',
    name: 'Territorial',
    category: 'Arcade',
    url: 'https://viberverse.github.io/games/territorial/game.html',
  },
];

// Title-first search helper: normalises punctuation away so "cs:go" and "cs go" behave alike,
// then scores how strongly a game title matches the query. -1 means no title match at all.
const normalizeTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const titleMatchScore = (name: string, rawQuery: string): number => {
  const title = normalizeTitle(name);
  const query = normalizeTitle(rawQuery);
  if (!query) return 0;
  if (title === query) return 1000;
  if (title.startsWith(query)) return 800;
  const tokens = query.split(' ').filter(Boolean);
  const words = title.split(' ').filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => words.some((word) => word.startsWith(token)))) return 600;
  if (tokens.every((token) => words.some((word) => word.startsWith(token)))) return 500;
  if (tokens.every((token) => title.includes(token))) return 300;
  return -1;
};
// Shared tile so Favorites, Recently played and the full library render identically.
const GameTile: React.FC<{
  game: DirectGame;
  accentHex: string;
  accentRgb: string;
  isFavorite: boolean;
  onPlay: (game: DirectGame) => void;
  onToggleFavorite: (id: string) => void;
  meta?: string;
}> = ({ game, accentHex, accentRgb, isFavorite, onPlay, onToggleFavorite, meta }) => (
  <div className="group relative">
    <button
      type="button"
      onClick={() => onPlay(game)}
      title={`Play ${game.name}`}
      className="flex h-full w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-neutral-800/80 bg-neutral-900/20 p-4 text-center transition-all hover:border-neutral-700 hover:bg-neutral-900/50 active:scale-[0.98]"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-105"
        style={{
          borderColor: `rgba(${accentRgb}, 0.45)`,
          backgroundColor: `rgba(${accentRgb}, 0.12)`,
          color: accentHex,
          boxShadow: `0 4px 16px rgba(${accentRgb}, 0.15)`,
        }}
      >
        <Gamepad2 className="h-7 w-7 stroke-[2]" />
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-white">{game.name}</h2>
        {game.description && (
          <p className="text-[11px] leading-relaxed text-neutral-400">{game.description}</p>
        )}
        {meta && <p className="font-mono text-[10px] text-neutral-500">{meta}</p>}
      </div>

      <span
        className="mt-auto inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all"
        style={{
          borderColor: `rgba(${accentRgb}, 0.45)`,
          backgroundColor: `rgba(${accentRgb}, 0.12)`,
          color: accentHex,
        }}
      >
        <Play className="h-3 w-3" />
        <span>Play</span>
      </span>
    </button>

    <button
      type="button"
      onClick={() => onToggleFavorite(game.id)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={`absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border bg-neutral-950/70 transition-colors hover:border-neutral-600 hover:text-white ${isFavorite ? '' : 'border-neutral-800 text-neutral-500'}`}
      style={isFavorite ? { borderColor: `rgba(${accentRgb}, 0.55)`, color: accentHex } : undefined}
    >
      <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  </div>
);
export const DirectGamesPage: React.FC<DirectGamesPageProps> = ({
  onBrowseSites,
  onPlayingChange,
}) => {
  const { currentAccentHex, accentRgb } = useSettings();
  const [activeGame, setActiveGame] = useState<DirectGame | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<GameCategory | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [recentPlays, setRecentPlays] = useState<RecentPlays>(readRecentPlays);

  // Tell the shell when a game is running, and always hand the space back on unmount
  useEffect(() => {
    onPlayingChange?.(activeGame !== null);
    return () => onPlayingChange?.(false);
  }, [activeGame, onPlayingChange]);

  // Favorites and the recent-play log live on this device only
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable - favorites stay in memory for this session */
    }
  }, [favorites]);

  useEffect(() => {
    try {
      const cutoff = Date.now() - RECENT_WINDOW_MS;
      const pruned = Object.fromEntries(
        Object.entries(recentPlays).filter(([, at]) => at >= cutoff)
      );
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(pruned));
    } catch {
      /* storage unavailable - recents stay in memory for this session */
    }
  }, [recentPlays]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [id, ...prev]));
  };

  const launchGame = (game: DirectGame) => {
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
    setActiveGame(game);
    setRecentPlays((prev) => ({ ...prev, [game.id]: Date.now() }));
  };

  const closeGame = () => {
    setActiveGame(null);
    setIsLoading(false);
  };

  const restartGame = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  // Search + category + sort applied to the tile grid only; the player view above is untouched.
  // Search is title-first: only the game name is matched, and the strongest name matches
  // (exact title > title prefix > word prefix > any substring) are listed first.
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGames = DIRECT_GAMES
    .map((game) => ({ game, score: normalizedQuery ? titleMatchScore(game.name, normalizedQuery) : 0 }))
    .filter((entry) => !normalizedQuery || entry.score >= 0)
    .filter((entry) => category === 'all' || entry.game.category === category)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (sortMode === 'az') return a.game.name.localeCompare(b.game.name);
      if (sortMode === 'za') return b.game.name.localeCompare(a.game.name);
      return 0;
    })
    .map((entry) => entry.game);
  const activeSortLabel = SORT_OPTIONS.find((option) => option.id === sortMode)?.label ?? 'Default order';
  const filterActive = category !== 'all' || sortMode !== 'default';
  const countInCategory = (value: GameCategory | 'all') =>
    value === 'all' ? DIRECT_GAMES.length : DIRECT_GAMES.filter((game) => game.category === value).length;

  // Favorites keep the order they were starred in; recents drop anything older than a week
  const categoryFilter = (game: DirectGame) => category === 'all' || game.category === category;
  const favoriteGames = favorites
    .map((id) => DIRECT_GAMES.find((game) => game.id === id))
    .filter((game): game is DirectGame => Boolean(game))
    .filter(categoryFilter);
  const recentCutoff = Date.now() - RECENT_WINDOW_MS;
  const recentlyPlayed = Object.entries(recentPlays)
    .filter(([, at]) => at >= recentCutoff)
    .sort((a, b) => b[1] - a[1])
    .map(([id, at]) => ({ game: DIRECT_GAMES.find((entry) => entry.id === id), at }))
    .filter((entry): entry is { game: DirectGame; at: number } => Boolean(entry.game))
    .filter((entry) => categoryFilter(entry.game));

  // Player view: fills the main view space, iframe loads only after a game is picked
  if (activeGame) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-neutral-950">
        {/* Player Toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/60 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={closeGame}
              title="Back to Direct Games"
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 px-2.5 text-[11px] font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Direct Games</span>
            </button>

            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
              style={{
                borderColor: `rgba(${accentRgb}, 0.45)`,
                backgroundColor: `rgba(${accentRgb}, 0.12)`,
                color: currentAccentHex,
              }}
            >
              <Gamepad2 className="h-4 w-4 stroke-[2]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">{activeGame.name}</h2>
              {activeGame.description && (
                <p className="hidden truncate text-[11px] text-neutral-400 sm:block">
                  {activeGame.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={restartGame}
              title="Restart game"
              aria-label="Restart game"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950/60 text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={activeGame.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in a new tab"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60 px-2.5 text-[11px] font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New tab</span>
            </a>
          </div>
        </div>

        {/* Game Frame */}
        <div className="relative min-h-0 w-full flex-1 bg-neutral-950">
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950/85 text-neutral-300">
              <div
                className="flex h-11 w-11 animate-pulse items-center justify-center rounded-2xl border"
                style={{
                  borderColor: `rgba(${accentRgb}, 0.45)`,
                  backgroundColor: `rgba(${accentRgb}, 0.12)`,
                  color: currentAccentHex,
                }}
              >
                <Gamepad2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-mono text-neutral-400">Loading {activeGame.name}…</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={activeGame.url}
            title={activeGame.name}
            onLoad={() => setIsLoading(false)}
            className="block h-full w-full border-0 bg-neutral-950"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
            allow="autoplay; fullscreen; gamepad; pointer-lock"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Player Footer Hint */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-neutral-800 bg-neutral-900/60 px-3 py-1 text-[11px] font-mono text-neutral-400">
          <span className="inline-flex items-center gap-1.5 truncate">
            <MousePointerClick className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Click the game once to capture keyboard and mouse</span>
          </span>
          {activeGame.tags && activeGame.tags.length > 0 && (
            <span className="hidden shrink-0 truncate text-neutral-500 md:inline">
              {activeGame.tags.join(' · ')}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Library view: games appear as tiles and load nothing until clicked
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Direct Games</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Pick a game to play right here
          </p>
        </div>

        {/* Search + filter settings */}
        <div className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-auto sm:max-w-md">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search games…"
              aria-label="Search direct games"
              className="h-9 w-full rounded-lg border border-neutral-800 bg-neutral-900/40 pl-8 pr-8 text-xs text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-600 [&::-webkit-search-cancel-button]:hidden"
              style={query ? { borderColor: `rgba(${accentRgb}, 0.55)` } : undefined}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                title="Clear search"
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={sortOpen}
              title={filterActive ? `Filter: ${categoryLabel(category)} · ${activeSortLabel}` : 'Filter games'}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/40 px-2.5 text-xs font-semibold text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95"
              style={filterActive ? { borderColor: `rgba(${accentRgb}, 0.55)`, color: currentAccentHex } : undefined}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 max-h-[70vh] w-48 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
                  <p className="px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    Category
                  </p>
                  {CATEGORY_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCategory(option);
                        setSortOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <span>{categoryLabel(option)}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-500">{countInCategory(option)}</span>
                        {category === option && (
                          <Check className="h-3.5 w-3.5 shrink-0" style={{ color: currentAccentHex }} />
                        )}
                      </span>
                    </button>
                  ))}

                  <p className="border-t border-neutral-800 px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
                    Sort by
                  </p>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortMode(option.id);
                        setSortOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <span>{option.label}</span>
                      {sortMode === option.id && (
                        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: currentAccentHex }} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {onBrowseSites && (
          <button
            type="button"
            onClick={onBrowseSites}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
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

      {/* Favorites - pinned above everything else */}
      {!normalizedQuery && favoriteGames.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-current" style={{ color: currentAccentHex }} />
            <h2 className="text-sm font-semibold text-white">Favorites</h2>
            <span className="font-mono text-[11px] text-neutral-500">{favoriteGames.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {favoriteGames.map((game) => (
              <GameTile
                key={`favorite-${game.id}`}
                game={game}
                accentHex={currentAccentHex}
                accentRgb={accentRgb}
                isFavorite
                onPlay={launchGame}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently played - anything launched in the past seven days */}
      {!normalizedQuery && recentlyPlayed.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" style={{ color: currentAccentHex }} />
            <h2 className="text-sm font-semibold text-white">Recently played</h2>
            <span className="text-[11px] text-neutral-500">past 7 days</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {recentlyPlayed.map(({ game, at }) => (
              <GameTile
                key={`recent-${game.id}`}
                game={game}
                accentHex={currentAccentHex}
                accentRgb={accentRgb}
                isFavorite={favorites.includes(game.id)}
                onPlay={launchGame}
                onToggleFavorite={toggleFavorite}
                meta={`Played ${timeAgo(at)}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* All games - divider line with the full library label */}
      <div className="flex items-center gap-3 pt-1">
        <h2 className="shrink-0 text-sm font-semibold text-white">All games</h2>
        <span className="shrink-0 font-mono text-[11px] text-neutral-500">{visibleGames.length}</span>
        <div className="h-px flex-1 bg-neutral-800" />
      </div>

      {/* Game Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibleGames.map((game) => (
          <GameTile
            key={game.id}
            game={game}
            accentHex={currentAccentHex}
            accentRgb={accentRgb}
            isFavorite={favorites.includes(game.id)}
            onPlay={launchGame}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {visibleGames.length === 0 && (
        <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/20 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-white">
            No games match
            {normalizedQuery ? ` “${query.trim()}”` : ''}
            {category !== 'all' ? ` in ${category}` : ''}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Try a different name or category, or reset the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
            style={{
              borderColor: `rgba(${accentRgb}, 0.45)`,
              backgroundColor: `rgba(${accentRgb}, 0.12)`,
              color: currentAccentHex,
            }}
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Suggestion Footnote */}
      <p className="pt-1 text-center text-[11px] text-neutral-500">
        More games are being added — you can suggest a game{' '}
        <a
          href={GAME_SUGGESTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-300"
          style={{ color: currentAccentHex }}
        >
          here*
        </a>
      </p>

      {/* Source credit */}
      <p className="pt-1 text-center text-[11px] text-neutral-500">
        all games are sourced from the github repo{' '}
        <a
          href="https://github.com/viberverse/viberverse.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:text-neutral-300"
          style={{ color: currentAccentHex }}
        >
          viberverse*
        </a>{' '}
        all credit to them
      </p>
    </div>
  );
};
