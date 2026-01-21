# ML Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement real MiniLM-based embedding pipeline with BIOS loading UI, content classification, engagement prediction, and simulated tweet pool generation.

**Architecture:** Use `@xenova/transformers` for client-side MiniLM inference. Embeddings are cached in memory with pre-computed concept vectors. Classification uses cosine similarity to concept embeddings. Engagement prediction uses embedding similarity + heuristics. A pool of simulated tweets is generated with pre-computed embeddings for the visualization.

**Tech Stack:** React 18, TypeScript, @xenova/transformers (MiniLM), Zustand, Vitest.

**Notes:** Follow TDD. Model is ~22MB, downloaded on first load. Use progress callback for BIOS-style loading UI.

---

### Task 1: Create ML store for loading state

**Files:**
- Create: `src/stores/ml.ts`
- Test: `src/stores/ml.test.ts`

**Step 1: Write the failing test**

```ts
// src/stores/ml.test.ts
import { describe, expect, it, beforeEach } from 'vitest';
import { useMLStore } from './ml';

describe('ml store', () => {
  beforeEach(() => {
    useMLStore.setState({
      status: 'idle',
      progress: 0,
      currentStep: null,
      error: null
    });
  });

  it('starts in idle state', () => {
    const { status } = useMLStore.getState();
    expect(status).toBe('idle');
  });

  it('transitions to loading with progress', () => {
    const { setLoading, setProgress } = useMLStore.getState();
    setLoading('Downloading model');
    expect(useMLStore.getState().status).toBe('loading');
    expect(useMLStore.getState().currentStep).toBe('Downloading model');
    setProgress(0.5);
    expect(useMLStore.getState().progress).toBe(0.5);
  });

  it('transitions to ready on completion', () => {
    const { setReady } = useMLStore.getState();
    setReady();
    expect(useMLStore.getState().status).toBe('ready');
    expect(useMLStore.getState().progress).toBe(1);
  });

  it('handles errors', () => {
    const { setError } = useMLStore.getState();
    setError('Network error');
    expect(useMLStore.getState().status).toBe('error');
    expect(useMLStore.getState().error).toBe('Network error');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/stores/ml.test.ts`
Expected: FAIL with "Cannot find module './ml'"

**Step 3: Write implementation**

```ts
// src/stores/ml.ts
import { create } from 'zustand';

export type MLStatus = 'idle' | 'loading' | 'ready' | 'error';

type MLState = {
  status: MLStatus;
  progress: number;
  currentStep: string | null;
  error: string | null;
  setLoading: (step: string) => void;
  setProgress: (value: number) => void;
  setReady: () => void;
  setError: (message: string) => void;
  reset: () => void;
};

export const useMLStore = create<MLState>((set) => ({
  status: 'idle',
  progress: 0,
  currentStep: null,
  error: null,
  setLoading: (step) => set({ status: 'loading', currentStep: step, error: null }),
  setProgress: (value) => set({ progress: Math.min(1, Math.max(0, value)) }),
  setReady: () => set({ status: 'ready', progress: 1, currentStep: null }),
  setError: (message) => set({ status: 'error', error: message }),
  reset: () => set({ status: 'idle', progress: 0, currentStep: null, error: null })
}));
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/stores/ml.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/stores/ml.ts src/stores/ml.test.ts
git commit -m "feat: add ML store for loading state"
```

---

### Task 2: Create embedding service with caching

**Files:**
- Create: `src/ml/embeddings.ts`
- Test: `src/ml/embeddings.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/embeddings.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  getEmbedding,
  initializeEmbedder,
  setEmbedderForTests,
  clearCache,
  isInitialized
} from './embeddings';

describe('embeddings', () => {
  beforeEach(() => {
    clearCache();
  });

  it('returns cached embedding on repeat call', async () => {
    const mockEmbedder = vi.fn().mockResolvedValue({ data: new Float32Array([0.1, 0.2, 0.3]) });
    setEmbedderForTests(mockEmbedder);

    const first = await getEmbedding('hello');
    const second = await getEmbedding('hello');

    expect(first).toEqual(second);
    expect(mockEmbedder).toHaveBeenCalledTimes(1);
  });

  it('normalizes embedding vectors', async () => {
    const mockEmbedder = vi.fn().mockResolvedValue({ data: new Float32Array([3, 4]) });
    setEmbedderForTests(mockEmbedder);

    const result = await getEmbedding('test');
    const magnitude = Math.sqrt(result.reduce((sum, v) => sum + v * v, 0));
    expect(magnitude).toBeCloseTo(1, 5);
  });

  it('reports initialization status', () => {
    expect(isInitialized()).toBe(false);
    setEmbedderForTests(vi.fn());
    expect(isInitialized()).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/embeddings.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/embeddings.ts
type EmbedderFn = (text: string, options?: { pooling: string; normalize: boolean }) => Promise<{ data: Float32Array | number[] }>;

let embedder: EmbedderFn | null = null;
const cache = new Map<string, number[]>();

export function setEmbedderForTests(fn: EmbedderFn | null): void {
  embedder = fn;
}

export function clearCache(): void {
  cache.clear();
}

export function isInitialized(): boolean {
  return embedder !== null;
}

function normalize(vec: number[]): number[] {
  const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (mag === 0) return vec;
  return vec.map((v) => v / mag);
}

export async function initializeEmbedder(
  onProgress?: (progress: number, status: string) => void
): Promise<void> {
  if (embedder) return;

  onProgress?.(0, 'Loading semantic processor...');

  const { pipeline } = await import('@xenova/transformers');

  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    progress_callback: (data: { progress?: number; status?: string }) => {
      if (data.progress !== undefined) {
        onProgress?.(data.progress / 100, data.status ?? 'Loading...');
      }
    }
  }) as EmbedderFn;

  onProgress?.(1, 'Ready');
}

export async function getEmbedding(text: string): Promise<number[]> {
  const cached = cache.get(text);
  if (cached) return cached;

  if (!embedder) {
    throw new Error('Embedder not initialized. Call initializeEmbedder() first.');
  }

  const result = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = normalize(Array.from(result.data));
  cache.set(text, embedding);
  return embedding;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((t) => getEmbedding(t)));
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/embeddings.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/embeddings.ts src/ml/embeddings.test.ts
git commit -m "feat: add embedding service with caching"
```

---

### Task 3: Create similarity utilities

**Files:**
- Create: `src/ml/similarity.ts`
- Test: `src/ml/similarity.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/similarity.test.ts
import { describe, expect, it } from 'vitest';
import { dot, cosine, magnitude } from './similarity';

describe('similarity', () => {
  it('computes dot product', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
  });

  it('computes magnitude', () => {
    expect(magnitude([3, 4])).toBe(5);
  });

  it('computes cosine similarity', () => {
    expect(cosine([1, 0], [1, 0])).toBe(1);
    expect(cosine([1, 0], [0, 1])).toBe(0);
    expect(cosine([1, 0], [-1, 0])).toBe(-1);
  });

  it('handles zero vectors', () => {
    expect(cosine([0, 0], [1, 0])).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/similarity.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/similarity.ts
export function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
}

export function magnitude(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

export function cosine(a: number[], b: number[]): number {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dot(a, b) / (magA * magB);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/similarity.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/similarity.ts src/ml/similarity.test.ts
git commit -m "feat: add similarity utilities"
```

---

### Task 4: Create content classifier

**Files:**
- Create: `src/ml/classifier.ts`
- Test: `src/ml/classifier.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/classifier.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { classifyContent, precomputeConceptEmbeddings, CONTENT_CATEGORIES } from './classifier';
import { setEmbedderForTests, clearCache } from './embeddings';

describe('classifier', () => {
  beforeEach(() => {
    clearCache();
  });

  it('classifies content by similarity to concepts', async () => {
    // Mock embedder that returns predictable vectors
    let callCount = 0;
    const mockEmbedder = vi.fn().mockImplementation(() => {
      callCount++;
      // Return vectors that make "tech" most similar
      if (callCount <= CONTENT_CATEGORIES.length) {
        // Concept embeddings
        return Promise.resolve({ data: new Float32Array([callCount * 0.1, 0.1]) });
      }
      // Input text - similar to "tech" (first category)
      return Promise.resolve({ data: new Float32Array([0.1, 0.1]) });
    });
    setEmbedderForTests(mockEmbedder);

    await precomputeConceptEmbeddings();
    const result = await classifyContent('AI and machine learning');

    expect(result.categories).toBeDefined();
    expect(result.categories.length).toBeGreaterThan(0);
    expect(result.topCategory).toBeDefined();
  });

  it('returns similarity scores for all categories', async () => {
    const mockEmbedder = vi.fn().mockResolvedValue({ data: new Float32Array([0.5, 0.5]) });
    setEmbedderForTests(mockEmbedder);

    await precomputeConceptEmbeddings();
    const result = await classifyContent('test content');

    expect(result.categories.length).toBe(CONTENT_CATEGORIES.length);
    result.categories.forEach((cat) => {
      expect(cat.similarity).toBeGreaterThanOrEqual(-1);
      expect(cat.similarity).toBeLessThanOrEqual(1);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/classifier.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/classifier.ts
import { getEmbedding } from './embeddings';
import { cosine } from './similarity';

export const CONTENT_CATEGORIES = [
  { id: 'tech', label: 'Technology', concept: 'technology software engineering programming AI' },
  { id: 'news', label: 'News', concept: 'breaking news current events politics world' },
  { id: 'entertainment', label: 'Entertainment', concept: 'movies music celebrities entertainment media' },
  { id: 'sports', label: 'Sports', concept: 'sports football basketball soccer athletics' },
  { id: 'business', label: 'Business', concept: 'business finance stocks market economy' },
  { id: 'science', label: 'Science', concept: 'science research discovery biology physics' },
  { id: 'lifestyle', label: 'Lifestyle', concept: 'lifestyle health fitness food travel' },
  { id: 'humor', label: 'Humor', concept: 'funny jokes memes comedy humor' }
] as const;

type CategoryId = typeof CONTENT_CATEGORIES[number]['id'];

const conceptEmbeddings = new Map<CategoryId, number[]>();

export async function precomputeConceptEmbeddings(): Promise<void> {
  for (const cat of CONTENT_CATEGORIES) {
    const embedding = await getEmbedding(cat.concept);
    conceptEmbeddings.set(cat.id, embedding);
  }
}

export type ClassificationResult = {
  categories: Array<{ id: CategoryId; label: string; similarity: number }>;
  topCategory: { id: CategoryId; label: string; similarity: number };
};

export async function classifyContent(text: string): Promise<ClassificationResult> {
  const textEmbedding = await getEmbedding(text);

  const categories = CONTENT_CATEGORIES.map((cat) => {
    const conceptEmb = conceptEmbeddings.get(cat.id);
    const similarity = conceptEmb ? cosine(textEmbedding, conceptEmb) : 0;
    return { id: cat.id, label: cat.label, similarity };
  }).sort((a, b) => b.similarity - a.similarity);

  return {
    categories,
    topCategory: categories[0]
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/classifier.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/classifier.ts src/ml/classifier.test.ts
git commit -m "feat: add content classifier with concept embeddings"
```

---

### Task 5: Create engagement predictor

**Files:**
- Create: `src/ml/engagement.ts`
- Test: `src/ml/engagement.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/engagement.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { predictEngagement, calculateWeightedScore } from './engagement';
import { setEmbedderForTests, clearCache } from './embeddings';

describe('engagement', () => {
  beforeEach(() => {
    clearCache();
  });

  it('predicts engagement probabilities', async () => {
    const mockEmbedder = vi.fn().mockResolvedValue({ data: new Float32Array([0.5, 0.5]) });
    setEmbedderForTests(mockEmbedder);

    const result = await predictEngagement('Great tweet about AI!', {
      tech: 80,
      casual: 20
    });

    expect(result.like).toBeGreaterThan(0);
    expect(result.like).toBeLessThanOrEqual(1);
    expect(result.repost).toBeGreaterThan(0);
    expect(result.reply).toBeGreaterThan(0);
    expect(result.bookmark).toBeGreaterThan(0);
  });

  it('calculates weighted score from probabilities', () => {
    const score = calculateWeightedScore({
      like: 0.5,
      repost: 0.2,
      reply: 0.1,
      bookmark: 0.1,
      click: 0.3
    });

    // like*1.0 + repost*2.0 + reply*1.5 + bookmark*1.2 + click*0.5
    // 0.5*1 + 0.2*2 + 0.1*1.5 + 0.1*1.2 + 0.3*0.5 = 0.5 + 0.4 + 0.15 + 0.12 + 0.15 = 1.32
    expect(score).toBeCloseTo(1.32, 2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/engagement.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/engagement.ts
import { classifyContent, precomputeConceptEmbeddings } from './classifier';

export type EngagementProbabilities = {
  like: number;
  repost: number;
  reply: number;
  bookmark: number;
  click: number;
};

export type AudienceMix = Record<string, number>;

const WEIGHTS = {
  like: 1.0,
  repost: 2.0,
  reply: 1.5,
  bookmark: 1.2,
  click: 0.5
};

// Base engagement rates by content type (empirical estimates)
const BASE_RATES: Record<string, EngagementProbabilities> = {
  tech: { like: 0.08, repost: 0.03, reply: 0.02, bookmark: 0.04, click: 0.12 },
  news: { like: 0.06, repost: 0.04, reply: 0.03, bookmark: 0.02, click: 0.15 },
  entertainment: { like: 0.12, repost: 0.05, reply: 0.04, bookmark: 0.03, click: 0.08 },
  sports: { like: 0.10, repost: 0.04, reply: 0.05, bookmark: 0.02, click: 0.10 },
  business: { like: 0.05, repost: 0.02, reply: 0.02, bookmark: 0.05, click: 0.15 },
  science: { like: 0.07, repost: 0.03, reply: 0.02, bookmark: 0.06, click: 0.10 },
  lifestyle: { like: 0.11, repost: 0.04, reply: 0.03, bookmark: 0.04, click: 0.09 },
  humor: { like: 0.15, repost: 0.08, reply: 0.06, bookmark: 0.02, click: 0.05 }
};

const DEFAULT_RATES: EngagementProbabilities = {
  like: 0.08, repost: 0.03, reply: 0.03, bookmark: 0.03, click: 0.10
};

export async function predictEngagement(
  text: string,
  audienceMix: AudienceMix
): Promise<EngagementProbabilities> {
  const classification = await classifyContent(text);
  const topCat = classification.topCategory.id;
  const baseRates = BASE_RATES[topCat] ?? DEFAULT_RATES;

  // Adjust based on audience composition
  const techShare = ((audienceMix.tech ?? 0) + (audienceMix.founders ?? 0) + (audienceMix.students ?? 0)) / 100;
  const casualShare = (audienceMix.casual ?? 0) / 100;
  const botsShare = (audienceMix.bots ?? 0) / 100;

  // Tech audiences engage more with tech content
  const techBoost = topCat === 'tech' ? 1 + techShare * 0.5 : 1;
  // Casual audiences like entertainment more
  const casualBoost = topCat === 'entertainment' || topCat === 'humor' ? 1 + casualShare * 0.3 : 1;
  // Bots reduce engagement
  const botPenalty = 1 - botsShare * 0.5;

  const multiplier = techBoost * casualBoost * botPenalty;

  return {
    like: Math.min(0.95, baseRates.like * multiplier),
    repost: Math.min(0.5, baseRates.repost * multiplier),
    reply: Math.min(0.3, baseRates.reply * multiplier),
    bookmark: Math.min(0.4, baseRates.bookmark * multiplier),
    click: Math.min(0.8, baseRates.click * multiplier)
  };
}

export function calculateWeightedScore(probs: EngagementProbabilities): number {
  return (
    probs.like * WEIGHTS.like +
    probs.repost * WEIGHTS.repost +
    probs.reply * WEIGHTS.reply +
    probs.bookmark * WEIGHTS.bookmark +
    probs.click * WEIGHTS.click
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/engagement.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/engagement.ts src/ml/engagement.test.ts
git commit -m "feat: add engagement predictor with weighted scoring"
```

---

### Task 6: Create muted keyword filter

**Files:**
- Create: `src/ml/filters.ts`
- Test: `src/ml/filters.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/filters.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MutedKeywordFilter } from './filters';
import { setEmbedderForTests, clearCache } from './embeddings';

describe('MutedKeywordFilter', () => {
  beforeEach(() => {
    clearCache();
  });

  it('filters exact keyword matches', async () => {
    const filter = new MutedKeywordFilter(['crypto', 'nft']);

    expect(await filter.shouldFilter('Buy my new NFT!')).toBe(true);
    expect(await filter.shouldFilter('Great weather today')).toBe(false);
  });

  it('filters semantic matches when embedder available', async () => {
    // Mock embedder where "blockchain" is similar to "crypto"
    const mockEmbedder = vi.fn().mockImplementation((text: string) => {
      if (text.includes('crypto')) return Promise.resolve({ data: new Float32Array([1, 0]) });
      if (text.includes('blockchain')) return Promise.resolve({ data: new Float32Array([0.95, 0.05]) });
      return Promise.resolve({ data: new Float32Array([0, 1]) });
    });
    setEmbedderForTests(mockEmbedder);

    const filter = new MutedKeywordFilter(['crypto'], { semanticThreshold: 0.8 });
    await filter.initializeSemanticFiltering();

    expect(await filter.shouldFilter('blockchain technology')).toBe(true);
    expect(await filter.shouldFilter('weather forecast')).toBe(false);
  });

  it('returns filter reason', async () => {
    const filter = new MutedKeywordFilter(['spam']);
    const result = await filter.checkWithReason('This is spam content');

    expect(result.filtered).toBe(true);
    expect(result.reason).toContain('spam');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/filters.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/filters.ts
import { getEmbedding, isInitialized } from './embeddings';
import { cosine } from './similarity';

type FilterOptions = {
  semanticThreshold?: number;
};

type FilterResult = {
  filtered: boolean;
  reason: string | null;
};

export class MutedKeywordFilter {
  private keywords: string[];
  private keywordEmbeddings: Map<string, number[]> = new Map();
  private semanticThreshold: number;

  constructor(keywords: string[], options: FilterOptions = {}) {
    this.keywords = keywords.map((k) => k.toLowerCase());
    this.semanticThreshold = options.semanticThreshold ?? 0.85;
  }

  async initializeSemanticFiltering(): Promise<void> {
    if (!isInitialized()) return;

    for (const keyword of this.keywords) {
      const embedding = await getEmbedding(keyword);
      this.keywordEmbeddings.set(keyword, embedding);
    }
  }

  private checkExactMatch(text: string): string | null {
    const lower = text.toLowerCase();
    for (const keyword of this.keywords) {
      if (lower.includes(keyword)) {
        return keyword;
      }
    }
    return null;
  }

  private async checkSemanticMatch(text: string): Promise<string | null> {
    if (this.keywordEmbeddings.size === 0) return null;

    const textEmbedding = await getEmbedding(text);

    for (const [keyword, keywordEmb] of this.keywordEmbeddings) {
      const similarity = cosine(textEmbedding, keywordEmb);
      if (similarity >= this.semanticThreshold) {
        return keyword;
      }
    }
    return null;
  }

  async shouldFilter(text: string): Promise<boolean> {
    const result = await this.checkWithReason(text);
    return result.filtered;
  }

  async checkWithReason(text: string): Promise<FilterResult> {
    // Check exact match first
    const exactMatch = this.checkExactMatch(text);
    if (exactMatch) {
      return { filtered: true, reason: `Matched muted keyword: "${exactMatch}"` };
    }

    // Check semantic match if embeddings available
    const semanticMatch = await this.checkSemanticMatch(text);
    if (semanticMatch) {
      return { filtered: true, reason: `Semantically similar to muted keyword: "${semanticMatch}"` };
    }

    return { filtered: false, reason: null };
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/filters.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/filters.ts src/ml/filters.test.ts
git commit -m "feat: add semantic muted keyword filter"
```

---

### Task 7: Create simulated tweet pool generator

**Files:**
- Create: `src/ml/tweetPool.ts`
- Test: `src/ml/tweetPool.test.ts`

**Step 1: Write the failing test**

```ts
// src/ml/tweetPool.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { generateTweetPool, TweetCandidate } from './tweetPool';
import { setEmbedderForTests, clearCache } from './embeddings';

describe('tweetPool', () => {
  beforeEach(() => {
    clearCache();
    const mockEmbedder = vi.fn().mockResolvedValue({
      data: new Float32Array(Array(384).fill(0.1))
    });
    setEmbedderForTests(mockEmbedder);
  });

  it('generates requested number of tweets', async () => {
    const pool = await generateTweetPool(50);
    expect(pool.length).toBe(50);
  });

  it('each tweet has required fields', async () => {
    const pool = await generateTweetPool(5);

    pool.forEach((tweet) => {
      expect(tweet.id).toBeDefined();
      expect(tweet.text).toBeDefined();
      expect(tweet.author).toBeDefined();
      expect(tweet.embedding).toBeDefined();
      expect(tweet.embedding.length).toBe(384);
      expect(tweet.category).toBeDefined();
    });
  });

  it('tweets have variety of categories', async () => {
    const pool = await generateTweetPool(100);
    const categories = new Set(pool.map((t) => t.category));
    expect(categories.size).toBeGreaterThan(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/tweetPool.test.ts`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/ml/tweetPool.ts
import { getEmbedding } from './embeddings';
import { CONTENT_CATEGORIES } from './classifier';

export type TweetCandidate = {
  id: string;
  text: string;
  author: string;
  embedding: number[];
  category: string;
  timestamp: number;
};

const TWEET_TEMPLATES: Record<string, string[]> = {
  tech: [
    'Just shipped a new feature using {tech}. The DX is incredible!',
    'Hot take: {tech} will replace {tech2} within 2 years.',
    'Been exploring {tech} lately. Here are my thoughts...',
    'The future of {tech} is looking bright. Here\'s why:',
    'Just discovered this amazing {tech} library. Game changer!'
  ],
  news: [
    'Breaking: Major developments in {topic} today.',
    'Analysis: What the latest {topic} news means for you.',
    'Just in: {topic} reaches new milestone.',
    'Update on {topic}: Here\'s what we know so far.'
  ],
  entertainment: [
    'Can\'t stop thinking about {show}. What an ending!',
    'Hot take: {movie} is actually underrated.',
    'The {artist} album is on repeat. Pure fire.',
    'Just watched {show} and I have thoughts...'
  ],
  humor: [
    'POV: You\'re debugging at 3am',
    'Nobody: ... Me: {joke}',
    'When the code works on the first try:',
    'Developers be like: {joke}'
  ],
  business: [
    'Key insights from today\'s market movements.',
    'Why {company} stock is moving today.',
    'The {industry} sector is seeing major shifts.',
    'Investment tip: Watch {sector} closely.'
  ]
};

const TECH_TERMS = ['React', 'TypeScript', 'Rust', 'AI', 'LLMs', 'Next.js', 'Go', 'Python', 'WebAssembly'];
const AUTHORS = ['@techdev', '@newscaster', '@funnybot', '@investor', '@creator', '@analyst', '@engineer'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTweetText(category: string): string {
  const templates = TWEET_TEMPLATES[category] ?? TWEET_TEMPLATES.tech;
  let text = randomChoice(templates);

  text = text.replace('{tech}', randomChoice(TECH_TERMS));
  text = text.replace('{tech2}', randomChoice(TECH_TERMS));
  text = text.replace('{topic}', randomChoice(['AI', 'climate', 'economy', 'politics']));
  text = text.replace('{show}', randomChoice(['Severance', 'The Bear', 'Succession']));
  text = text.replace('{movie}', randomChoice(['Oppenheimer', 'Barbie', 'Dune']));
  text = text.replace('{artist}', randomChoice(['Taylor Swift', 'Kendrick', 'SZA']));
  text = text.replace('{joke}', randomChoice(['it works on my machine', 'just one more refactor']));
  text = text.replace('{company}', randomChoice(['Apple', 'Google', 'Meta', 'Nvidia']));
  text = text.replace('{industry}', randomChoice(['tech', 'finance', 'healthcare']));
  text = text.replace('{sector}', randomChoice(['AI', 'semiconductors', 'fintech']));

  return text;
}

export async function generateTweetPool(count: number): Promise<TweetCandidate[]> {
  const categories = CONTENT_CATEGORIES.map((c) => c.id);
  const tweets: TweetCandidate[] = [];

  for (let i = 0; i < count; i++) {
    const category = randomChoice(categories);
    const text = generateTweetText(category);
    const embedding = await getEmbedding(text);

    tweets.push({
      id: `tweet-${i}-${Date.now()}`,
      text,
      author: randomChoice(AUTHORS),
      embedding,
      category,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000) // Random time in last 24h
    });
  }

  return tweets;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/tweetPool.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/tweetPool.ts src/ml/tweetPool.test.ts
git commit -m "feat: add simulated tweet pool generator"
```

---

### Task 8: Create BIOS loading UI component

**Files:**
- Create: `src/components/visualization/BIOSLoading.tsx`
- Create: `src/components/visualization/BIOSLoading.test.tsx`
- Create: `src/styles/bios-loading.module.css`

**Step 1: Write the failing test**

```tsx
// src/components/visualization/BIOSLoading.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import BIOSLoading from './BIOSLoading';
import { useMLStore } from '../../stores/ml';

describe('BIOSLoading', () => {
  beforeEach(() => {
    useMLStore.setState({
      status: 'loading',
      progress: 0.5,
      currentStep: 'Loading semantic processor...',
      error: null
    });
  });

  it('displays progress bar', () => {
    render(<BIOSLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows current step', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/Loading semantic processor/)).toBeInTheDocument();
  });

  it('shows progress percentage', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('shows initialization steps with status', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/Establishing neural link/)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/visualization/BIOSLoading.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```tsx
// src/components/visualization/BIOSLoading.tsx
import { useMLStore } from '../../stores/ml';
import styles from '../../styles/bios-loading.module.css';

const INIT_STEPS = [
  { id: 'neural', label: 'Establishing neural link...' },
  { id: 'model', label: 'Loading semantic processor (22.4 MB)...' },
  { id: 'embeddings', label: 'Calibrating embedding matrices...' },
  { id: 'filters', label: 'Initializing filter cascade...' },
  { id: 'scoring', label: 'Connecting to scoring transformers...' }
];

export default function BIOSLoading() {
  const progress = useMLStore((state) => state.progress);
  const currentStep = useMLStore((state) => state.currentStep);
  const status = useMLStore((state) => state.status);

  const progressPercent = Math.round(progress * 100);
  const barWidth = Math.round(progress * 40);
  const barFill = '\u2588'.repeat(barWidth);
  const barEmpty = '\u2591'.repeat(40 - barWidth);

  const getStepStatus = (index: number) => {
    const stepProgress = (index + 1) / INIT_STEPS.length;
    if (progress >= stepProgress) return '[ OK ]';
    if (progress >= stepProgress - 0.2) return '[....]';
    return '[PENDING]';
  };

  return (
    <section className={styles.container} data-testid="bios-loading">
      <header className={styles.header}>
        <div className={styles.title}>X-ALGORITHM VISUALIZER v1.0</div>
        <div className={styles.copyright}>(c) 2026 @prabal_</div>
      </header>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>SYSTEM INITIALIZATION</div>
        <div className={styles.divider}>{'='.repeat(60)}</div>
      </div>

      <div className={styles.steps}>
        {INIT_STEPS.map((step, index) => (
          <div key={step.id} className={styles.step}>
            <span>&gt; {step.label}</span>
            <span className={styles.stepStatus}>{getStepStatus(index)}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressSection}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {barFill}{barEmpty} {progressPercent}%
        </div>
        {currentStep && <div className={styles.currentStep}>{currentStep}</div>}
      </div>

      <div className={styles.footer}>
        <div className={styles.divider}>{'─'.repeat(60)}</div>
        <div className={styles.tip}>
          [TIP] This visualizer uses real ML models to compute real scores.
        </div>
        <div className={styles.tip}>
          The download is worth it. Trust us.
        </div>
      </div>
    </section>
  );
}
```

```css
/* src/styles/bios-loading.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--crt-black);
  border: 1px solid var(--phosphor-green);
  font-family: 'VT323', monospace;
  font-size: 16px;
}

.header {
  text-align: center;
}

.title {
  font-size: 20px;
  color: var(--phosphor-amber);
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.copyright {
  color: var(--phosphor-green);
  opacity: 0.7;
}

.section {
  margin-top: 8px;
}

.sectionTitle {
  color: var(--phosphor-green);
  letter-spacing: 0.1em;
}

.divider {
  color: var(--phosphor-green);
  opacity: 0.5;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step {
  display: flex;
  justify-content: space-between;
  color: var(--phosphor-green);
}

.stepStatus {
  color: var(--phosphor-amber);
}

.progressSection {
  margin-top: 8px;
}

.progressBar {
  color: var(--phosphor-cyan, #00ffff);
  font-family: monospace;
}

.currentStep {
  color: var(--phosphor-green);
  opacity: 0.8;
  margin-top: 4px;
}

.footer {
  margin-top: 16px;
}

.tip {
  color: var(--phosphor-amber);
  opacity: 0.8;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/visualization/BIOSLoading.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/BIOSLoading.tsx src/components/visualization/BIOSLoading.test.tsx src/styles/bios-loading.module.css
git commit -m "feat: add BIOS-style loading UI"
```

---

### Task 9: Integrate ML pipeline into app

**Files:**
- Create: `src/ml/index.ts` (barrel export)
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Step 1: Create barrel export**

```ts
// src/ml/index.ts
export { initializeEmbedder, getEmbedding, getEmbeddings, isInitialized } from './embeddings';
export { classifyContent, precomputeConceptEmbeddings, CONTENT_CATEGORIES } from './classifier';
export { predictEngagement, calculateWeightedScore } from './engagement';
export { MutedKeywordFilter } from './filters';
export { generateTweetPool } from './tweetPool';
export { dot, cosine, magnitude } from './similarity';
```

**Step 2: Write failing test for App integration**

```tsx
// Add to src/App.test.tsx
it('shows BIOS loading when ML is loading', () => {
  useMLStore.setState({ status: 'loading', progress: 0.3, currentStep: 'Loading...' });
  render(<App />);
  expect(screen.getByTestId('bios-loading')).toBeInTheDocument();
});
```

**Step 3: Modify App.tsx to show BIOS loading**

Add import for BIOSLoading and useMLStore, then conditionally render based on ML status.

**Step 4: Run tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ml/index.ts src/App.tsx src/App.test.tsx
git commit -m "feat: integrate ML pipeline with BIOS loading"
```

---

### Task 10: Update TODO.md and verify

**Step 1: Run full test suite**

Run: `npm test -- --run`
Expected: All tests PASS

**Step 2: Take screenshot of BIOS loading**

Start dev server, trigger model load, capture screenshot.

**Step 3: Update TODO.md**

Move Phase 3 items to Completed section.

**Step 4: Commit**

```bash
git add .codex/TODO.md
git commit -m "chore: mark Phase 3 ML Pipeline complete"
```

---

Plan complete and saved to `docs/plans/2026-01-21-ml-pipeline-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
