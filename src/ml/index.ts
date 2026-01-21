// ML Pipeline Barrel Export
// Centralizes all ML functionality for easy importing

// Embeddings
export {
  initializeEmbedder,
  getEmbedding,
  getEmbeddings,
  isInitialized,
  clearCache,
  setEmbedderForTests
} from './embeddings';

// Similarity utilities
export { cosine, cosinePreview, dot, magnitude } from './similarity';

// Content classification
export {
  CONTENT_CATEGORIES,
  classifyContent,
  precomputeConceptEmbeddings
} from './classifier';
export type { ClassificationResult, ContentCategory } from './classifier';

// Engagement prediction
export {
  predictEngagement,
  calculateWeightedScore
} from './engagement';
export type { EngagementProbabilities } from './engagement';

// Filters
export { MutedKeywordFilter } from './filters';
export type { FilterOptions, FilterResult } from './filters';

// Tweet pool
export { generateTweetPool } from './tweetPool';
export type { TweetCandidate } from './tweetPool';
