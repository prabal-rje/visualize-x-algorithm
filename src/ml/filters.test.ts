import { describe, it, expect, beforeEach } from 'vitest';
import {
  setEmbedderForTests,
  clearCache,
  initializeEmbedder,
} from './embeddings';
import { MutedKeywordFilter, type FilterResult } from './filters';

describe('MutedKeywordFilter', () => {
  beforeEach(() => {
    setEmbedderForTests(null);
    clearCache();
  });

  describe('exact keyword matching', () => {
    it('filters exact keyword matches', async () => {
      const filter = new MutedKeywordFilter(['spam', 'blocked']);

      const result = await filter.shouldFilter('This tweet contains spam content');

      expect(result).toBe(true);
    });

    it('is case-insensitive', async () => {
      const filter = new MutedKeywordFilter(['SPAM', 'Blocked']);

      expect(await filter.shouldFilter('This contains spam')).toBe(true);
      expect(await filter.shouldFilter('This contains SPAM')).toBe(true);
      expect(await filter.shouldFilter('This contains Spam')).toBe(true);
      expect(await filter.shouldFilter('blocked user')).toBe(true);
      expect(await filter.shouldFilter('BLOCKED USER')).toBe(true);
    });

    it('does not filter unrelated content', async () => {
      const filter = new MutedKeywordFilter(['spam', 'blocked']);

      const result = await filter.shouldFilter('This is a normal tweet about coding');

      expect(result).toBe(false);
    });

    it('matches keywords as whole words', async () => {
      const filter = new MutedKeywordFilter(['spam']);

      // Should match 'spam' as a word
      expect(await filter.shouldFilter('This is spam')).toBe(true);
      expect(await filter.shouldFilter('spam alert')).toBe(true);
      expect(await filter.shouldFilter('avoid spam please')).toBe(true);
    });

    it('handles empty keyword list', async () => {
      const filter = new MutedKeywordFilter([]);

      const result = await filter.shouldFilter('any content here');

      expect(result).toBe(false);
    });
  });

  describe('checkWithReason', () => {
    it('returns filter reason for exact match', async () => {
      const filter = new MutedKeywordFilter(['spam', 'blocked']);

      const result = await filter.checkWithReason('This contains spam');

      expect(result.filtered).toBe(true);
      expect(result.reason).toBe('Matched muted keyword: "spam"');
    });

    it('returns null reason when not filtered', async () => {
      const filter = new MutedKeywordFilter(['spam']);

      const result = await filter.checkWithReason('Normal tweet content');

      expect(result.filtered).toBe(false);
      expect(result.reason).toBeNull();
    });

    it('returns first matched keyword in reason', async () => {
      const filter = new MutedKeywordFilter(['first', 'second', 'third']);

      const result = await filter.checkWithReason('text with second keyword');

      expect(result.filtered).toBe(true);
      expect(result.reason).toBe('Matched muted keyword: "second"');
    });
  });

  describe('semantic filtering', () => {
    it('filters semantically similar content when embedder is initialized', async () => {
      // Mock embedder that returns similar embeddings for related concepts
      const mockEmbedder = async (text: string) => {
        // "hate speech" and "hateful content" should be similar
        if (text.toLowerCase().includes('hate')) {
          return { data: new Float32Array([1, 0, 0]) };
        }
        // "violent threats" and "threatening violence" should be similar
        if (text.toLowerCase().includes('violen') || text.toLowerCase().includes('threat')) {
          return { data: new Float32Array([0, 1, 0]) };
        }
        // Unrelated content
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['hate speech'], { semanticThreshold: 0.85 });
      await filter.initializeSemanticFiltering();

      // Should filter semantically similar content
      const result = await filter.shouldFilter('This contains hateful content');
      expect(result).toBe(true);
    });

    it('uses default threshold of 0.85', async () => {
      const mockEmbedder = async (text: string) => {
        // Create vectors with controlled similarity
        if (text === 'spam') {
          return { data: new Float32Array([1, 0, 0]) };
        }
        // This vector has ~0.9 similarity to [1,0,0]
        if (text.includes('similar')) {
          return { data: new Float32Array([0.9, 0.436, 0]) };
        }
        // This vector has ~0.7 similarity to [1,0,0] - below threshold
        if (text.includes('somewhat')) {
          return { data: new Float32Array([0.7, 0.714, 0]) };
        }
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['spam']);
      await filter.initializeSemanticFiltering();

      // High similarity should filter
      expect(await filter.shouldFilter('similar content')).toBe(true);
      // Low similarity should not filter
      expect(await filter.shouldFilter('somewhat related')).toBe(false);
    });

    it('respects custom semantic threshold', async () => {
      const mockEmbedder = async (text: string) => {
        if (text === 'keyword') {
          return { data: new Float32Array([1, 0, 0]) };
        }
        // This has ~0.8 similarity
        if (text.includes('test')) {
          return { data: new Float32Array([0.8, 0.6, 0]) };
        }
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      // With threshold 0.7, should filter
      const filterLow = new MutedKeywordFilter(['keyword'], { semanticThreshold: 0.7 });
      await filterLow.initializeSemanticFiltering();
      expect(await filterLow.shouldFilter('test content')).toBe(true);

      // With threshold 0.9, should not filter
      const filterHigh = new MutedKeywordFilter(['keyword'], { semanticThreshold: 0.9 });
      await filterHigh.initializeSemanticFiltering();
      expect(await filterHigh.shouldFilter('test content')).toBe(false);
    });

    it('checkWithReason returns semantic match reason', async () => {
      const mockEmbedder = async (text: string) => {
        if (text === 'hate speech') {
          return { data: new Float32Array([1, 0, 0]) };
        }
        if (text.includes('hateful')) {
          return { data: new Float32Array([0.95, 0.312, 0]) }; // ~0.95 similarity
        }
        return { data: new Float32Array([0, 0, 1]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['hate speech']);
      await filter.initializeSemanticFiltering();

      const result = await filter.checkWithReason('hateful content here');

      expect(result.filtered).toBe(true);
      expect(result.reason).toContain('Semantically similar to');
      expect(result.reason).toContain('hate speech');
    });

    it('works without semantic filtering when embedder not initialized', async () => {
      // Don't initialize embedder
      const filter = new MutedKeywordFilter(['spam']);

      // Exact match should still work
      expect(await filter.shouldFilter('This is spam')).toBe(true);
      // But semantic similarity won't work
      expect(await filter.shouldFilter('unwanted messages')).toBe(false);
    });

    it('exact match takes precedence over semantic match', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array([1, 0, 0]),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['spam']);
      await filter.initializeSemanticFiltering();

      const result = await filter.checkWithReason('This is spam');

      expect(result.filtered).toBe(true);
      expect(result.reason).toBe('Matched muted keyword: "spam"');
    });
  });

  describe('initializeSemanticFiltering', () => {
    it('pre-computes embeddings for all keywords', async () => {
      let callCount = 0;
      const mockEmbedder = async () => {
        callCount++;
        return { data: new Float32Array([1, 0, 0]) };
      };

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['keyword1', 'keyword2', 'keyword3']);
      await filter.initializeSemanticFiltering();

      expect(callCount).toBe(3);
    });

    it('can be called multiple times safely', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array([1, 0, 0]),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const filter = new MutedKeywordFilter(['spam']);

      // Should not throw when called multiple times
      await filter.initializeSemanticFiltering();
      await filter.initializeSemanticFiltering();

      expect(await filter.shouldFilter('spam test')).toBe(true);
    });
  });
});
