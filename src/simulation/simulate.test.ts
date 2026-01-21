import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { simulateEngagement } from './simulate';

const mix = AUDIENCES.reduce<Record<string, number>>((acc, audience) => {
  acc[audience.id] = audience.id === 'bots' ? 10 : 90 / (AUDIENCES.length - 1);
  return acc;
}, {});

describe('simulateEngagement', () => {
  it('returns MLE rates derived from counts', () => {
    const result = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'hello world',
      audienceMix: mix
    });

    expect(result.counts.impressions).toBeGreaterThan(0);
    expect(result.rates.likeRate).toBeCloseTo(
      result.counts.likes / result.counts.impressions
    );
    expect(result.rates.replyRate).toBeCloseTo(
      result.counts.replies / result.counts.impressions
    );
  });

  it('increases impressions for longer tweets', () => {
    const short = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'short',
      audienceMix: mix
    });
    const long = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'this is a much longer tweet with more detail',
      audienceMix: mix
    });

    expect(long.counts.impressions).toBeGreaterThan(short.counts.impressions);
  });
});
