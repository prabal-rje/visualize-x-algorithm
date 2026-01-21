import { describe, it, expect, beforeEach } from 'vitest';
import {
  setEmbedderForTests,
  clearCache,
  initializeEmbedder,
} from './embeddings';
import { generateTweetPool, type TweetCandidate } from './tweetPool';

describe('tweetPool', () => {
  beforeEach(() => {
    setEmbedderForTests(null);
    clearCache();
  });

  describe('generateTweetPool', () => {
    it('generates the requested count of tweets', async () => {
      // Mock embedder that returns 128-dimensional embeddings
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(10);

      expect(tweets).toHaveLength(10);
    });

    it('each tweet has all required fields', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(5);

      for (const tweet of tweets) {
        expect(tweet).toHaveProperty('id');
        expect(tweet).toHaveProperty('text');
        expect(tweet).toHaveProperty('author');
        expect(tweet).toHaveProperty('embedding');
        expect(tweet).toHaveProperty('category');
        expect(tweet).toHaveProperty('timestamp');

        expect(typeof tweet.id).toBe('string');
        expect(typeof tweet.text).toBe('string');
        expect(typeof tweet.author).toBe('string');
        expect(Array.isArray(tweet.embedding)).toBe(true);
        expect(typeof tweet.category).toBe('string');
        expect(typeof tweet.timestamp).toBe('number');
      }
    });

    it('embeddings have 128 dimensions', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(5);

      for (const tweet of tweets) {
        expect(tweet.embedding).toHaveLength(128);
      }
    });

    it('categories have variety (at least 4 different categories in 100 tweets)', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(100);

      const uniqueCategories = new Set(tweets.map((t) => t.category));
      expect(uniqueCategories.size).toBeGreaterThanOrEqual(4);
    });

    it('tweets have unique ids', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(50);

      const uniqueIds = new Set(tweets.map((t) => t.id));
      expect(uniqueIds.size).toBe(50);
    });

    it('timestamps are within last 24 hours', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const now = Date.now();
      const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

      const tweets = await generateTweetPool(20);

      for (const tweet of tweets) {
        expect(tweet.timestamp).toBeGreaterThanOrEqual(twentyFourHoursAgo);
        expect(tweet.timestamp).toBeLessThanOrEqual(now);
      }
    });

    it('authors come from predefined list', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(50);

      // All authors should be non-empty strings
      for (const tweet of tweets) {
        expect(tweet.author.length).toBeGreaterThan(0);
        expect(tweet.author).toMatch(/^@/); // Authors should start with @
      }
    });

    it('tweet texts are non-empty', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(20);

      for (const tweet of tweets) {
        expect(tweet.text.length).toBeGreaterThan(0);
      }
    });

    it('generates zero tweets when count is 0', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array(128).fill(0.01),
      });

      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const tweets = await generateTweetPool(0);

      expect(tweets).toHaveLength(0);
    });
  });
});
