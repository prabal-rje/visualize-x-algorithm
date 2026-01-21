/**
 * Engagement predictor using content classification.
 * Predicts engagement probabilities based on content category and audience mix.
 */

import { classifyContent } from './classifier';

/**
 * Engagement probabilities for different engagement types.
 */
export type EngagementProbabilities = {
  like: number;
  repost: number;
  reply: number;
  bookmark: number;
  click: number;
};

/**
 * Audience mix specifying the percentage of each audience type.
 * Keys are audience IDs, values are percentages (0-1).
 */
export type AudienceMix = Record<string, number>;

/**
 * Weights for calculating weighted engagement score.
 */
const ENGAGEMENT_WEIGHTS = {
  like: 1.0,
  repost: 2.0,
  reply: 1.5,
  bookmark: 1.2,
  click: 0.5,
} as const;

/**
 * Base engagement rates by content category.
 * Each category has different engagement patterns.
 */
const BASE_RATES: Record<string, EngagementProbabilities> = {
  tech: { like: 0.15, repost: 0.08, reply: 0.10, bookmark: 0.20, click: 0.25 },
  news: { like: 0.12, repost: 0.15, reply: 0.18, bookmark: 0.08, click: 0.20 },
  entertainment: { like: 0.35, repost: 0.12, reply: 0.08, bookmark: 0.05, click: 0.10 },
  sports: { like: 0.25, repost: 0.10, reply: 0.15, bookmark: 0.06, click: 0.12 },
  business: { like: 0.10, repost: 0.06, reply: 0.08, bookmark: 0.15, click: 0.18 },
  science: { like: 0.12, repost: 0.10, reply: 0.12, bookmark: 0.18, click: 0.22 },
  lifestyle: { like: 0.28, repost: 0.08, reply: 0.10, bookmark: 0.10, click: 0.15 },
  humor: { like: 0.40, repost: 0.20, reply: 0.12, bookmark: 0.03, click: 0.05 },
};

/**
 * Default base rates for unknown categories.
 */
const DEFAULT_BASE_RATES: EngagementProbabilities = {
  like: 0.15,
  repost: 0.08,
  reply: 0.10,
  bookmark: 0.10,
  click: 0.15,
};

/**
 * Audience engagement multipliers.
 * Affects how different audiences modify engagement rates.
 */
const AUDIENCE_MULTIPLIERS: Record<string, Partial<Record<keyof EngagementProbabilities, number>>> = {
  tech: { bookmark: 1.5, click: 1.3, repost: 1.2 },
  casual: { like: 1.2, repost: 0.8 },
  news: { repost: 1.3, reply: 1.2 },
  creators: { repost: 1.4, reply: 1.3 },
  investors: { bookmark: 1.4, click: 1.2 },
  founders: { repost: 1.3, bookmark: 1.3 },
  students: { like: 1.3, bookmark: 1.2 },
  bots: { like: 0.1, repost: 0.1, reply: 0.1, bookmark: 0.1, click: 0.1 },
};

/**
 * Category-audience affinity bonuses.
 * When audience matches content type, there's an additional boost.
 */
const CATEGORY_AUDIENCE_AFFINITY: Record<string, Record<string, number>> = {
  tech: { tech: 1.3, founders: 1.2, investors: 1.1 },
  news: { news: 1.3, casual: 1.1 },
  entertainment: { casual: 1.3, creators: 1.2 },
  sports: { casual: 1.2 },
  business: { investors: 1.4, founders: 1.3 },
  science: { tech: 1.2, students: 1.3 },
  lifestyle: { casual: 1.3, creators: 1.2 },
  humor: { casual: 1.4, creators: 1.3 },
};

/**
 * Clamp a value between 0 and 1.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Predict engagement probabilities for text content with a given audience mix.
 *
 * @param text The text content to analyze
 * @param audienceMix Map of audience IDs to their percentage (0-1)
 * @returns Engagement probabilities for like, repost, reply, bookmark, click
 */
export async function predictEngagement(
  text: string,
  audienceMix: AudienceMix
): Promise<EngagementProbabilities> {
  // Classify content to get category
  const classification = await classifyContent(text);
  const categoryId = classification.topCategory.id;

  // Get base rates for this category
  const baseRates = BASE_RATES[categoryId] || DEFAULT_BASE_RATES;

  // Initialize result with base rates
  const result: EngagementProbabilities = { ...baseRates };

  // Calculate total weight from audience mix
  const audienceEntries = Object.entries(audienceMix);
  const totalWeight = audienceEntries.reduce((sum, [, weight]) => sum + weight, 0);

  // If no audiences, return base rates clamped
  if (totalWeight === 0) {
    return {
      like: clamp01(result.like),
      repost: clamp01(result.repost),
      reply: clamp01(result.reply),
      bookmark: clamp01(result.bookmark),
      click: clamp01(result.click),
    };
  }

  // Calculate weighted multipliers from audience mix
  const engagementTypes: (keyof EngagementProbabilities)[] = [
    'like',
    'repost',
    'reply',
    'bookmark',
    'click',
  ];

  for (const engagementType of engagementTypes) {
    let weightedMultiplier = 0;

    for (const [audienceId, audienceWeight] of audienceEntries) {
      // Get audience multiplier for this engagement type
      const audienceMultipliers = AUDIENCE_MULTIPLIERS[audienceId] || {};
      const baseMultiplier = audienceMultipliers[engagementType] ?? 1.0;

      // Get category-audience affinity bonus
      const affinities = CATEGORY_AUDIENCE_AFFINITY[categoryId] || {};
      const affinityBonus = affinities[audienceId] ?? 1.0;

      // Combine multiplier with affinity
      const combinedMultiplier = baseMultiplier * affinityBonus;

      // Add weighted contribution
      weightedMultiplier += combinedMultiplier * audienceWeight;
    }

    // Normalize by total weight
    const normalizedMultiplier = weightedMultiplier / totalWeight;

    // Apply multiplier to base rate
    result[engagementType] = clamp01(baseRates[engagementType] * normalizedMultiplier);
  }

  return result;
}

/**
 * Calculate weighted engagement score from probabilities.
 *
 * Weights:
 * - like: 1.0
 * - repost: 2.0
 * - reply: 1.5
 * - bookmark: 1.2
 * - click: 0.5
 *
 * @param probs Engagement probabilities
 * @returns Weighted score
 */
export function calculateWeightedScore(probs: EngagementProbabilities): number {
  return (
    probs.like * ENGAGEMENT_WEIGHTS.like +
    probs.repost * ENGAGEMENT_WEIGHTS.repost +
    probs.reply * ENGAGEMENT_WEIGHTS.reply +
    probs.bookmark * ENGAGEMENT_WEIGHTS.bookmark +
    probs.click * ENGAGEMENT_WEIGHTS.click
  );
}
