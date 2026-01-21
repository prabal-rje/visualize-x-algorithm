/**
 * Embedding service with caching using MiniLM (all-MiniLM-L6-v2).
 * Uses @xenova/transformers for in-browser ML inference.
 *
 * MiniLM produces 384-dimensional embeddings. We truncate to 128 dimensions
 * to match X's Phoenix model (emb_size = 128).
 */

export type PoolingType = 'none' | 'mean' | 'cls';

export type EmbedderFn = (
  text: string,
  options?: { pooling: PoolingType; normalize: boolean }
) => Promise<{ data: Float32Array | number[] }>;

// X's Phoenix model uses 128-dimensional embeddings
const EMBEDDING_DIM = 128;

// Module state
let embedder: EmbedderFn | null = null;
let initialized = false;
let initializationPromise: Promise<void> | null = null; // Allow concurrent callers to wait
const cache = new Map<string, number[]>();

/**
 * Inject a mock embedder for testing purposes.
 * Pass null to clear and reset to uninitialized state.
 */
export function setEmbedderForTests(fn: EmbedderFn | null): void {
  embedder = fn;
  initialized = fn !== null;
  initializationPromise = null;
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
 * Truncate embedding to target dimension.
 * We take the first N dimensions to match X's Phoenix model size.
 */
function truncate(vec: number[], dim: number): number[] {
  return vec.slice(0, dim);
}

/**
 * Initialize the embedder with the MiniLM model.
 * Uses dynamic import to avoid SSR issues.
 */
export async function initializeEmbedder(
  onProgress?: (progress: number, status: string) => void
): Promise<void> {
  // If already initialized, just report ready
  if (initialized && embedder !== null) {
    onProgress?.(100, 'Ready');
    return;
  }

  // If initialization is in progress, wait for it (React Strict Mode calls useEffect twice)
  if (initializationPromise) {
    console.log('[Embedder] Already initializing, waiting for completion...');
    await initializationPromise;
    onProgress?.(100, 'Ready');
    return;
  }

  // Start initialization
  initializationPromise = (async () => {
    console.log('[Embedder] Starting initialization...');
    onProgress?.(0, 'Loading transformers library...');

    // Dynamic import to avoid SSR issues
    const { pipeline, env } = await import('@xenova/transformers');
    console.log('[Embedder] Transformers library loaded');

    // Disable local model loading - always fetch from Hugging Face
    // This fixes the issue where the library tries to load from /models/ locally
    env.allowLocalModels = false;
    console.log('[Embedder] Configured to fetch models from Hugging Face');

    onProgress?.(10, 'Downloading MiniLM model (22.4 MB)...');

    // Track progress across all files
    // MiniLM model files: tokenizer.json (~1KB), tokenizer_config.json (~1KB),
    // config.json (~1KB), model.onnx (~22MB)
    const fileProgress = new Map<string, { loaded: number; total: number }>();

    console.log('[Embedder] Starting model download...');
    const extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        progress_callback: (progress: {
          progress?: number;
          status?: string;
          file?: string;
          loaded?: number;
          total?: number;
          name?: string;
        }) => {
          console.log('[Embedder] Progress callback:', JSON.stringify(progress));

          const file = progress.file ?? 'unknown';
          const status = progress.status ?? '';

          // Update per-file progress
          if (progress.loaded !== undefined && progress.total !== undefined && progress.total > 0) {
            fileProgress.set(file, { loaded: progress.loaded, total: progress.total });
          }

          // Calculate aggregate progress across all files
          let totalLoaded = 0;
          let totalSize = 0;
          for (const [, fp] of fileProgress) {
            totalLoaded += fp.loaded;
            totalSize += fp.total;
          }

          // Calculate percentage (10-90% range)
          const percent = totalSize > 0 ? (totalLoaded / totalSize) : 0;
          const scaledProgress = 10 + percent * 80;

          // Create status message
          let statusMsg = 'Loading model...';
          if (status === 'initiate') {
            statusMsg = `Initializing ${file}...`;
          } else if (status === 'download' || status === 'progress') {
            const mbLoaded = (totalLoaded / (1024 * 1024)).toFixed(1);
            const mbTotal = (totalSize / (1024 * 1024)).toFixed(1);
            statusMsg = `Downloading: ${mbLoaded} / ${mbTotal} MB`;
          } else if (status === 'done') {
            statusMsg = `Loaded ${file}`;
          }

          onProgress?.(scaledProgress, statusMsg);
        },
      }
    );

    console.log('[Embedder] Model loaded, initializing...');
    onProgress?.(95, 'Initializing embedder...');

    // Wrap the pipeline as our embedder function
    embedder = async (
      text: string,
      options?: { pooling: PoolingType; normalize: boolean }
    ) => {
      const result = await extractor(text, options);
      return { data: result.data as Float32Array };
    };

    initialized = true;
    console.log('[Embedder] Ready!');
    onProgress?.(100, 'Ready');
  })();

  await initializationPromise;
}

/**
 * Get embedding for a single text (cached).
 * Returns 128-dimensional vector (truncated from MiniLM's 384-dim
 * to match X's Phoenix model).
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

  // Convert to array, truncate to 128-dim, then normalize
  const fullEmbedding = Array.from(result.data);
  const truncated = truncate(fullEmbedding, EMBEDDING_DIM);
  const embedding = normalize(truncated);

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
