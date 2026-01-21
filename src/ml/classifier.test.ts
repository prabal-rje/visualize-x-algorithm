import { describe, it, expect, beforeEach } from 'vitest';
import {
  setEmbedderForTests,
  clearCache,
  initializeEmbedder,
} from './embeddings';
import {
  CONTENT_CATEGORIES,
  precomputeConceptEmbeddings,
  classifyContent,
  type ClassificationResult,
} from './classifier';

describe('classifier', () => {
  beforeEach(() => {
    setEmbedderForTests(null);
    clearCache();
  });

  describe('CONTENT_CATEGORIES', () => {
    it('exports all 8 content categories', () => {
      expect(CONTENT_CATEGORIES).toHaveLength(8);
    });

    it('contains expected category ids', () => {
      const ids = CONTENT_CATEGORIES.map((c) => c.id);
      expect(ids).toContain('tech');
      expect(ids).toContain('news');
      expect(ids).toContain('entertainment');
      expect(ids).toContain('sports');
      expect(ids).toContain('business');
      expect(ids).toContain('science');
      expect(ids).toContain('lifestyle');
      expect(ids).toContain('humor');
    });

    it('each category has id, label, and concept', () => {
      for (const category of CONTENT_CATEGORIES) {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('concept');
        expect(typeof category.id).toBe('string');
        expect(typeof category.label).toBe('string');
        expect(typeof category.concept).toBe('string');
      }
    });
  });

  describe('classifyContent', () => {
    it('returns all categories with similarity scores', async () => {
      // Mock embedder that returns different embeddings based on text
      const mockEmbedder = async (text: string) => {
        // Return tech-like embedding for tech concept, different for others
        if (text.includes('technology')) {
          return { data: new Float32Array([1, 0, 0, 0]) };
        }
        if (text.includes('news')) {
          return { data: new Float32Array([0, 1, 0, 0]) };
        }
        if (text.includes('movies')) {
          return { data: new Float32Array([0, 0, 1, 0]) };
        }
        if (text.includes('sports')) {
          return { data: new Float32Array([0, 0, 0, 1]) };
        }
        if (text.includes('business')) {
          return { data: new Float32Array([0.5, 0.5, 0, 0]) };
        }
        if (text.includes('science')) {
          return { data: new Float32Array([0.7, 0, 0.3, 0]) };
        }
        if (text.includes('lifestyle')) {
          return { data: new Float32Array([0, 0.3, 0.7, 0]) };
        }
        if (text.includes('funny')) {
          return { data: new Float32Array([0.2, 0.2, 0.3, 0.3]) };
        }
        // Input text - make it tech-like
        return { data: new Float32Array([0.9, 0.1, 0, 0]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      const result = await classifyContent('test input');

      expect(result.categories).toHaveLength(8);
      for (const category of result.categories) {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('similarity');
        expect(typeof category.similarity).toBe('number');
      }
    });

    it('categories are sorted by similarity (highest first)', async () => {
      // Mock embedder with clear distinctions
      const mockEmbedder = async (text: string) => {
        if (text.includes('technology')) {
          return { data: new Float32Array([1, 0, 0]) };
        }
        if (text.includes('news')) {
          return { data: new Float32Array([0, 1, 0]) };
        }
        if (text.includes('movies')) {
          return { data: new Float32Array([0, 0, 1]) };
        }
        // Return same embedding for everything else
        return { data: new Float32Array([0.33, 0.33, 0.33]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      const result = await classifyContent('test');

      // Verify sorted descending
      for (let i = 0; i < result.categories.length - 1; i++) {
        expect(result.categories[i].similarity).toBeGreaterThanOrEqual(
          result.categories[i + 1].similarity
        );
      }
    });

    it('topCategory is the highest similarity match', async () => {
      // Make input strongly match tech category
      const mockEmbedder = async (text: string) => {
        if (text.includes('technology')) {
          return { data: new Float32Array([1, 0, 0]) };
        }
        if (text.includes('news')) {
          return { data: new Float32Array([0, 1, 0]) };
        }
        // All others get orthogonal embeddings
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      // Input should match tech strongly
      const techMockEmbedder = async (text: string) => {
        if (text.includes('technology')) {
          return { data: new Float32Array([1, 0, 0]) };
        }
        if (text.includes('news')) {
          return { data: new Float32Array([0, 1, 0]) };
        }
        // Input text - matches tech perfectly
        if (text === 'I love coding and software') {
          return { data: new Float32Array([1, 0, 0]) };
        }
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(techMockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      const result = await classifyContent('I love coding and software');

      expect(result.topCategory).toEqual(result.categories[0]);
      expect(result.topCategory.id).toBe('tech');
      expect(result.topCategory.similarity).toBeCloseTo(1, 5);
    });

    it('correctly identifies news content', async () => {
      const mockEmbedder = async (text: string) => {
        if (text.includes('news') || text.includes('breaking')) {
          return { data: new Float32Array([0, 1, 0]) };
        }
        if (text.includes('technology')) {
          return { data: new Float32Array([1, 0, 0]) };
        }
        return { data: new Float32Array([0.1, 0.1, 0.8]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      const result = await classifyContent('breaking story just in');

      expect(result.topCategory.id).toBe('news');
    });
  });

  describe('precomputeConceptEmbeddings', () => {
    it('precomputes embeddings for all categories', async () => {
      let callCount = 0;
      const mockEmbedder = async () => {
        callCount++;
        return { data: new Float32Array([1, 0, 0]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      // Should have called embedder once per category
      expect(callCount).toBe(8);
    });

    it('allows classifyContent to work after precomputation', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array([1, 0, 0]),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      await precomputeConceptEmbeddings();

      // Should not throw
      const result = await classifyContent('test');
      expect(result).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.topCategory).toBeDefined();
    });
  });
});
