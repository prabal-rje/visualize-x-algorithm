import { describe, it, expect } from 'vitest';
import { computeRPGStats, badgeForPercentile } from './rpgStats';
import type { SimulationResult } from '../simulation/simulate';

describe('computeRPGStats', () => {
  it('computes reach as impressions count', () => {
    const result: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 60,
        reposts: 12,
        replies: 6,
        bookmarks: 10,
        clicks: 20
      },
      rates: {
        likeRate: 0.06,
        repostRate: 0.012,
        replyRate: 0.006,
        bookmarkRate: 0.01,
        clickRate: 0.02
      }
    };

    const stats = computeRPGStats(result);

    expect(stats.reach).toBe(1000);
  });

  it('computes resonance as weighted engagement rate', () => {
    // resonance = (likeRate * 1.0) + (repostRate * 2.0) + (replyRate * 1.5) + (bookmarkRate * 1.2) + (clickRate * 0.5)
    // = (0.06 * 1.0) + (0.012 * 2.0) + (0.006 * 1.5) + (0.01 * 1.2) + (0.02 * 0.5)
    // = 0.06 + 0.024 + 0.009 + 0.012 + 0.01
    // = 0.115
    const result: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 60,
        reposts: 12,
        replies: 6,
        bookmarks: 10,
        clicks: 20
      },
      rates: {
        likeRate: 0.06,
        repostRate: 0.012,
        replyRate: 0.006,
        bookmarkRate: 0.01,
        clickRate: 0.02
      }
    };

    const stats = computeRPGStats(result);

    expect(stats.resonance).toBeCloseTo(0.115, 6);
  });

  it('computes momentum as total engagements / impressions * 100', () => {
    // totalEngagements = likes + reposts + replies + bookmarks + clicks = 60 + 12 + 6 + 10 + 20 = 108
    // momentum = (108 / 1000) * 100 = 10.8
    const result: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 60,
        reposts: 12,
        replies: 6,
        bookmarks: 10,
        clicks: 20
      },
      rates: {
        likeRate: 0.06,
        repostRate: 0.012,
        replyRate: 0.006,
        bookmarkRate: 0.01,
        clickRate: 0.02
      }
    };

    const stats = computeRPGStats(result);

    expect(stats.momentum).toBeCloseTo(10.8, 6);
  });

  it('computes percentile derived from resonance (higher resonance = lower percentile)', () => {
    const result: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 60,
        reposts: 12,
        replies: 6,
        bookmarks: 10,
        clicks: 20
      },
      rates: {
        likeRate: 0.06,
        repostRate: 0.012,
        replyRate: 0.006,
        bookmarkRate: 0.01,
        clickRate: 0.02
      }
    };

    const stats = computeRPGStats(result);

    // Percentile should be between 0 and 1
    expect(stats.percentile).toBeGreaterThanOrEqual(0);
    expect(stats.percentile).toBeLessThanOrEqual(1);
  });

  it('gives lower percentile for higher resonance', () => {
    const lowResonanceResult: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 10,
        reposts: 2,
        replies: 1,
        bookmarks: 2,
        clicks: 5
      },
      rates: {
        likeRate: 0.01,
        repostRate: 0.002,
        replyRate: 0.001,
        bookmarkRate: 0.002,
        clickRate: 0.005
      }
    };

    const highResonanceResult: SimulationResult = {
      counts: {
        impressions: 1000,
        likes: 200,
        reposts: 50,
        replies: 30,
        bookmarks: 40,
        clicks: 80
      },
      rates: {
        likeRate: 0.2,
        repostRate: 0.05,
        replyRate: 0.03,
        bookmarkRate: 0.04,
        clickRate: 0.08
      }
    };

    const lowStats = computeRPGStats(lowResonanceResult);
    const highStats = computeRPGStats(highResonanceResult);

    // Higher resonance should yield lower (better) percentile
    expect(highStats.percentile).toBeLessThan(lowStats.percentile);
  });

  it('handles zero impressions gracefully', () => {
    const result: SimulationResult = {
      counts: {
        impressions: 0,
        likes: 0,
        reposts: 0,
        replies: 0,
        bookmarks: 0,
        clicks: 0
      },
      rates: {
        likeRate: 0,
        repostRate: 0,
        replyRate: 0,
        bookmarkRate: 0,
        clickRate: 0
      }
    };

    const stats = computeRPGStats(result);

    expect(stats.reach).toBe(0);
    expect(stats.resonance).toBe(0);
    expect(stats.momentum).toBe(0);
    expect(stats.percentile).toBe(1); // Worst percentile for zero engagement
  });
});

describe('badgeForPercentile', () => {
  it('returns "Signal Adept" for percentile <= 0.1', () => {
    expect(badgeForPercentile(0.1)).toBe('Signal Adept');
    expect(badgeForPercentile(0.05)).toBe('Signal Adept');
    expect(badgeForPercentile(0)).toBe('Signal Adept');
  });

  it('returns "Vector Guide" for percentile <= 0.3 (but > 0.1)', () => {
    expect(badgeForPercentile(0.3)).toBe('Vector Guide');
    expect(badgeForPercentile(0.2)).toBe('Vector Guide');
    expect(badgeForPercentile(0.11)).toBe('Vector Guide');
  });

  it('returns "Signal Scout" for percentile <= 0.6 (but > 0.3)', () => {
    expect(badgeForPercentile(0.6)).toBe('Signal Scout');
    expect(badgeForPercentile(0.5)).toBe('Signal Scout');
    expect(badgeForPercentile(0.31)).toBe('Signal Scout');
  });

  it('returns "Signal Initiate" for percentile > 0.6', () => {
    expect(badgeForPercentile(0.61)).toBe('Signal Initiate');
    expect(badgeForPercentile(0.8)).toBe('Signal Initiate');
    expect(badgeForPercentile(1)).toBe('Signal Initiate');
  });
});
