import React, { useEffect, useRef, useState } from 'react';
import { X, MessageSquare, Gamepad2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface NextUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NEXT_VERSION = 'v1.8';

const PLANNED: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
}[] = [
  {
    icon: MessageSquare,
    title: 'Improving the website from your feedback',
    detail:
      'Working through the feedback and error reports you submit — fixing what breaks and tightening the pages you use most.',
  },
  {
    icon: Gamepad2,
    title: 'More games',
    detail: 'Adding more titles to Direct Games, with fresh categories alongside them.',
  },
];

export const NextUpdateModal: React.FC<NextUpdateModalProps> = ({ isOpen, onClose }) => {
  const { currentAccentHex, accentRgb } = useSettings();
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reopening always starts a fresh, visible panel rather than mid-exit
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    if (isClosing) return;
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="next-update-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-md max-h-[min(92vh,640px)] flex flex-col overflow-hidden rounded-2xl border bg-neutral-900/95 shadow-2xl my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        style={{ borderColor: `rgba(${accentRgb}, 0.3)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `rgba(${accentRgb}, 0.2)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3 border-b border-neutral-800/70 shrink-0 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium"
                style={{
                  borderColor: `rgba(${accentRgb}, 0.45)`,
                  backgroundColor: `rgba(${accentRgb}, 0.12)`,
                  color: currentAccentHex,
                }}
              >
                <span>{NEXT_VERSION}</span>
              </div>
              <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-neutral-300">
                In development
              </span>
            </div>
            <h2
              id="next-update-title"
              className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono"
            >
              Next Update
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Planned work */}
        <div className="overflow-y-auto p-5 sm:p-6 py-4 space-y-2.5 relative z-10">
          <p className="text-xs text-neutral-400">
            Here is what {NEXT_VERSION} is aiming at. Nothing here is released yet — the list can still
            change before it ships.
          </p>

          {PLANNED.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 flex items-start gap-3"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: `rgba(${accentRgb}, 0.45)`,
                    backgroundColor: `rgba(${accentRgb}, 0.12)`,
                    color: currentAccentHex,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 pt-3 border-t border-neutral-800/70 bg-neutral-900/95 shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-bold py-2.5 px-5 text-sm transition-all active:scale-[0.98] cursor-pointer border"
            style={{
              borderColor: `rgba(${accentRgb}, 0.55)`,
              backgroundColor: `rgba(${accentRgb}, 0.14)`,
              color: currentAccentHex,
            }}
          >
            <span>Got it</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
