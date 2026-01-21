import { useEffect, useState } from 'react';

type ViewportState = {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
};

function getViewportState(): ViewportState {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return { isMobile: false, prefersReducedMotion: false, prefersHighContrast: false };
  }

  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;

  return { isMobile, prefersReducedMotion, prefersHighContrast };
}

export function useViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>(() => getViewportState());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mobileQuery = window.matchMedia('(max-width: 900px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleChange = () => setState(getViewportState());

    mobileQuery.addEventListener('change', handleChange);
    motionQuery.addEventListener('change', handleChange);
    contrastQuery.addEventListener('change', handleChange);

    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      motionQuery.removeEventListener('change', handleChange);
      contrastQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return state;
}
