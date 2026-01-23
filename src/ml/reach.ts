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
 * Compute reach distribution using semantic similarity as a MULTIPLICATIVE
 * filter on the user's selected audience mix.
 *
 * The key insight: semantic similarity determines the PROBABILITY that
 * each audience type from the selected pool actually sees the tweet.
 * A tech tweet should deliver mostly to tech audiences, even if the user
 * selected a broad mix.
 *
 * Formula: reach[i] = selectedWeight[i] * similarity[i]^exponent
 * Then normalize to sum to 100%.
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

  // Compute raw similarities
  const rawSimilarities: { id: AudienceId; similarity: number; selectedWeight: number }[] = [];

  for (const audience of AUDIENCES) {
    const audienceEmbedding = audienceEmbeddingsCache.get(audience.id);
    if (!audienceEmbedding) continue;

    const similarity = cosine(tweetEmbedding, audienceEmbedding);
    const selectedWeight = selectedMix[audience.id] ?? 0;

    rawSimilarities.push({
      id: audience.id,
      similarity: Math.max(0.01, similarity), // Floor at 0.01 to avoid zeros
      selectedWeight
    });
  }

  // Compute min/max for normalization to [0.1, 1.0] range
  // This spreads out the similarities to create more dramatic differences
  const similarities = rawSimilarities.map((s) => s.similarity);
  const minSim = Math.min(...similarities);
  const maxSim = Math.max(...similarities);
  const simRange = maxSim - minSim || 1;

  // Normalize similarities to [0.1, 1.0] range to amplify differences
  const normalizedData = rawSimilarities.map((s) => ({
    ...s,
    // Map to [0.1, 1.0] - low similarity gets 0.1, high gets 1.0
    normalizedSim: 0.1 + 0.9 * ((s.similarity - minSim) / simRange)
  }));

  // MULTIPLICATIVE filtering: selected weight * similarity^exponent
  // Exponent > 1 amplifies differences (high similarity gets much more)
  const SIMILARITY_EXPONENT = 2.5;

  const weightedScores = normalizedData.map((s) => ({
    id: s.id,
    // Multiply selection by similarity raised to power
    // This means high similarity audiences get disproportionately more
    score: s.selectedWeight * Math.pow(s.normalizedSim, SIMILARITY_EXPONENT)
  }));

  // Normalize to sum to 100%
  const totalScore = weightedScores.reduce((sum, s) => sum + s.score, 0) || 1;

  const result = {} as AudienceMix;
  for (const { id, score } of weightedScores) {
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
