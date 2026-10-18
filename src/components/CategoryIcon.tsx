import React from 'react';
import {
  Zap,
  Gamepad2,
  Puzzle,
  Compass,
  Car,
  Trophy,
  Disc,
  Users,
  MousePointerClick,
  Coffee,
  Folder,
  Layers,
  Sparkles,
  Flame,
  Swords,
  Rocket
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'zap':
    case 'action':
      return <Zap className={className} />;
    case 'gamepad2':
    case 'arcade':
      return <Gamepad2 className={className} />;
    case 'puzzle':
      return <Puzzle className={className} />;
    case 'compass':
    case 'strategy':
      return <Compass className={className} />;
    case 'car':
    case 'driving':
      return <Car className={className} />;
    case 'trophy':
    case 'sports':
      return <Trophy className={className} />;
    case 'disc':
    case 'retro':
      return <Disc className={className} />;
    case 'users':
    case 'multiplayer':
      return <Users className={className} />;
    case 'mousepointerclick':
    case 'idle':
      return <MousePointerClick className={className} />;
    case 'coffee':
    case 'casual':
      return <Coffee className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'swords':
      return <Swords className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    default:
      return <Folder className={className} />;
  }
};
