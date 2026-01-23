import { useEffect, useState } from 'react';
import styles from '../../styles/chapter2-scene.module.css';
import { getEmbedding, isInitialized } from '../../ml/embeddings';
import { cosinePreview } from '../../ml/similarity';
import { generateTweetPool, type TweetCandidate } from '../../ml/tweetPool';
import { useConfigStore } from '../../stores/config';
import VectorSpace from '../visualization/VectorSpace';
import CandidateStreams from '../visualization/CandidateStreams';
import TypewriterText from '../visualization/TypewriterText';
import { tokenizeSubTokens } from '../visualization/TokenizationFlow';
import TokenDisplay from '../visualization/TokenDisplay';
import TokenEmbeddingAnim from '../visualization/TokenEmbeddingAnim';
import PoolingViz from '../visualization/PoolingViz';
import { useViewport } from '../../hooks/useViewport';

type Chapter2SceneProps = {
  /** Current step (0 = tokenize, 1 = embeddings, 2 = pooling, 3 = similarity, 4 = merging) */
  currentStep: number;
  /** Whether the chapter is currently active */
  isActive: boolean;
  /** Callback to continue to next step */
  onContinue?: () => void;
};

// Number of candidate tweets to generate for vector space visualization
const CANDIDATE_COUNT = 12;

// Sample posts for Thunder and Phoenix streams (shown in final step)
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
  'Split your tweet into sub-token pieces so the model can digest each fragment...',
  'Each token becomes a dense vector that captures its semantic meaning...',
  'Pool token vectors into a single 128-dimensional tweet embedding...',
  'Your embedding floats in vector space. Posts with similar vectors gravitate toward you...',
  'Thunder brings posts from people you follow. Phoenix discovers content from strangers the AI thinks you\'ll like...'
];

const MOBILE_STEP_NARRATION = [
  'Split your tweet into sub-token pieces so the model can digest each fragment...',
  'Each token becomes a dense vector that captures its semantic meaning...',
  'Pool token vectors into a single 128-dimensional tweet embedding...',
  'Similar vectors drift closer to your tweet in embedding space...',
  'Thunder brings followers. Phoenix pulls in strangers the AI expects you\'ll like...'
];

const STEP_LABELS = [
  '2A: Tokenize Tweet',
  '2B: Token Embeddings',
  '2C: Pooling',
  '2D: Similarity Map',
  '2E: Merging Sources'
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
  isActive,
  onContinue
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

  // Tokenize the tweet text
  const tokens = tokenizeSubTokens(tweetText || 'Hello world');
  const tokenCount = tokens.length;

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
          const sim = cosinePreview(embedding, tweet.embedding);
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
  const narration = (isMobile ? MOBILE_STEP_NARRATION : STEP_NARRATION)[currentStep]
    ?? (isMobile ? MOBILE_STEP_NARRATION[0] : STEP_NARRATION[0]);

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
        <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
      </div>

      {/* Narration */}
      <div className={styles.narration}>
        <TypewriterText
          text={narration}
          started={isActive}
          speed={25}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      {/* Step Content */}
      {isMobile ? (
        <div className={styles.mobileContent}>
          {/* Step 0: Tokenization */}
          {currentStep === 0 && (
            <div className={styles.mobileStep}>
              <div className={styles.mobileStepHeader}>
                <span className={styles.mobileMeta}>Tokens: {tokenCount}</span>
              </div>
              <TokenDisplay
                tokens={tokens}
                maxVisible={12}
                isActive={isActive}
              />
            </div>
          )}

          {/* Step 1: Token Embeddings */}
          {currentStep === 1 && (
            <div className={styles.mobileStep}>
              <TokenEmbeddingAnim
                tokens={tokens}
                isActive={isActive}
              />
            </div>
          )}

          {/* Step 2: Pooling */}
          {currentStep === 2 && (
            <div className={styles.mobileStep}>
              {isLoading ? (
                <div className={styles.loading}>Computing embedding...</div>
              ) : (
                <PoolingViz
                  tokens={tokens}
                  embedding={userEmbedding}
                  isActive={isActive}
                />
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.mobileStep}>
              {isLoading ? (
                <div className={styles.loading}>Computing similarities...</div>
              ) : (
                <VectorSpace
                  userPoint={USER_POINT}
                  candidates={candidateData}
                  showSimilarity={false}
                  label="MAP OF SIMILAR TWEETS"
                  isActive={isActive}
                  userTweet={tweetText || 'Your tweet'}
                />
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.mobileStep}>
              <div className={styles.mobileStreamGrid}>
                <div className={styles.mobileStreamColumn}>
                  <div className={styles.mobileStreamTitle}>THUNDER</div>
                  {THUNDER_POSTS.map((post) => (
                    <div key={post.id} className={styles.mobileStreamItem}>
                      {post.preview}
                    </div>
                  ))}
                </div>
                <div className={styles.mobileStreamColumn}>
                  <div className={styles.mobileStreamTitle}>PHOENIX</div>
                  {PHOENIX_POSTS.map((post) => (
                    <div key={post.id} className={styles.mobileStreamItem}>
                      {post.preview}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.content}>
          {/* Step 0: Tokenization */}
          {currentStep === 0 && (
            <div className={styles.step}>
              <TokenDisplay
                tokens={tokens}
                maxVisible={20}
                isActive={isActive}
              />
            </div>
          )}

          {/* Step 1: Token Embeddings */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <TokenEmbeddingAnim
                tokens={tokens}
                isActive={isActive}
              />
            </div>
          )}

          {/* Step 2: Pooling */}
          {currentStep === 2 && (
            <div className={styles.step}>
              {isLoading ? (
                <div className={styles.loading}>Computing embedding...</div>
              ) : (
                <PoolingViz
                  tokens={tokens}
                  embedding={userEmbedding}
                  isActive={isActive}
                />
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.step}>
              {isLoading ? (
                <div className={styles.loading}>Computing similarities...</div>
              ) : (
                <VectorSpace
                  userPoint={USER_POINT}
                  candidates={candidateData}
                  showSimilarity={false}
                  label="MAP OF SIMILAR TWEETS"
                  isActive={isActive}
                  userTweet={tweetText || 'Your tweet'}
                />
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.step}>
              <CandidateStreams
                thunderPosts={THUNDER_POSTS}
                phoenixPosts={PHOENIX_POSTS}
                isActive={isActive}
              />
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
      {onContinue && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="crt-button px-8 py-3 text-sm tracking-widest"
            onClick={onContinue}
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
}
