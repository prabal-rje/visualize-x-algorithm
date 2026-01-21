import { describe, it, expect } from 'vitest';
import { dot, magnitude, cosine } from './similarity';

describe('similarity utilities', () => {
  describe('dot', () => {
    it('computes sum of element-wise products', () => {
      expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
    });

    it('returns 0 for empty arrays', () => {
      expect(dot([], [])).toBe(0);
    });

    it('handles single element arrays', () => {
      expect(dot([5], [3])).toBe(15);
    });
  });

  describe('magnitude', () => {
    it('computes square root of dot product with itself', () => {
      expect(magnitude([3, 4])).toBe(5);
    });

    it('returns 0 for zero vector', () => {
      expect(magnitude([0, 0, 0])).toBe(0);
    });

    it('handles single element', () => {
      expect(magnitude([7])).toBe(7);
    });
  });

  describe('cosine', () => {
    it('returns 1 for identical vectors', () => {
      expect(cosine([1, 0], [1, 0])).toBe(1);
    });

    it('returns 0 for orthogonal vectors', () => {
      expect(cosine([1, 0], [0, 1])).toBe(0);
    });

    it('returns -1 for opposite vectors', () => {
      expect(cosine([1, 0], [-1, 0])).toBe(-1);
    });

    it('returns 0 when first vector is zero', () => {
      expect(cosine([0, 0], [1, 0])).toBe(0);
    });

    it('returns 0 when second vector is zero', () => {
      expect(cosine([1, 0], [0, 0])).toBe(0);
    });

    it('returns 0 when both vectors are zero', () => {
      expect(cosine([0, 0], [0, 0])).toBe(0);
    });

    it('handles non-unit vectors correctly', () => {
      // [3, 4] has magnitude 5, [4, 3] has magnitude 5
      // dot product = 12 + 12 = 24
      // cosine = 24 / (5 * 5) = 0.96
      expect(cosine([3, 4], [4, 3])).toBeCloseTo(0.96, 10);
    });
  });
});
