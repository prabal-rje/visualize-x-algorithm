import { AUDIENCES } from '../data/audiences';
import { getEmbedding, isInitialized } from './embeddings';
import { cosine } from './similarity';

type AudienceId = (typeof AUDIENCES)[number]['id'];
type AudienceMix = Record<AudienceId, number>;

// Cache for audience embeddings (computed once)
let audienceEmbeddingsCache: Map<AudienceId, number[]> | null = null;

/**
 * Pre-compute embeddings for all audience interest descriptions.
 * Should be called after ML model is initialized.
 */
export async function initAudienceEmbeddings(): Promise<void> {
  if (!isInitialized()) {
    throw new Error('Embeddings model not initialized');
  }

  audienceEmbeddingsCache = new Map();

  for (const audience of AUDIENCES) {
    const embedding = await getEmbedding(audience.interests);
    audienceEmbeddingsCache.set(audience.id, embedding);
  }
}

/**
 * Check if audience embeddings are ready.
 */
export function areAudienceEmbeddingsReady(): boolean {
  return audienceEmbeddingsCache !== null && audienceEmbeddingsCache.size === AUDIENCES.length;
}

/**
 * Compute reach distribution based on semantic similarity between
 * the tweet and each audience's interests, weighted by the user's
 * selected audience mix.
 *
 * @param tweetText - The tweet content
 * @param selectedMix - The user's selected audience mix (from Chapter 0B)
 * @returns Reach percentages for each audience
 */
export async function computeSemanticReach(
  tweetText: string,
  selectedMix: AudienceMix
): Promise<AudienceMix> {
  if (!audienceEmbeddingsCache) {
    // Fallback to selected mix if embeddings not ready
    return selectedMix;
  }

  // Get tweet embedding
  const tweetEmbedding = await getEmbedding(tweetText);

  // Compute similarity with each audience
  const similarities: { id: AudienceId; similarity: number; selectedWeight: number }[] = [];

  for (const audience of AUDIENCES) {
    const audienceEmbedding = audienceEmbeddingsCache.get(audience.id);
    if (!audienceEmbedding) continue;

    const similarity = cosine(tweetEmbedding, audienceEmbedding);
    const selectedWeight = selectedMix[audience.id] ?? 0;

    similarities.push({
      id: audience.id,
      similarity: Math.max(0, similarity), // Clamp negative similarities
      selectedWeight
    });
  }

  // Combine semantic similarity with user selection:
  // - Base reach: 40% from semantic similarity
  // - User selection: 60% from selected mix
  // This ensures user selection matters but content still influences reach
  const SEMANTIC_WEIGHT = 0.4;
  const SELECTION_WEIGHT = 0.6;

  // Normalize similarities to sum to 100
  const totalSimilarity = similarities.reduce((sum, s) => sum + s.similarity, 0) || 1;
  const normalizedSimilarities = similarities.map((s) => ({
    ...s,
    normalizedSim: (s.similarity / totalSimilarity) * 100
  }));

  // Combine weights
  const combinedScores = normalizedSimilarities.map((s) => ({
    id: s.id,
    score: s.normalizedSim * SEMANTIC_WEIGHT + s.selectedWeight * SELECTION_WEIGHT
  }));

  // Normalize to sum to 100%
  const totalScore = combinedScores.reduce((sum, s) => sum + s.score, 0) || 1;

  const result = {} as AudienceMix;
  for (const { id, score } of combinedScores) {
    result[id] = (score / totalScore) * 100;
  }

  return result;
}

/**
 * Synchronous version that returns cached semantic reach if available,
 * or falls back to the selected mix.
 */
let lastSemanticReach: AudienceMix | null = null;
let lastTweetText: string | null = null;

export function getSemanticReachSync(
  tweetText: string,
  selectedMix: AudienceMix
): AudienceMix {
  // If we have a cached result for this exact tweet, use it
  if (lastSemanticReach && lastTweetText === tweetText) {
    return lastSemanticReach;
  }

  // Otherwise trigger async computation and return selected mix for now
  computeSemanticReach(tweetText, selectedMix).then((reach) => {
    lastSemanticReach = reach;
    lastTweetText = tweetText;
  });

  return selectedMix;
}
