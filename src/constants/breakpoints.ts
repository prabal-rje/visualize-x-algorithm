/**
 * Breakpoint constants - single source of truth
 *
 * These values match tailwind.config.js screens.
 * CSS files must use these raw values in media queries (CSS limitation),
 * but should reference this file in comments for maintainability.
 *
 * Usage in CSS:
 *   @media (min-width: 560px) { ... } // BREAKPOINTS.SM
 *   @media (min-width: 820px) { ... } // BREAKPOINTS.MD
 *
 * Usage in JS/TS:
 *   import { BREAKPOINTS } from '@/constants/breakpoints';
 *   window.matchMedia(`(min-width: ${BREAKPOINTS.SM}px)`);
 */

export const BREAKPOINTS = {
  /** Extra small screens (small phones) */
  XS: 400,
  /** Small screens (phones) - tablet starts here */
  SM: 560,
  /** Medium screens (tablets) - desktop starts here */
  MD: 820,
  /** Large screens (small desktop) */
  LG: 900,
  /** Extra large screens (desktop) */
  XL: 1200,
  /** 2x large screens (wide desktop) */
  '2XL': 1600,
} as const;

/** Mobile breakpoint for useViewport hook */
export const MOBILE_BREAKPOINT = BREAKPOINTS.LG; // 900px

/** Device type helpers */
export const isPhone = (width: number) => width < BREAKPOINTS.SM;
export const isTablet = (width: number) => width >= BREAKPOINTS.SM && width < BREAKPOINTS.MD;
export const isDesktop = (width: number) => width >= BREAKPOINTS.MD;
