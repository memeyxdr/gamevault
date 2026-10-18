import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Home,
  RotateCw,
  ExternalLink,
  Search,
  Globe,
  X,
  Lock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface InSiteBrowserProps {
  initialUrl?: string;
  onClose: () => void;
}

// Determines if raw input is likely a URL vs a search query
export function isLikelyUrl(input: string): boolean {
  const trimmed = input.trim();

  // Security: reject dangerous pseudo-protocols like javascript:, data:, vbscript:, file:
  if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
    return false;
  }

  // Multi-word strings with spaces are always search queries
  if (/\s/.test(trimmed)) {
    return false;
  }

  // Explicit protocols (http or https) are URLs
  if (/^https?:\/\//i.test(trimmed)) {
    return true;
  }

  // IP addresses or localhost
  if (/^(localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/.*)?$/i.test(trimmed)) {
    return true;
  }

  // Domain name with common or generic TLD (2+ alpha characters)
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
  return domainPattern.test(trimmed);
}

// Converts any input into the proper AnyProxy destination
export function resolveBrowserDestination(input: string): {
  url: string;
  displayAddress: string;
  isSearch: boolean;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      url: 'https://anyproxy.site/duckduckgo.com',
      displayAddress: 'duckduckgo.com',
      isSearch: false,
    };
  }

  // Security: prevent execution of javascript/data/file URLs - treat them safely as search queries
  if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
    const encoded = encodeURIComponent(trimmed);
    return {
      url: `https://anyproxy.site/duckduckgo.com/?q=${encoded}`,
      displayAddress: trimmed,
      isSearch: true,
    };
  }

  // Check if input is already prefixed with anyproxy.site
  const anyProxyMatch = trimmed.match(/^(?:https?:\/\/)?anyproxy\.site\/(.+)$/i);
  if (anyProxyMatch) {
    const internal = anyProxyMatch[1];
    return {
      url: `https://anyproxy.site/${internal}`,
      displayAddress: internal,
      isSearch: false,
    };
  }

  if (isLikelyUrl(trimmed)) {
    // Direct website URL normalization
    const normalized = trimmed.replace(/^https?:\/\//i, '');
    return {
      url: `https://anyproxy.site/${normalized}`,
      displayAddress: normalized,
      isSearch: false,
    };
  } else {
    // Search query -> route to DuckDuckGo search query URL via AnyProxy
    const encoded = encodeURIComponent(trimmed);
    const searchTarget = `duckduckgo.com/?q=${encoded}`;
    return {
      url: `https://anyproxy.site/${searchTarget}`,
      displayAddress: trimmed,
      isSearch: true,
    };
  }
}

export const InSiteBrowser: React.FC<InSiteBrowserProps> = ({
  initialUrl = 'https://anyproxy.site/duckduckgo.com',
  onClose,
}) => {
  const { currentAccentHex, settings } = useSettings();

  // Navigation History Stack
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const activeUrl = history[historyIndex] || initialUrl;

  // Formatted address for display in input
  const getDisplayFromUrl = (url: string) => {
    const clean = url.replace(/^https?:\/\/anyproxy\.site\/?/i, '');
    if (clean.startsWith('duckduckgo.com/?q=')) {
      try {
        const query = decodeURIComponent(clean.replace('duckduckgo.com/?q=', ''));
        return query;
      } catch {
        return clean;
      }
    }
    return clean;
  };

  const [inputAddress, setInputAddress] = useState<string>(() => getDisplayFromUrl(initialUrl));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [showLoadTimeoutWarning, setShowLoadTimeoutWarning] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize address bar when activeUrl changes
  useEffect(() => {
    setInputAddress(getDisplayFromUrl(activeUrl));
    setIsLoading(true);
    setShowLoadTimeoutWarning(false);
    if (iframeRef.current) delete iframeRef.current.dataset.loaded;

    // Set a timeout to display a helpful embed fallback if the target site blocks framing
    const timer = setTimeout(() => {
      // A cross-origin iframe cannot be inspected for blank content or provider errors.
      // Only offer the fallback if it has not fired a load event by this point.
      if (iframeRef.current && !iframeRef.current.dataset.loaded) {
        setShowLoadTimeoutWarning(true);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [activeUrl, iframeKey]);

  // Handle User Navigation
  const navigateTo = useCallback((destinationUrl: string) => {
    if (destinationUrl === activeUrl) {
      handleReload();
      return;
    }
    setIsLoading(true);
    setHistory((prev) => {
      // Discard forward history when a new navigation occurs
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, destinationUrl];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [activeUrl, historyIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAddress.trim()) return;
    const resolved = resolveBrowserDestination(inputAddress);
    navigateTo(resolved.url);
  };

  // Back Navigation
  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleHome = () => {
    navigateTo('https://anyproxy.site/duckduckgo.com');
  };

  // Reload Navigation
  const handleReload = () => {
    setIsLoading(true);
    setShowLoadTimeoutWarning(false);
    if (iframeRef.current) delete iframeRef.current.dataset.loaded;
    setIframeKey((prev) => prev + 1);
  };

  // Open in New Tab
  const handleOpenInNewTab = () => {
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  // Iframe load listener
  const handleIframeLoad = () => {
    if (iframeRef.current) iframeRef.current.dataset.loaded = 'true';
    setIsLoading(false);
    setShowLoadTimeoutWarning(false);
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 w-full gap-0 animate-fade-in">
      {/* Top Browser Control Bar - Exactly matching Reference Image 2 Mockup */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-neutral-900/90 shrink-0">
        {/* 1. Back Button */}
        <button
          type="button"
          onClick={handleBack}
          disabled={historyIndex <= 0}
          title={historyIndex > 0 ? 'Go back' : 'No previous page in history'}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
            historyIndex > 0
              ? 'border-neutral-800 bg-neutral-950/60 text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 active:scale-95'
              : 'border-transparent text-neutral-600 bg-neutral-950/20 cursor-not-allowed opacity-50'
          }`}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleHome}
          title="Go to DuckDuckGo home"
          aria-label="Home"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer active:scale-95"
        >
          <Home className="h-4 w-4" />
        </button>

        {/* 2. Address Bar Form (Wide Middle Slot) */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <div className="relative flex items-center w-full group">
            <div className="pointer-events-none absolute left-3 flex items-center gap-1 text-neutral-500 group-focus-within:text-orange-400 transition-colors">
              {isLikelyUrl(inputAddress) ? (
                <Lock className="h-3.5 w-3.5 text-emerald-400/80" />
              ) : (
                <Search className="h-3.5 w-3.5 text-neutral-400" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="Search or enter a link"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/90 py-2 pl-9 pr-10 text-xs font-mono text-neutral-100 placeholder:text-neutral-500/70 placeholder:font-sans focus:border-orange-500/60 focus:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner"
            />

            {/* Enter / Go Navigation Control Button */}
            <button
              type="submit"
              title="Enter / Go: Navigate to destination"
              aria-label="Enter or Go"
              className={`absolute right-2 flex h-6 w-6 items-center justify-center rounded-lg text-neutral-950 font-bold transition-all cursor-pointer shadow-xs active:scale-90 ${
                inputAddress.trim()
                  ? 'bg-orange-500 hover:bg-orange-400 opacity-100 scale-100'
                  : 'bg-neutral-800 text-neutral-500 opacity-60 hover:opacity-100'
              }`}
              style={inputAddress.trim() ? { backgroundColor: currentAccentHex } : {}}
            >
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* 3. Reload Button */}
        <button
          type="button"
          onClick={handleReload}
          title="Reload page"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer active:scale-95 ${
            isLoading ? 'animate-spin text-orange-400' : ''
          }`}
          aria-label="Reload"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {/* 4. Open in New Tab Button */}
        <button
          type="button"
          onClick={handleOpenInNewTab}
          title="Open current page in a new browser tab"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer active:scale-95"
          aria-label="Open in New Tab"
        >
          <ExternalLink className="h-4 w-4" />
        </button>

        {/* 5. Exit Browser Button */}
        <button
          type="button"
          onClick={onClose}
          title="Exit In-Site Browser and return to GameVault"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-red-950/30 hover:border-red-500/40 transition-all cursor-pointer active:scale-95"
          aria-label="Close Browser"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Embedded Iframe Container Area */}
      <div className="relative flex-1 min-h-0 w-full bg-neutral-950 overflow-hidden flex flex-col">
        {/* Loading Bar Indicator */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-neutral-900 overflow-hidden">
            <div
              className="h-full bg-orange-500 animate-pulse w-full"
              style={{ backgroundColor: currentAccentHex }}
            />
          </div>
        )}

        {/* Iframe Loading Banner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-xs text-neutral-300 space-y-3 pointer-events-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/10 text-orange-400 animate-pulse">
              <Compass className="h-6 w-6 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-white font-mono">
                Connecting to AnyProxy Gateway...
              </p>
              <p className="text-xs text-neutral-400 font-mono max-w-sm truncate px-4">
                {activeUrl}
              </p>
            </div>
          </div>
        )}

        {/* Website Refused / Iframe Restriction Helper Banner */}
        {showLoadTimeoutWarning && (
          <div className="absolute bottom-12 left-4 right-4 z-30 mx-auto max-w-xl rounded-xl border border-amber-500/50 bg-neutral-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs text-neutral-200 flex items-start justify-between gap-3 animate-toast-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  Taking longer than usual or page blank?
                </p>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Some websites enforce security policies (<code className="text-neutral-300">X-Frame-Options</code>) that block in-iframe embedding. You can launch it directly in a new tab.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="inline-flex items-center gap-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold px-2.5 py-1 text-xs transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: currentAccentHex }}
              >
                <span>Open in Tab</span>
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setShowLoadTimeoutWarning(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Dismiss warning"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* The Sandboxed Browser Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={activeUrl}
          title="In-Site GameVault Browser"
          onLoad={handleIframeLoad}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Bottom Status / Navigation Helper Strip */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/90 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 shrink-0">
          <div className="flex items-center gap-2 truncate max-w-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-neutral-300 truncate">{activeUrl}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="text-neutral-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Pop out ↗</span>
            </button>
            <span className="text-neutral-600">|</span>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Exit Browser ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
