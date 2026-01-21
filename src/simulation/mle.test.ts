import { describe, expect, it } from 'vitest';
import { estimateBernoulliMLE } from './mle';

describe('estimateBernoulliMLE', () => {
  it('returns successes over trials', () => {
    expect(estimateBernoulliMLE(5, 10)).toBe(0.5);
  });

  it('returns 0 when trials are not positive', () => {
    expect(estimateBernoulliMLE(3, 0)).toBe(0);
  });

  it('clamps to the [0, 1] interval', () => {
    expect(estimateBernoulliMLE(12, 10)).toBe(1);
    expect(estimateBernoulliMLE(-2, 10)).toBe(0);
  });
});
