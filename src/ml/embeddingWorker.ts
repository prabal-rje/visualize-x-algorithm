export type PoolingType = 'none' | 'mean' | 'cls';

type EmbedderFn = (
  text: string,
  options?: { pooling: PoolingType; normalize: boolean }
) => Promise<{ data: Float32Array | number[] }>;

type WorkerRequest =
  | { id: string; type: 'init' }
  | {
      id: string;
      type: 'embed';
      text: string;
      options: { pooling: PoolingType; normalize: boolean };
    };

type WorkerResponse =
  | { id: string; type: 'init' }
  | { id: string; type: 'embed'; data: number[] }
  | { id: string; type: 'error'; error: string }
  | { type: 'progress'; progress: number; status: string; id?: string };

const EMBEDDING_DIM = 128;

let embedder: EmbedderFn | null = null;
let initializationPromise: Promise<void> | null = null;

async function initializeEmbedder(requestId?: string): Promise<void> {
  if (embedder) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const { pipeline, env } = await import('@xenova/transformers');
    env.allowLocalModels = false;

    const fileProgress = new Map<string, { loaded: number; total: number }>();

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
        }) => {
          const file = progress.file ?? 'unknown';
          const status = progress.status ?? '';

          if (progress.loaded !== undefined && progress.total !== undefined && progress.total > 0) {
            fileProgress.set(file, { loaded: progress.loaded, total: progress.total });
          }

          let totalLoaded = 0;
          let totalSize = 0;
          for (const [, fp] of fileProgress) {
            totalLoaded += fp.loaded;
            totalSize += fp.total;
          }

          const percent = totalSize > 0 ? totalLoaded / totalSize : 0;
          const scaledProgress = 10 + percent * 80;

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

          const message: WorkerResponse = {
            type: 'progress',
            progress: scaledProgress,
            status: statusMsg,
            id: requestId
          };
          self.postMessage(message);
        }
      }
    );

    embedder = async (
      text: string,
      options?: { pooling: PoolingType; normalize: boolean }
    ) => {
      const result = await extractor(text, options);
      return { data: result.data as Float32Array };
    };
  })();

  return initializationPromise;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;

  if (message.type === 'init') {
    try {
      await initializeEmbedder(message.id);
      const response: WorkerResponse = { id: message.id, type: 'init' };
      self.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        id: message.id,
        type: 'error',
        error: error instanceof Error ? error.message : 'Failed to initialize embedder'
      };
      self.postMessage(response);
    }
    return;
  }

  if (message.type === 'embed') {
    try {
      await initializeEmbedder();
      if (!embedder) {
        throw new Error('Embedder not ready');
      }
      const result = await embedder(message.text, message.options);
      const embedding = Array.from(result.data).slice(0, EMBEDDING_DIM);
      const response: WorkerResponse = {
        id: message.id,
        type: 'embed',
        data: embedding
      };
      self.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        id: message.id,
        type: 'error',
        error: error instanceof Error ? error.message : 'Failed to compute embedding'
      };
      self.postMessage(response);
    }
  }
};
