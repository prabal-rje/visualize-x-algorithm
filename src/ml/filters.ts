/**
 * Muted keyword filter with semantic matching support.
 * Filters content based on exact keyword matches and optional
 * semantic similarity using embeddings.
 */

import { getEmbedding, isInitialized } from './embeddings';
import { cosine } from './similarity';

/**
 * Configuration options for the muted keyword filter.
 */
export type FilterOptions = {
  /** Similarity threshold for semantic matching (default 0.85) */
  semanticThreshold?: number;
};

/**
 * Result of a filter check with optional reason.
 */
export type FilterResult = {
  /** Whether the content should be filtered */
  filtered: boolean;
  /** Human-readable reason for filtering, null if not filtered */
  reason: string | null;
};

/**
 * Muted keyword filter that supports both exact and semantic matching.
 *
 * Usage:
 * ```ts
 * const filter = new MutedKeywordFilter(['spam', 'hate speech']);
 * await filter.initializeSemanticFiltering(); // optional
 *
 * if (await filter.shouldFilter(tweetText)) {
 *   // Content should be filtered
 * }
 * ```
 */
export class MutedKeywordFilter {
  private readonly keywords: string[];
  private readonly keywordsLower: string[];
  private readonly semanticThreshold: number;
  private keywordEmbeddings: Map<string, number[]> = new Map();
  private semanticInitialized = false;

  /**
   * Create a new muted keyword filter.
   * @param keywords Array of keywords/phrases to filter
   * @param options Filter configuration options
   */
  constructor(keywords: string[], options?: FilterOptions) {
    this.keywords = keywords;
    this.keywordsLower = keywords.map((k) => k.toLowerCase());
    this.semanticThreshold = options?.semanticThreshold ?? 0.85;
  }

  /**
   * Initialize semantic filtering by pre-computing embeddings for all keywords.
   * Requires the embedder to be initialized first.
   */
  async initializeSemanticFiltering(): Promise<void> {
    if (!isInitialized()) {
      return;
    }

    this.keywordEmbeddings.clear();

    const embeddings = await Promise.all(
      this.keywords.map(async (keyword) => {
        const embedding = await getEmbedding(keyword);
        return { keyword, embedding };
      })
    );

    for (const { keyword, embedding } of embeddings) {
      this.keywordEmbeddings.set(keyword, embedding);
    }

    this.semanticInitialized = true;
  }

  /**
   * Check if text should be filtered.
   * @param text The text to check
   * @returns True if the text should be filtered
   */
  async shouldFilter(text: string): Promise<boolean> {
    const result = await this.checkWithReason(text);
    return result.filtered;
  }

  /**
   * Check if text should be filtered and return the reason.
   * @param text The text to check
   * @returns FilterResult with filtered status and reason
   */
  async checkWithReason(text: string): Promise<FilterResult> {
    // First check for exact keyword matches (case-insensitive)
    const exactMatch = this.findExactMatch(text);
    if (exactMatch !== null) {
      return {
        filtered: true,
        reason: `Matched muted keyword: "${exactMatch}"`,
      };
    }

    // Then check semantic similarity if initialized
    if (this.semanticInitialized && isInitialized()) {
      const semanticMatch = await this.findSemanticMatch(text);
      if (semanticMatch !== null) {
        return {
          filtered: true,
          reason: `Semantically similar to muted keyword: "${semanticMatch.keyword}" (${(semanticMatch.similarity * 100).toFixed(0)}% match)`,
        };
      }
    }

    return {
      filtered: false,
      reason: null,
    };
  }

  /**
   * Find an exact keyword match in the text (case-insensitive).
   * @param text The text to search
   * @returns The matched keyword or null
   */
  private findExactMatch(text: string): string | null {
    const textLower = text.toLowerCase();

    for (let i = 0; i < this.keywords.length; i++) {
      const keywordLower = this.keywordsLower[i];
      if (textLower.includes(keywordLower)) {
        return this.keywords[i].toLowerCase();
      }
    }

    return null;
  }

  /**
   * Find a semantic match in the text above the threshold.
   * @param text The text to check
   * @returns The matched keyword and similarity, or null
   */
  private async findSemanticMatch(
    text: string
  ): Promise<{ keyword: string; similarity: number } | null> {
    const textEmbedding = await getEmbedding(text);

    let bestMatch: { keyword: string; similarity: number } | null = null;

    for (const [keyword, keywordEmbedding] of this.keywordEmbeddings) {
      const similarity = cosine(textEmbedding, keywordEmbedding);

      if (similarity >= this.semanticThreshold) {
        if (bestMatch === null || similarity > bestMatch.similarity) {
          bestMatch = { keyword, similarity };
        }
      }
    }

    return bestMatch;
  }
}
