import { describe, expect, it, beforeEach } from 'vitest';
import {
  setEmbedderForTests,
  clearCache,
  isInitialized,
  initializeEmbedder,
  getEmbedding,
  getEmbeddings,
} from './embeddings';
import { cosinePreview } from './similarity';

describe('embeddings', () => {
  beforeEach(() => {
    setEmbedderForTests(null);
    clearCache();
  });

  describe('isInitialized', () => {
    it('returns false before initialization', () => {
      expect(isInitialized()).toBe(false);
    });

    it('returns true after initialization', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array([1, 0, 0]),
      });
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();
      expect(isInitialized()).toBe(true);
    });
  });

  describe('getEmbedding', () => {
    it('throws if called before initialization', async () => {
      await expect(getEmbedding('hello')).rejects.toThrow(
        'Embedder not initialized'
      );
    });

    it('returns cached embedding on repeat call (embedder called once)', async () => {
      let callCount = 0;
      const mockEmbedder = async () => {
        callCount++;
        return { data: new Float32Array([3, 4, 0]) };
      };
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const first = await getEmbedding('test text');
      const second = await getEmbedding('test text');

      expect(first).toEqual(second);
      expect(callCount).toBe(1);
    });

    it('normalizes embedding vectors to unit magnitude', async () => {
      // 3-4-0 triangle: magnitude = 5, normalized = [0.6, 0.8, 0]
      const mockEmbedder = async () => ({
        data: new Float32Array([3, 4, 0]),
      });
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const embedding = await getEmbedding('normalize me');

      // Check unit magnitude
      const magnitude = Math.sqrt(
        embedding.reduce((sum, v) => sum + v * v, 0)
      );
      expect(magnitude).toBeCloseTo(1.0, 5);

      // Check normalized values
      expect(embedding[0]).toBeCloseTo(0.6, 5);
      expect(embedding[1]).toBeCloseTo(0.8, 5);
      expect(embedding[2]).toBeCloseTo(0, 5);
    });
  });

  describe('getEmbeddings', () => {
    it('returns multiple embeddings', async () => {
      const mockEmbedder = async (text: string) => ({
        data: new Float32Array(
          text === 'hello' ? [1, 0, 0] : [0, 1, 0]
        ),
      });
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      const embeddings = await getEmbeddings(['hello', 'world']);

      expect(embeddings).toHaveLength(2);
      expect(embeddings[0][0]).toBeCloseTo(1, 5);
      expect(embeddings[1][1]).toBeCloseTo(1, 5);
    });

    it('caches individual embeddings from batch call', async () => {
      let callCount = 0;
      const mockEmbedder = async () => {
        callCount++;
        return { data: new Float32Array([1, 0, 0]) };
      };
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      await getEmbeddings(['text1', 'text2']);
      await getEmbedding('text1');

      // 2 calls for batch, 0 for cached single
      expect(callCount).toBe(2);
    });
  });

  describe('initializeEmbedder', () => {
    it('calls onProgress callback during initialization', async () => {
      const mockEmbedder = async () => ({
        data: new Float32Array([1, 0, 0]),
      });
      setEmbedderForTests(mockEmbedder);

      const progressCalls: Array<{ progress: number; status: string }> = [];
      await initializeEmbedder((progress, status) => {
        progressCalls.push({ progress, status });
      });

      // Should have at least one progress call
      expect(progressCalls.length).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('clears cached embeddings', async () => {
      let callCount = 0;
      const mockEmbedder = async () => {
        callCount++;
        return { data: new Float32Array([1, 0, 0]) };
      };
      setEmbedderForTests(mockEmbedder);
      await initializeEmbedder();

      await getEmbedding('cached text');
      clearCache();
      await getEmbedding('cached text');

      expect(callCount).toBe(2);
    });
  });

  describe('cosinePreview', () => {
    it('computes similarity using 30 dims for preview', () => {
      const embedding = Array(128).fill(0.1);
      const similarity = cosinePreview(embedding, embedding);
      expect(similarity).toBeGreaterThan(0.9);
    });
  });
});
