import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, ExternalLink, Check, ShieldAlert } from 'lucide-react';

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative w-full max-w-md flex flex-col overflow-hidden rounded-2xl border border-amber-500/40 bg-neutral-900/95 shadow-2xl my-auto ${
          isClosing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient warning glow effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Close disclaimer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content Body */}
        <div className="p-6 sm:p-7 text-center space-y-4 relative z-10">
          {/* Warning Icon Badge */}
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/10">
            <AlertTriangle className="h-9 w-9 sm:h-11 sm:w-11 text-amber-400 stroke-[2.3]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-400">
              <ShieldAlert className="h-3 w-3" />
              <span>Third-Party Proxy Notice</span>
            </div>
            <h2
              id="proxy-disclaimer-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono"
            >
              External Gateway Disclaimer
            </h2>
          </div>

          {/* Formalized Notice Copy */}
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-2.5 text-left bg-neutral-950/70 rounded-xl p-4 border border-neutral-800/90 shadow-inner">
            <p>
              Please be aware that all web browsing, traffic, and content accessed beyond this search bar are operated and handled by <strong className="text-amber-300 font-semibold">anyproxy.site</strong>.
            </p>
            <p>
              This proxy service is an external third-party utility and is <strong className="text-white font-semibold underline underline-offset-2">NOT a GameVault-created or hosted feature</strong>. GameVault is not responsible for any connection drops, filtering blocks, or errors that occur while browsing through the proxy.
            </p>
            <p className="text-neutral-400 text-xs">
              If you encounter any bugs, connection issues, or broken pages, please report them directly to <strong className="text-neutral-200">anyproxy.site</strong>, and <strong className="text-amber-300">NOT</strong> through GameVault error reports.
            </p>
          </div>

          {/* Quick link to anyproxy.site */}
          <div className="pt-1">
            <a
              href="https://anyproxy.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-lg border border-neutral-800 hover:border-amber-500/40 bg-neutral-900/60 hover:bg-neutral-850 px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <span>Visit anyproxy.site official gateway</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>

          {/* Dismiss button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>I Understand & Acknowledge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
