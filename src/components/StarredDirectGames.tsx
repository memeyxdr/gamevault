import React from 'react';
import { Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { DirectGame, GameTile } from './DirectGamesPage';

interface StarredDirectGamesProps {
  games: DirectGame[];
  onPlay: (game: DirectGame) => void;
  onToggleFavorite: (id: string) => void;
}

/** Games starred in Direct Games, listed on the Starred page next to the starred sites. */
export const StarredDirectGames: React.FC<StarredDirectGamesProps> = ({
  games,
  onPlay,
  onToggleFavorite,
}) => {
  const { currentAccentHex, accentRgb } = useSettings();

  if (games.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5 fill-current" style={{ color: currentAccentHex }} />
        <h2 className="text-sm font-semibold text-white">Starred Direct Games</h2>
        <span className="font-mono text-[11px] text-neutral-500">{games.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {games.map((game) => (
          <GameTile
            key={`starred-game-${game.id}`}
            game={game}
            accentHex={currentAccentHex}
            accentRgb={accentRgb}
            isFavorite
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
