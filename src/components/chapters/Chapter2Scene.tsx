import { useEffect, useState } from 'react';
import styles from '../../styles/chapter2-scene.module.css';
import { getEmbedding, isInitialized } from '../../ml/embeddings';
import { cosine } from '../../ml/similarity';
import { generateTweetPool, type TweetCandidate } from '../../ml/tweetPool';
import { useConfigStore } from '../../stores/config';
import EmbeddingHeatmap from '../visualization/EmbeddingHeatmap';
import VectorSpace from '../visualization/VectorSpace';
import CandidateStreams from '../visualization/CandidateStreams';
import TypewriterText from '../visualization/TypewriterText';
import TokenizationFlow, { tokenizeSubTokens } from '../visualization/TokenizationFlow';
import { useViewport } from '../../hooks/useViewport';

type Chapter2SceneProps = {
  /** Current step (0 = user tower, 1 = similarity, 2 = merging) */
  currentStep: number;
  /** Whether the chapter is currently active */
  isActive: boolean;
};

// Number of candidate tweets to generate for vector space visualization
const CANDIDATE_COUNT = 12;

// Sample posts for Thunder and Phoenix streams (shown in step 2)
const THUNDER_POSTS = [
  { id: 't1', preview: '@friend: Just shipped a new feature!' },
  { id: 't2', preview: '@colleague: Great article on AI safety' },
  { id: 't3', preview: '@mentor: Thread on system design...' },
  { id: 't4', preview: '@teammate: Our team hit 10k users!' }
];

const PHOENIX_POSTS = [
  { id: 'p1', preview: 'Viral: New AI model breaks records' },
  { id: 'p2', preview: 'Trending: Tech layoffs continue...' },
  { id: 'p3', preview: 'Popular: Why startups fail (thread)' },
  { id: 'p4', preview: 'Hot take: The future of coding' }
];

const STEP_NARRATION = [
  'The Two-Tower model encodes your tweet into a 128-dimensional vector—your digital fingerprint of meaning...',
  'Your embedding floats in vector space. Posts with similar vectors gravitate toward you...',
  'Thunder brings posts from people you follow. Phoenix discovers content from strangers the AI thinks you\'ll like...'
];

const STEP_LABELS = [
  '2A: User Tower Encoding',
  '2B: Similarity Search',
  '2C: Merging Sources'
];


// Map similarity to 2D position with better spread
function similarityToPosition(
  similarity: number,
  index: number,
  total: number,
  minSim: number,
  maxSim: number
): { x: number; y: number } {
  // Angle based on index for even distribution around the circle
  // Add slight offset so points don't align perfectly
  const angle = (index / total) * 2 * Math.PI + (index % 2) * 0.15;

  // Normalize similarity to 0-1 based on actual range in this batch
  const range = maxSim - minSim || 1;
  const normalizedSim = (similarity - minSim) / range;

  // Distance: high similarity = close to center (10%), low = far (45%)
  // Apply sqrt to spread out the middle values more
  const spreadSim = Math.sqrt(normalizedSim);
  const distance = 45 * (1 - spreadSim) + 8;

  return {
    x: 50 + distance * Math.cos(angle),
    y: 50 + distance * Math.sin(angle)
  };
}

// Truncate category name for display
function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    tech: 'Tech',
    news: 'News',
    entertainment: 'Media',
    humor: 'Humor',
    business: 'Biz'
  };
  return labels[category] || category;
}

export default function Chapter2Scene({
  currentStep,
  isActive
}: Chapter2SceneProps) {
  const tweetText = useConfigStore((state) => state.tweetText);
  const { isMobile } = useViewport();
  const candidateCount = isMobile ? 8 : CANDIDATE_COUNT;
  const [userEmbedding, setUserEmbedding] = useState<number[]>([]);
  const [tweetPool, setTweetPool] = useState<TweetCandidate[]>([]);
  const [candidateData, setCandidateData] = useState<Array<{
    x: number;
    y: number;
    label: string;
    similarity: number;
    text: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const maxTokens = 12;
  const tokenCount = Math.min(
    tokenizeSubTokens(tweetText || 'Hello world').length,
    maxTokens
  );

  // Generate tweet pool once on mount (embeddings pre-computed)
  useEffect(() => {
    async function loadTweetPool() {
      if (!isInitialized()) {
        return;
      }

      try {
        const pool = await generateTweetPool(candidateCount);
        setTweetPool(pool);
      } catch (error) {
        console.error('Failed to generate tweet pool:', error);
      }
    }

    loadTweetPool();
  }, [candidateCount]);

  // Compute user embedding and similarities when tweet changes or pool loads
  useEffect(() => {
    async function computeSimilarities() {
      if (!isInitialized() || tweetPool.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get real embedding for user's tweet
        const embedding = await getEmbedding(tweetText || 'Hello world');
        setUserEmbedding(embedding);

        // Compute similarities using pre-computed pool embeddings
        const similarities = tweetPool.map((tweet) => {
          const sim = cosine(embedding, tweet.embedding);
          return Math.max(0, sim); // Clamp to 0
        });

        // Find range for better spread
        const minSim = Math.min(...similarities);
        const maxSim = Math.max(...similarities);

        // Create candidate data with positions based on relative similarity
        const candidates = tweetPool.map((tweet, index) => {
          const similarity = similarities[index];
          const position = similarityToPosition(similarity, index, tweetPool.length, minSim, maxSim);
          return {
            ...position,
            label: formatCategory(tweet.category),
            similarity,
            text: `${tweet.author}: ${tweet.text}`
          };
        });

        setCandidateData(candidates);
      } catch (error) {
        console.error('Failed to compute similarities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    computeSimilarities();
  }, [tweetText, tweetPool]);

  const USER_POINT = { x: 50, y: 50, label: 'Your Tweet' };

  return (
    <div
      className={styles.container}
      data-testid="chapter-2-scene"
      data-active={isActive}
    >
      {/* Chapter Header */}
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 2</span>
        <h2 className={styles.title}>THE GATHERING</h2>
      </div>

      {/* Narration */}
      <div className={styles.narration}>
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={25}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      {/* Step Content */}
      <div className={styles.content}>
        {currentStep === 0 && (
          <div className={styles.step}>
            <div className={styles.stepLabel}>{STEP_LABELS[0]}</div>
            {isLoading ? (
              <div className={styles.loading}>Computing embedding...</div>
            ) : (
              <>
                <TokenizationFlow
                  tweet={tweetText}
                  isActive={isActive}
                  maxTokens={maxTokens}
                />
                <EmbeddingHeatmap
                  embedding={userEmbedding}
                  label="TWEET EMBEDDING"
                  isActive={isActive}
                  tokenCount={tokenCount}
                />
              </>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className={styles.step}>
            <div className={styles.stepLabel}>{STEP_LABELS[1]}</div>
            {isLoading ? (
              <div className={styles.loading}>Computing similarities...</div>
            ) : (
              <>
                <div className={styles.legend}>
                  <div className={styles.legendTitle}>Legend</div>
                  <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendDot} ${styles.legendDotUser}`}
                        aria-hidden="true"
                      />
                      Your tweet
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendDot} ${styles.legendDotHigh}`}
                        aria-hidden="true"
                      />
                      High similarity
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendDot} ${styles.legendDotMedium}`}
                        aria-hidden="true"
                      />
                      Mid similarity
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={`${styles.legendDot} ${styles.legendDotLow}`}
                        aria-hidden="true"
                      />
                      Low similarity
                    </div>
                  </div>
                </div>
                <VectorSpace
                  userPoint={USER_POINT}
                  candidates={candidateData}
                  showSimilarity={true}
                  label="EMBEDDING SPACE"
                  isActive={isActive}
                />
              </>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.step}>
            <div className={styles.stepLabel}>{STEP_LABELS[2]}</div>
            <CandidateStreams
              thunderPosts={THUNDER_POSTS}
              phoenixPosts={PHOENIX_POSTS}
              isActive={isActive}
            />
          </div>
        )}
      </div>

      {/* Function Panel Reference */}
      <div className={styles.functionRef}>
        <span className={styles.funcLabel}>FUNCTION:</span>
        <code className={styles.funcName}>
          {currentStep === 0 && 'TwoTowerModel.user_tower()'}
          {currentStep === 1 && 'approximate_nearest_neighbors()'}
          {currentStep === 2 && 'PhoenixCandidatePipeline::run()'}
        </code>
      </div>
    </div>
  );
}
