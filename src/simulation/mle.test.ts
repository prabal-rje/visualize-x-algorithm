import { describe, expect, it } from 'vitest';
import { estimateBernoulliMLE } from './mle';

describe('estimateBernoulliMLE', () => {
  it('returns 0 when trials are non-positive', () => {
    expect(estimateBernoulliMLE(2, 0)).toBe(0);
  });

  it('clamps rates between 0 and 1', () => {
    expect(estimateBernoulliMLE(10, 5)).toBe(1);
    expect(estimateBernoulliMLE(-2, 5)).toBe(0);
  });

  it('returns successes divided by trials', () => {
    expect(estimateBernoulliMLE(2, 10)).toBeCloseTo(0.2);
  });
});
