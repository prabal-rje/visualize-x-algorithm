/**
 * Semantic matching between personas and audiences using embeddings.
 * Finds the most relevant audiences for a given persona based on
 * cosine similarity of their text descriptions.
 */

import { getEmbedding, isInitialized } from './embeddings';
import { AUDIENCES } from '../data/audiences';
import type { Persona } from '../data/personas';

type AudienceId = (typeof AUDIENCES)[number]['id'];

// Cache for audience embeddings (computed once)
let audienceEmbeddingsCache: Map<AudienceId, number[]> | null = null;

/**
 * Compute cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Get or compute audience embeddings (cached).
 */
async function getAudienceEmbeddings(): Promise<Map<AudienceId, number[]>> {
  if (audienceEmbeddingsCache) {
    return audienceEmbeddingsCache;
  }

  const embeddings = new Map<AudienceId, number[]>();

  for (const audience of AUDIENCES) {
    // Combine label and interests for richer semantic representation
    const text = `${audience.label}: ${audience.interests}`;
    const embedding = await getEmbedding(text);
    embeddings.set(audience.id, embedding);
  }

  audienceEmbeddingsCache = embeddings;
  return embeddings;
}

/**
 * Find the top N audiences most semantically similar to a persona.
 * Uses the persona's name and subtitle for matching.
 *
 * @param persona - The persona to match
 * @param topN - Number of top audiences to return (default: 3)
 * @returns Array of audience IDs sorted by relevance
 */
export async function findMatchingAudiences(
  persona: Persona,
  topN: number = 3
): Promise<AudienceId[]> {
  if (!isInitialized()) {
    // Fallback to hardcoded defaults if embeddings not ready
    return ['tech', 'founders', 'news'];
  }

  try {
    // Create persona text from name and subtitle
    const personaText = `${persona.name}: ${persona.subtitle}`;
    const personaEmbedding = await getEmbedding(personaText);

    // Get audience embeddings
    const audienceEmbeddings = await getAudienceEmbeddings();

    // Compute similarities
    const similarities: { id: AudienceId; score: number }[] = [];

    for (const [id, embedding] of audienceEmbeddings) {
      // Skip bots - they shouldn't be auto-selected
      if (id === 'bots') continue;

      const score = cosineSimilarity(personaEmbedding, embedding);
      similarities.push({ id, score });
    }

    // Sort by similarity (descending) and take top N
    similarities.sort((a, b) => b.score - a.score);

    return similarities.slice(0, topN).map((s) => s.id);
  } catch (error) {
    console.error('Failed to compute semantic audience match:', error);
    // Fallback to generic defaults
    return ['tech', 'founders', 'news'];
  }
}

/**
 * Clear the audience embeddings cache.
 * Call this if audiences data changes.
 */
export function clearAudienceCache(): void {
  audienceEmbeddingsCache = null;
}
