/**
 * Content classifier using embedding similarity.
 * Categorizes tweets into content categories by comparing
 * text embeddings to precomputed concept embeddings.
 */

import { getEmbedding } from './embeddings';
import { cosine } from './similarity';

/**
 * Content categories with their concept descriptions.
 * Used to classify tweets by semantic similarity.
 */
export const CONTENT_CATEGORIES = [
  { id: 'tech', label: 'Technology', concept: 'technology software engineering programming AI' },
  { id: 'news', label: 'News', concept: 'breaking news current events politics world' },
  { id: 'entertainment', label: 'Entertainment', concept: 'movies music celebrities entertainment media' },
  { id: 'sports', label: 'Sports', concept: 'sports football basketball soccer athletics' },
  { id: 'business', label: 'Business', concept: 'business finance stocks market economy' },
  { id: 'science', label: 'Science', concept: 'science research discovery biology physics' },
  { id: 'lifestyle', label: 'Lifestyle', concept: 'lifestyle health fitness food travel' },
  { id: 'humor', label: 'Humor', concept: 'funny jokes memes comedy humor' },
] as const;

/**
 * Result of content classification.
 */
export type ClassificationResult = {
  /** All categories sorted by similarity (highest first) */
  categories: Array<{ id: string; label: string; similarity: number }>;
  /** The category with highest similarity */
  topCategory: { id: string; label: string; similarity: number };
};

/** Type for a single content category */
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

/** Map storing precomputed concept embeddings */
const conceptEmbeddings = new Map<string, number[]>();

/**
 * Precompute embeddings for all content category concepts.
 * Must be called before classifyContent.
 */
export async function precomputeConceptEmbeddings(): Promise<void> {
  conceptEmbeddings.clear();

  const embeddings = await Promise.all(
    CONTENT_CATEGORIES.map(async (category) => {
      const embedding = await getEmbedding(category.concept);
      return { id: category.id, embedding };
    })
  );

  for (const { id, embedding } of embeddings) {
    conceptEmbeddings.set(id, embedding);
  }
}

/**
 * Classify text content by computing similarity to each category concept.
 * @param text The text to classify
 * @returns Classification result with all categories sorted by similarity
 */
export async function classifyContent(text: string): Promise<ClassificationResult> {
  const textEmbedding = await getEmbedding(text);

  // Compute similarity to each category
  const categories = CONTENT_CATEGORIES.map((category) => {
    const conceptEmbedding = conceptEmbeddings.get(category.id);
    const similarity = conceptEmbedding ? cosine(textEmbedding, conceptEmbedding) : 0;

    return {
      id: category.id,
      label: category.label,
      similarity,
    };
  });

  // Sort by similarity descending
  categories.sort((a, b) => b.similarity - a.similarity);

  return {
    categories,
    topCategory: categories[0],
  };
}
