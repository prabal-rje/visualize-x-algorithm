import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { estimateBernoulliMLE } from './mle';
import { simulateEngagement } from './simulate';

const defaultAudienceMix = AUDIENCES.reduce<Record<string, number>>(
  (acc, audience) => {
    acc[audience.id] = 100 / AUDIENCES.length;
    return acc;
  },
  {}
);

describe('simulateEngagement', () => {
  it('returns MLE rates based on simulated counts', () => {
    const result = simulateEngagement({
      tweetText: 'Testing the simulation output.',
      personaId: 'tech-founder',
      audienceMix: defaultAudienceMix
    });

    expect(result.rates.likeRate).toBeCloseTo(
      estimateBernoulliMLE(result.counts.likes, result.counts.impressions),
      6
    );
    expect(result.rates.clickRate).toBeCloseTo(
      estimateBernoulliMLE(result.counts.clicks, result.counts.impressions),
      6
    );
  });

  it('boosts engagement rates for longer tweets', () => {
    const short = simulateEngagement({
      tweetText: 'Short.',
      personaId: 'tech-founder',
      audienceMix: defaultAudienceMix
    });
    const long = simulateEngagement({
      tweetText: 'L'.repeat(240),
      personaId: 'tech-founder',
      audienceMix: defaultAudienceMix
    });

    expect(long.rates.likeRate).toBeGreaterThan(short.rates.likeRate);
  });
});
