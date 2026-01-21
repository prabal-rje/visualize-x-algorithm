import type { SimulationResult } from '../simulation/simulate';

export type RPGStats = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
};

/**
 * Computes RPG-style stats from simulation results.
 *
 * - reach: impressions count
 * - resonance: weighted engagement rate
 * - momentum: (total engagements / impressions) * 100
 * - percentile: derived from resonance (higher resonance = lower/better percentile)
 */
export const computeRPGStats = (result: SimulationResult): RPGStats => {
  const { counts, rates } = result;

  const reach = counts.impressions;

  // resonance = (likeRate * 1.0) + (repostRate * 2.0) + (replyRate * 1.5) + (bookmarkRate * 1.2) + (clickRate * 0.5)
  const resonance =
    rates.likeRate * 1.0 +
    rates.repostRate * 2.0 +
    rates.replyRate * 1.5 +
    rates.bookmarkRate * 1.2 +
    rates.clickRate * 0.5;

  // momentum = (total engagements / impressions) * 100
  const totalEngagements =
    counts.likes +
    counts.reposts +
    counts.replies +
    counts.bookmarks +
    counts.clicks;
  const momentum =
    counts.impressions > 0
      ? (totalEngagements / counts.impressions) * 100
      : 0;

  // percentile: higher resonance = lower (better) percentile
  // Using exponential decay: percentile = e^(-k * resonance)
  // k chosen so typical resonance (0.1-0.2) maps to mid-range percentiles
  const percentile =
    resonance > 0 ? Math.exp(-10 * resonance) : 1;

  return {
    reach,
    resonance,
    momentum,
    percentile
  };
};

/**
 * Returns a badge name based on percentile.
 *
 * - "Signal Adept" for percentile <= 0.1
 * - "Vector Guide" for percentile <= 0.3
 * - "Signal Scout" for percentile <= 0.6
 * - "Signal Initiate" otherwise
 */
export const badgeForPercentile = (percentile: number): string => {
  if (percentile <= 0.1) {
    return 'Signal Adept';
  }
  if (percentile <= 0.3) {
    return 'Vector Guide';
  }
  if (percentile <= 0.6) {
    return 'Signal Scout';
  }
  return 'Signal Initiate';
};
