import React, { useState, useEffect, useRef } from 'react';
import { Globe, X, Check } from 'lucide-react';

interface ProxyDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PROXY_DISCLAIMER_KEY = 'gamevault_seen_proxy_disclaimer_v1';

export const ProxyDisclaimerModal: React.FC<ProxyDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

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

  const handleDismiss = () => {
    if (isClosing) return;
    try {
      localStorage.setItem(PROXY_DISCLAIMER_KEY, 'true');
    } catch {
      // storage unavailable
    }
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proxy-disclaimer-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-md flex flex-col overflow-hidden rounded-2xl border border-orange-500/40 bg-neutral-900/95 shadow-2xl shadow-orange-950/40 my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Close proxy disclaimer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 text-center space-y-4 relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-xl shadow-orange-500/20 ring-4 ring-orange-500/10">
            <Globe className="h-8 w-8 text-orange-400 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-orange-400">
              External Gateway Notice
            </div>
            <h2
              id="proxy-disclaimer-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono"
            >
              AnyProxy Quick Launch
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2.5 text-left bg-neutral-950/70 rounded-xl p-4 border border-neutral-800/80">
            <p>
              The top search bar connects directly through <strong className="text-orange-300 font-semibold font-mono">anyproxy.site</strong> to unblock websites outside the catalog.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2 text-neutral-400 text-xs">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-neutral-200">Website links only:</strong> Enter domain names or URLs (e.g. <span className="font-mono text-orange-300">coolmathgames.com</span> or <span className="font-mono text-orange-300">wikipedia.org</span>).
                </span>
              </div>
              <div className="flex items-start gap-2 text-neutral-400 text-xs">
                <span className="text-orange-400 font-bold">•</span>
                <span>
                  <strong className="text-neutral-200">Third-Party Gateway:</strong> AnyProxy is an independently operated web proxy. Avoid entering personal passwords or financial credentials while browsing via public proxies.
                </span>
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>I Understand, Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
