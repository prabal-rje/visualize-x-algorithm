/**
 * Embedding service with caching for MiniLM embeddings.
 * Uses @xenova/transformers for in-browser ML inference.
 */

export type PoolingType = 'none' | 'mean' | 'cls';

export type EmbedderFn = (
  text: string,
  options?: { pooling: PoolingType; normalize: boolean }
) => Promise<{ data: Float32Array | number[] }>;

// Module state
let embedder: EmbedderFn | null = null;
let initialized = false;
const cache = new Map<string, number[]>();

/**
 * Inject a mock embedder for testing purposes.
 * Pass null to clear and reset to uninitialized state.
 */
export function setEmbedderForTests(fn: EmbedderFn | null): void {
  embedder = fn;
  initialized = fn !== null;
}

/**
 * Clear the embedding cache.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Check if the embedder has been initialized.
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Normalize a vector to unit length.
 */
function normalize(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return vec;
  return vec.map((v) => v / magnitude);
}

/**
 * Initialize the embedder with the MiniLM model.
 * Uses dynamic import to avoid SSR issues.
 */
export async function initializeEmbedder(
  onProgress?: (progress: number, status: string) => void
): Promise<void> {
  // If using test embedder, just report progress and return
  if (embedder !== null) {
    onProgress?.(100, 'Ready (test mode)');
    return;
  }

  onProgress?.(0, 'Loading transformers library...');

  // Dynamic import to avoid SSR issues
  const { pipeline } = await import('@xenova/transformers');

  onProgress?.(10, 'Downloading model...');

  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
    {
      progress_callback: (progress: { progress?: number; status?: string }) => {
        if (progress.progress !== undefined) {
          // Scale progress from 10-90%
          const scaledProgress = 10 + progress.progress * 0.8;
          onProgress?.(scaledProgress, progress.status ?? 'Loading model...');
        }
      },
    }
  );

  onProgress?.(95, 'Initializing...');

  // Wrap the pipeline as our embedder function
  embedder = async (
    text: string,
    options?: { pooling: PoolingType; normalize: boolean }
  ) => {
    const result = await extractor(text, options);
    return { data: result.data as Float32Array };
  };

  initialized = true;
  onProgress?.(100, 'Ready');
}

/**
 * Get embedding for a single text (cached).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (!initialized || embedder === null) {
    throw new Error('Embedder not initialized');
  }

  // Check cache
  const cached = cache.get(text);
  if (cached !== undefined) {
    return cached;
  }

  // Compute embedding
  const result = await embedder(text, { pooling: 'mean', normalize: false });

  // Convert to array and normalize
  const embedding = normalize(Array.from(result.data));

  // Cache and return
  cache.set(text, embedding);
  return embedding;
}

/**
 * Get embeddings for multiple texts (each individually cached).
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((text) => getEmbedding(text)));
}
