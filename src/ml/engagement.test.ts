import { describe, it, expect, beforeEach } from 'vitest';
import {
  setEmbedderForTests,
  clearCache,
  initializeEmbedder,
} from './embeddings';
import { precomputeConceptEmbeddings } from './classifier';
import {
  predictEngagement,
  calculateWeightedScore,
  type EngagementProbabilities,
  type AudienceMix,
} from './engagement';

describe('engagement', () => {
  beforeEach(() => {
    setEmbedderForTests(null);
    clearCache();
  });

  /**
   * Helper to create a mock embedder that returns category-specific embeddings.
   * This allows us to control which category classifyContent returns.
   */
  function createMockEmbedder(targetCategory: string) {
    return async (text: string) => {
      // Category concept embeddings
      const categoryEmbeddings: Record<string, Float32Array> = {
        tech: new Float32Array([1, 0, 0, 0, 0, 0, 0, 0]),
        news: new Float32Array([0, 1, 0, 0, 0, 0, 0, 0]),
        entertainment: new Float32Array([0, 0, 1, 0, 0, 0, 0, 0]),
        sports: new Float32Array([0, 0, 0, 1, 0, 0, 0, 0]),
        business: new Float32Array([0, 0, 0, 0, 1, 0, 0, 0]),
        science: new Float32Array([0, 0, 0, 0, 0, 1, 0, 0]),
        lifestyle: new Float32Array([0, 0, 0, 0, 0, 0, 1, 0]),
        humor: new Float32Array([0, 0, 0, 0, 0, 0, 0, 1]),
      };

      // Match category concepts
      if (text.includes('technology')) {
        return { data: categoryEmbeddings.tech };
      }
      if (text.includes('news')) {
        return { data: categoryEmbeddings.news };
      }
      if (text.includes('movies')) {
        return { data: categoryEmbeddings.entertainment };
      }
      if (text.includes('sports')) {
        return { data: categoryEmbeddings.sports };
      }
      if (text.includes('business')) {
        return { data: categoryEmbeddings.business };
      }
      if (text.includes('science')) {
        return { data: categoryEmbeddings.science };
      }
      if (text.includes('lifestyle')) {
        return { data: categoryEmbeddings.lifestyle };
      }
      if (text.includes('funny')) {
        return { data: categoryEmbeddings.humor };
      }

      // Input text returns the target category embedding
      return { data: categoryEmbeddings[targetCategory] || categoryEmbeddings.tech };
    };
  }

  async function setupWithCategory(category: string) {
    const mockEmbedder = createMockEmbedder(category);
    setEmbedderForTests(mockEmbedder);
    await initializeEmbedder();
    await precomputeConceptEmbeddings();
  }

  describe('predictEngagement', () => {
    it('returns all 5 probability fields', async () => {
      await setupWithCategory('tech');
      const audienceMix: AudienceMix = { tech: 0.5, casual: 0.5 };

      const result = await predictEngagement('test tweet', audienceMix);

      expect(result).toHaveProperty('like');
      expect(result).toHaveProperty('repost');
      expect(result).toHaveProperty('reply');
      expect(result).toHaveProperty('bookmark');
      expect(result).toHaveProperty('click');
    });

    it('all probabilities are between 0 and 1', async () => {
      await setupWithCategory('tech');
      const audienceMix: AudienceMix = { tech: 0.5, casual: 0.5 };

      const result = await predictEngagement('test tweet', audienceMix);

      expect(result.like).toBeGreaterThanOrEqual(0);
      expect(result.like).toBeLessThanOrEqual(1);
      expect(result.repost).toBeGreaterThanOrEqual(0);
      expect(result.repost).toBeLessThanOrEqual(1);
      expect(result.reply).toBeGreaterThanOrEqual(0);
      expect(result.reply).toBeLessThanOrEqual(1);
      expect(result.bookmark).toBeGreaterThanOrEqual(0);
      expect(result.bookmark).toBeLessThanOrEqual(1);
      expect(result.click).toBeGreaterThanOrEqual(0);
      expect(result.click).toBeLessThanOrEqual(1);
    });

    it('tech content has higher bookmark/click rates', async () => {
      await setupWithCategory('tech');
      const techMix: AudienceMix = { tech: 1.0 };
      const techResult = await predictEngagement('tech tweet', techMix);

      await setupWithCategory('entertainment');
      const entertainmentMix: AudienceMix = { casual: 1.0 };
      const entertainmentResult = await predictEngagement('entertainment tweet', entertainmentMix);

      // Tech should have higher bookmark and click rates
      expect(techResult.bookmark).toBeGreaterThan(entertainmentResult.bookmark);
      expect(techResult.click).toBeGreaterThan(entertainmentResult.click);
    });

    it('entertainment content has higher like rates', async () => {
      await setupWithCategory('entertainment');
      const entertainmentMix: AudienceMix = { casual: 1.0 };
      const entertainmentResult = await predictEngagement('entertainment tweet', entertainmentMix);

      await setupWithCategory('business');
      const businessMix: AudienceMix = { investors: 1.0 };
      const businessResult = await predictEngagement('business tweet', businessMix);

      // Entertainment should have higher like rate than business
      expect(entertainmentResult.like).toBeGreaterThan(businessResult.like);
    });

    it('bot audiences reduce all engagement', async () => {
      await setupWithCategory('tech');

      const noBotsResult = await predictEngagement('tech tweet', { tech: 1.0 });
      const withBotsResult = await predictEngagement('tech tweet', { tech: 0.5, bots: 0.5 });

      // Bot presence should reduce engagement
      expect(withBotsResult.like).toBeLessThan(noBotsResult.like);
      expect(withBotsResult.repost).toBeLessThan(noBotsResult.repost);
      expect(withBotsResult.reply).toBeLessThan(noBotsResult.reply);
      expect(withBotsResult.bookmark).toBeLessThan(noBotsResult.bookmark);
      expect(withBotsResult.click).toBeLessThan(noBotsResult.click);
    });

    it('tech audiences boost tech content engagement', async () => {
      await setupWithCategory('tech');

      const techAudienceResult = await predictEngagement('tech tweet', { tech: 1.0 });
      const casualAudienceResult = await predictEngagement('tech tweet', { casual: 1.0 });

      // Tech audience should boost tech content engagement
      expect(techAudienceResult.bookmark).toBeGreaterThan(casualAudienceResult.bookmark);
    });

    it('different categories produce different engagement patterns', async () => {
      await setupWithCategory('tech');
      const techMix: AudienceMix = { tech: 0.5, casual: 0.5 };
      const techResult = await predictEngagement('tech tweet', techMix);

      await setupWithCategory('humor');
      const humorMix: AudienceMix = { casual: 0.5, tech: 0.5 };
      const humorResult = await predictEngagement('humor tweet', humorMix);

      // Results should be different
      const techPattern = [techResult.like, techResult.repost, techResult.bookmark];
      const humorPattern = [humorResult.like, humorResult.repost, humorResult.bookmark];

      // At least one value should differ
      const hasDifference = techPattern.some((v, i) => Math.abs(v - humorPattern[i]) > 0.01);
      expect(hasDifference).toBe(true);
    });

    it('handles empty audience mix gracefully', async () => {
      await setupWithCategory('tech');
      const emptyMix: AudienceMix = {};

      const result = await predictEngagement('tech tweet', emptyMix);

      // Should still return valid probabilities
      expect(result.like).toBeGreaterThanOrEqual(0);
      expect(result.like).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateWeightedScore', () => {
    it('computes correct weighted sum with specified weights', () => {
      const probs: EngagementProbabilities = {
        like: 1.0,
        repost: 1.0,
        reply: 1.0,
        bookmark: 1.0,
        click: 1.0,
      };

      const score = calculateWeightedScore(probs);

      // Weights: like: 1.0, repost: 2.0, reply: 1.5, bookmark: 1.2, click: 0.5
      // Sum: 1.0 + 2.0 + 1.5 + 1.2 + 0.5 = 6.2
      expect(score).toBeCloseTo(6.2, 5);
    });

    it('weights repost highest at 2.0', () => {
      const repostOnly: EngagementProbabilities = {
        like: 0,
        repost: 1.0,
        reply: 0,
        bookmark: 0,
        click: 0,
      };
      const likeOnly: EngagementProbabilities = {
        like: 1.0,
        repost: 0,
        reply: 0,
        bookmark: 0,
        click: 0,
      };

      expect(calculateWeightedScore(repostOnly)).toBe(2.0);
      expect(calculateWeightedScore(likeOnly)).toBe(1.0);
    });

    it('weights reply at 1.5', () => {
      const probs: EngagementProbabilities = {
        like: 0,
        repost: 0,
        reply: 1.0,
        bookmark: 0,
        click: 0,
      };

      expect(calculateWeightedScore(probs)).toBe(1.5);
    });

    it('weights bookmark at 1.2', () => {
      const probs: EngagementProbabilities = {
        like: 0,
        repost: 0,
        reply: 0,
        bookmark: 1.0,
        click: 0,
      };

      expect(calculateWeightedScore(probs)).toBe(1.2);
    });

    it('weights click at 0.5', () => {
      const probs: EngagementProbabilities = {
        like: 0,
        repost: 0,
        reply: 0,
        bookmark: 0,
        click: 1.0,
      };

      expect(calculateWeightedScore(probs)).toBe(0.5);
    });

    it('handles partial probabilities correctly', () => {
      const probs: EngagementProbabilities = {
        like: 0.5,
        repost: 0.3,
        reply: 0.2,
        bookmark: 0.1,
        click: 0.4,
      };

      // 0.5*1.0 + 0.3*2.0 + 0.2*1.5 + 0.1*1.2 + 0.4*0.5
      // = 0.5 + 0.6 + 0.3 + 0.12 + 0.2 = 1.72
      expect(calculateWeightedScore(probs)).toBeCloseTo(1.72, 5);
    });

    it('returns 0 for all-zero probabilities', () => {
      const probs: EngagementProbabilities = {
        like: 0,
        repost: 0,
        reply: 0,
        bookmark: 0,
        click: 0,
      };

      expect(calculateWeightedScore(probs)).toBe(0);
    });
  });
});
