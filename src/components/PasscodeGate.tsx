import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldAlert, Eye, EyeOff, Clock, AlertTriangle, Check } from 'lucide-react';

interface PasscodeGateProps {
  onUnlock: () => void;
}

// One-way SHA-256 cryptographic hash of the authorized passcode.
// The plain text code is never stored anywhere in the codebase.
const PASSCODE_HASH = '94c63c0d4edff69f6d128b80c6ada5cc76f22949a807d15d38e1354762c45fde';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 1 minute
const STORAGE_LOCKOUT_KEY = 'restricted_vault_lockout_until';

async function verifyPasscodeHash(input: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(input.trim().toUpperCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return computedHash === PASSCODE_HASH;
  } catch {
    return false;
  }
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [showPasscode, setShowPasscode] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check on mount if an active lockout is stored
  useEffect(() => {
    try {
      const storedLockout = sessionStorage.getItem(STORAGE_LOCKOUT_KEY);
      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout, 10);
        const now = Date.now();
        if (lockoutTime > now) {
          const diffSeconds = Math.ceil((lockoutTime - now) / 1000);
          setLockoutRemaining(diffSeconds);
          setError(true);
          setErrorMessage(`Too many incorrect attempts. Locked out for ${diffSeconds}s.`);
          setAttemptsCount(MAX_ATTEMPTS);
        } else {
          sessionStorage.removeItem(STORAGE_LOCKOUT_KEY);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          try {
            sessionStorage.removeItem(STORAGE_LOCKOUT_KEY);
          } catch {
            // ignore
          }
          setError(false);
          setErrorMessage('');
          setAttemptsCount(0);
          setTimeout(() => inputRef.current?.focus(), 50);
          return 0;
        }
        const updated = prev - 1;
        setErrorMessage(`Too many incorrect attempts. Locked out for ${updated}s.`);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  useEffect(() => {
    if (lockoutRemaining === 0) {
      inputRef.current?.focus();
    }
  }, [lockoutRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutRemaining > 0) return;

    const isValid = await verifyPasscodeHash(passcode);

    if (isValid) {
      setIsUnlockedSuccess(true);
      setError(false);
      setErrorMessage('');
      setAttemptsCount(0);
      try {
        sessionStorage.removeItem(STORAGE_LOCKOUT_KEY);
      } catch {
        // ignore
      }
      setTimeout(() => {
        onUnlock();
      }, 250);
    } else {
      const nextAttempts = attemptsCount + 1;
      setAttemptsCount(nextAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      setPasscode('');

      if (nextAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        try {
          sessionStorage.setItem(STORAGE_LOCKOUT_KEY, until.toString());
        } catch {
          // ignore
        }
        setLockoutRemaining(60);
        setError(true);
        setErrorMessage('Too many incorrect attempts. Locked out for 60s.');
      } else {
        const attemptsLeft = MAX_ATTEMPTS - nextAttempts;
        setError(true);
        setErrorMessage(
          `Incorrect passcode. ${attemptsLeft} ${
            attemptsLeft === 1 ? 'attempt' : 'attempts'
          } left before 1-minute lockout.`
        );
        inputRef.current?.focus();
      }
    }
  };

  const isLockedOut = lockoutRemaining > 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-4 py-8 relative overflow-hidden select-none">
      {/* Background warm orange & dark ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-md rounded-2xl border border-neutral-800 bg-[#121316]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative z-10 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors ${
              isLockedOut
                ? 'bg-red-950/80 border-red-700/80 text-red-400'
                : 'bg-[#181a1d] border-neutral-800 text-amber-400'
            }`}
          >
            {isLockedOut ? (
              <Clock className="h-7 w-7 animate-pulse" />
            ) : (
              <Lock className="h-7 w-7 text-amber-400" />
            )}
          </div>

          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-mono font-medium ${
                isLockedOut
                  ? 'border-red-800/80 bg-red-950/60 text-red-300'
                  : 'border-neutral-800 bg-[#16181b] text-neutral-300'
              }`}
            >
              {isLockedOut ? (
                <AlertTriangle className="h-3 w-3 text-red-400" />
              ) : (
                <KeyRound className="h-3 w-3 text-amber-400" />
              )}
              <span>{isLockedOut ? 'SECURITY LOCKOUT' : 'RESTRICTED ACCESS'}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl font-mono">
              Restricted Vault
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-xs">
              {isLockedOut
                ? 'Security lockout engaged due to repeated failed entries.'
                : 'Enter the security passcode to unlock and access the directory.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="passcode-input" className="text-neutral-300 font-medium font-mono">
                Passcode / PIN:
              </label>
              {!isLockedOut && (
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-neutral-400 hover:text-neutral-200 inline-flex items-center gap-1 text-[11px]"
                >
                  {showPasscode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{showPasscode ? 'Hide' : 'Show'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                id="passcode-input"
                ref={inputRef}
                type={showPasscode ? 'text' : 'password'}
                disabled={isLockedOut}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error && !isLockedOut) setError(false);
                }}
                placeholder={isLockedOut ? `Locked out (${lockoutRemaining}s)` : 'Enter passcode...'}
                autoComplete="off"
                className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-white placeholder:text-neutral-600 focus:outline-none transition-colors ${
                  isLockedOut
                    ? 'border-red-900 bg-red-950/30 text-red-300 cursor-not-allowed'
                    : error
                    ? 'border-red-500 bg-[#0d0e11] focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-800 bg-[#0d0e11] focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
              />
            </div>

            {/* Error & Attempts Left Feedback */}
            {error && (
              <div
                className={`flex items-center gap-1.5 text-xs pt-1 justify-center font-medium text-center ${
                  isLockedOut ? 'text-red-400 font-semibold' : 'text-amber-400'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Vibrant Orange Unlock Button matching Photo 1 */}
          <button
            type="submit"
            disabled={isLockedOut}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg transition-all ${
              isLockedOut
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none'
                : 'bg-[#ff9800] hover:bg-[#fb8c00] text-neutral-950 shadow-orange-500/20 active:scale-[0.98]'
            }`}
          >
            {isLockedOut ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Locked Out ({lockoutRemaining}s)</span>
              </>
            ) : (
              <>
                <span>Unlock Vault</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Brief Bottom Confirmation Toast */}
      {isUnlockedSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/50 bg-neutral-900/95 px-5 py-2.5 shadow-2xl backdrop-blur-md text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide font-mono animate-toast-in shadow-emerald-500/20">
          <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
          <span>Unlocked</span>
        </div>
      )}
    </div>
  );
};
