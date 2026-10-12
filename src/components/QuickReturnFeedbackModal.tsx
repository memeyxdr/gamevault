import React from 'react';
import { AlertCircle, ExternalLink, X, ArrowRight, MessageSquareWarning } from 'lucide-react';

interface QuickReturnFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
  openedUrl?: string;
}

export const GAMEVAULT_ERROR_REPORT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSel_qnMs80ZZIFoIgV-VqPEvOd6ZDZjtbr-32cb9KHXrVuCqw/viewform?usp=dialog';

export const QuickReturnFeedbackModal: React.FC<QuickReturnFeedbackModalProps> = ({
  isOpen,
  onClose,
  siteName,
  openedUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-return-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-orange-500/40 bg-neutral-900/95 p-6 shadow-2xl shadow-orange-950/50 backdrop-blur-xl text-neutral-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Halloween Ambient Glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-inner">
            <MessageSquareWarning className="h-6 w-6" />
          </div>
          <div>
            <h2 id="quick-return-title" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Whoa, way too fast!
              <span className="text-base">⚡</span>
            </h2>
            <p className="text-xs font-medium text-orange-400/90 mt-0.5">
              Did you run into a problem?
            </p>
          </div>
        </div>

        {/* Explanatory Body */}
        <div className="space-y-3 text-neutral-300 text-sm leading-relaxed mb-6">
          <p>
            You came back to GameVault within just a few seconds
            {siteName ? (
              <> after opening <span className="font-semibold text-white">"{siteName}"</span></>
            ) : null}
            . If the link was blocked, took too long to load, or gave you an error, you can report it so we can fix or replace it!
          </p>

          {openedUrl && (
            <div className="rounded-lg bg-neutral-950/70 border border-neutral-800/80 px-3 py-2 text-xs font-mono text-neutral-400 truncate">
              <span className="text-neutral-500 select-none">Target: </span>
              {openedUrl}
            </div>
          )}

          <div className="rounded-lg bg-orange-950/30 border border-orange-800/40 p-3 text-xs text-orange-200/90 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
            <span>
              Reporting broken links helps keep GameVault clean and updated with working unblockers for everyone.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all"
          >
            I'm all good, dismiss
          </button>
          <a
            href={GAMEVAULT_ERROR_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-95 group"
          >
            <span>Report Error to GameVault</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-900 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
