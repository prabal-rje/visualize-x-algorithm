/**
 * Embedding service with caching using MiniLM (all-MiniLM-L6-v2).
 * Uses @xenova/transformers for in-browser ML inference in a Web Worker.
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

type WorkerRequest =
  | { id: string; type: 'init' }
  | {
      id: string;
      type: 'embed';
      text: string;
      options: { pooling: PoolingType; normalize: boolean };
    };

// Distributive Omit for union types (standard Omit doesn't distribute over unions)
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

type WorkerResponse =
  | { id: string; type: 'init' }
  | { id: string; type: 'embed'; data: number[] }
  | { id: string; type: 'error'; error: string }
  | { type: 'progress'; progress: number; status: string; id?: string };

type PendingRequest = {
  resolve: (value: WorkerResponse) => void;
  reject: (error: Error) => void;
};

// Module state
let embedderOverride: EmbedderFn | null = null;
let initialized = false;
let initializationPromise: Promise<void> | null = null; // Allow concurrent callers to wait
let worker: Worker | null = null;
let requestCounter = 0;
const cache = new Map<string, number[]>();
const pendingRequests = new Map<string, PendingRequest>();
let progressListeners: Array<(progress: number, status: string) => void> = [];

function handleWorkerMessage(event: MessageEvent<WorkerResponse>): void {
  const message = event.data;
  if (message.type === 'progress') {
    progressListeners.forEach((listener) => listener(message.progress, message.status));
    return;
  }

  if (!('id' in message)) {
    return;
  }

  const pending = pendingRequests.get(message.id);
  if (!pending) {
    return;
  }

  if (message.type === 'error') {
    pending.reject(new Error(message.error));
  } else {
    pending.resolve(message);
  }
  pendingRequests.delete(message.id);
}

function ensureWorker(): Worker {
  if (worker) {
    return worker;
  }

  worker = new Worker(new URL('./embeddingWorker.ts', import.meta.url), {
    type: 'module'
  });
  worker.onmessage = handleWorkerMessage;
  worker.onerror = (event) => {
    const error = new Error(event.message);
    pendingRequests.forEach(({ reject }) => reject(error));
    pendingRequests.clear();
  };

  return worker;
}

function sendWorkerRequest<T extends WorkerResponse>(
  message: DistributiveOmit<WorkerRequest, 'id'>
): Promise<T> {
  const workerInstance = ensureWorker();
  const id = `req-${requestCounter++}`;

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, {
      resolve: resolve as PendingRequest['resolve'],
      reject
    });
    workerInstance.postMessage({ ...message, id });
  });
}

/**
 * Inject a mock embedder for testing purposes.
 * Pass null to clear and reset to uninitialized state.
 */
export function setEmbedderForTests(fn: EmbedderFn | null): void {
  embedderOverride = fn;
  initialized = fn !== null;
  initializationPromise = null;
  progressListeners = [];
  pendingRequests.clear();
  if (worker) {
    worker.terminate();
    worker = null;
  }
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
 */
export async function initializeEmbedder(
  onProgress?: (progress: number, status: string) => void
): Promise<void> {
  if (embedderOverride) {
    initialized = true;
    onProgress?.(100, 'Ready');
    return;
  }

  // If already initialized, just report ready
  if (initialized) {
    onProgress?.(100, 'Ready');
    return;
  }

  // If initialization is in progress, wait for it (React Strict Mode calls useEffect twice)
  if (initializationPromise) {
    if (onProgress) {
      progressListeners.push(onProgress);
    }
    await initializationPromise;
    onProgress?.(100, 'Ready');
    return;
  }

  if (typeof Worker === 'undefined') {
    embedderOverride = async () => ({
      data: new Float32Array(EMBEDDING_DIM).fill(0)
    });
    initialized = true;
    onProgress?.(100, 'Ready');
    return;
  }

  if (onProgress) {
    progressListeners.push(onProgress);
  }

  initializationPromise = (async () => {
    try {
      await sendWorkerRequest({ type: 'init' });
      initialized = true;
      progressListeners.forEach((listener) => listener(100, 'Ready'));
    } catch (error) {
      initialized = false;
      throw error;
    } finally {
      progressListeners = [];
      initializationPromise = null;
    }
  })();

  await initializationPromise;
}

/**
 * Get embedding for a single text (cached).
 * Returns 128-dimensional vector (truncated from MiniLM's 384-dim
 * to match X's Phoenix model).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (!initialized && !embedderOverride) {
    throw new Error('Embedder not initialized');
  }

  // Check cache
  const cached = cache.get(text);
  if (cached !== undefined) {
    return cached;
  }

  // Compute embedding
  let result: { data: Float32Array | number[] };
  if (embedderOverride) {
    result = await embedderOverride(text, { pooling: 'mean', normalize: false });
  } else {
    const response = await sendWorkerRequest<WorkerResponse>({
      type: 'embed',
      text,
      options: { pooling: 'mean', normalize: false }
    });
    if (response.type !== 'embed') {
      throw new Error('Unexpected worker response');
    }
    result = { data: response.data };
  }

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
