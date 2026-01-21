import { describe, expect, it } from 'vitest';
import { computeBarrelSample } from './barrelDistortion';

describe('barrel distortion map', () => {
  it('produces symmetric displacement values', () => {
    const size = 32;
    const topLeft = computeBarrelSample(0, 0, size, 1);
    const center = computeBarrelSample(15, 15, size, 1);
    const bottomRight = computeBarrelSample(size - 1, size - 1, size, 1);

    expect(topLeft.r).toBeLessThan(128);
    expect(topLeft.g).toBeLessThan(128);
    expect(bottomRight.r).toBeGreaterThan(128);
    expect(bottomRight.g).toBeGreaterThan(128);
    expect(Math.abs(center.r - 128)).toBeLessThanOrEqual(2);
    expect(Math.abs(center.g - 128)).toBeLessThanOrEqual(2);
  });
});
