import { useEffect, useState } from 'react';

/**
 * Tailwind's `lg` breakpoint. Below it the navigation rail is a slide-out drawer
 * opened from the header, so there is no persistent bar to reposition.
 */
export const WIDE_VIEWPORT_QUERY = '(min-width: 1024px)';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** True when there is room for the navigation bar to stay on screen. */
export function useIsWideViewport(): boolean {
  return useMediaQuery(WIDE_VIEWPORT_QUERY);
}
