import { useEffect, useState } from 'react';
import styles from '../../styles/chapter2-scene.module.css';
import { getEmbedding, isInitialized } from '../../ml/embeddings';
import { cosinePreview } from '../../ml/similarity';
import { generateTweetPool, type TweetCandidate } from '../../ml/tweetPool';
import { useConfigStore } from '../../stores/config';
import EmbeddingHeatmap from '../visualization/EmbeddingHeatmap';
import VectorSpace from '../visualization/VectorSpace';
import CandidateStreams from '../visualization/CandidateStreams';
import TypewriterText from '../visualization/TypewriterText';
import TokenizationFlow, { tokenizeSubTokens } from '../visualization/TokenizationFlow';
import { useViewport } from '../../hooks/useViewport';

type Chapter2SceneProps = {
  /** Current step (0 = tokenize, 1 = embeddings, 2 = pooling, 3 = placement, 4 = similarity, 5 = merging) */
  currentStep: number;
  /** Whether the chapter is currently active */
  isActive: boolean;
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
  'Candidates get placed one by one based on cosine proximity to your embedding...',
  'Your embedding floats in vector space. Posts with similar vectors gravitate toward you...',
  'Thunder brings posts from people you follow. Phoenix discovers content from strangers the AI thinks you\'ll like...'
];

const MOBILE_STEP_NARRATION = [
  'Tokenize, embed, and pool the tweet into a retrieval signal...',
  'Candidates get placed one by one based on cosine proximity...',
  'Similar vectors drift closer to your tweet in embedding space...',
  'Thunder brings followers. Phoenix pulls in strangers the AI expects you\'ll like...'
];

const STEP_LABELS = [
  '2A: Tokenize Tweet',
  '2B: Token Embeddings',
  '2C: Pooling',
  '2D: Placement Pass',
  '2E: Similarity Map',
  '2F: Merging Sources'
];

const ENCODING_STAGES = [
  {
    id: 'token',
    label: 'Tokenize',
    hint: 'Split your tweet into sub-token pieces.'
  },
  {
    id: 'embed',
    label: 'Token Embeddings',
    hint: 'Embed each token into a latent vector.'
  },
  {
    id: 'pool',
    label: 'Pooling',
    hint: 'Pool token vectors into one signal.'
  }
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
  const tokenCount = tokenizeSubTokens(tweetText || 'Hello world').length;
  const encodingStage = Math.min(currentStep, 2);

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
  const topCandidates = [...candidateData]
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, isMobile ? 6 : 8);

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
          {currentStep === 0 && (
            <div className={styles.mobileStep}>
              <div className={styles.mobileStepHeader}>
                <div className={styles.stepLabel}>{STEP_LABELS[0]}</div>
                <span className={styles.mobileMeta}>Tokens: {tokenCount}</span>
              </div>
              {isLoading ? (
                <div className={styles.loading}>Computing embedding...</div>
              ) : (
                <div className={styles.mobileEncoding}>
                  <div className={styles.mobileStageList}>
                    {ENCODING_STAGES.map((stage, index) => (
                      <div
                        key={stage.id}
                        className={styles.mobileStageRow}
                        data-active={encodingStage === index}
                        data-complete={encodingStage > index}
                      >
                        <span className={styles.mobileStageIndex}>{index + 1}</span>
                        <div>
                          <div className={styles.mobileStageLabel}>{stage.label}</div>
                          <div className={styles.mobileStageHint}>{stage.hint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.mobileEncodingVisuals}>
                    <TokenizationFlow
                      tweet={tweetText}
                      isActive={isActive}
                      maxTokens={maxTokens}
                      stage={encodingStage}
                    />
                    {encodingStage >= 1 && (
                      <div className={styles.mobileEmbedding}>
                        <EmbeddingHeatmap
                          embedding={userEmbedding}
                          label="TWEET EMBEDDING"
                          isActive={isActive}
                          tokenCount={tokenCount}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.mobileStep} data-testid="placement-stage">
              <div className={styles.stepLabel}>{STEP_LABELS[1]}</div>
              {isLoading ? (
                <div className={styles.loading}>Computing similarities...</div>
              ) : (
                <div className={styles.mobileListPanel}>
                  {topCandidates.map((candidate) => (
                    <div key={candidate.text} className={styles.mobileCandidateRow}>
                      <div className={styles.mobileCandidateHeader}>
                        <span>{candidate.label}</span>
                        <span>{Math.round(candidate.similarity * 100)}%</span>
                      </div>
                      <div className={styles.mobileCandidateBar}>
                        <div
                          className={styles.mobileCandidateFill}
                          style={{ width: `${candidate.similarity * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className={styles.mobileNote}>
                    Candidates slot in before the similarity reveal.
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.mobileStep}>
              <div className={styles.stepLabel}>{STEP_LABELS[2]}</div>
              {isLoading ? (
                <div className={styles.loading}>Computing similarities...</div>
              ) : (
                <div className={styles.mobileListPanel}>
                  <div className={styles.mobileLegend}>
                    <span className={styles.mobileLegendLabel}>Your Tweet</span>
                    <span className={styles.mobileLegendValue}>Anchor point</span>
                  </div>
                  {topCandidates.map((candidate) => (
                    <div key={candidate.text} className={styles.mobileCandidateRow}>
                      <div className={styles.mobileCandidateHeader}>
                        <span>{candidate.label}</span>
                        <span>{Math.round(candidate.similarity * 100)}%</span>
                      </div>
                      <div className={styles.mobileCandidateBar}>
                        <div
                          className={styles.mobileCandidateFill}
                          style={{ width: `${candidate.similarity * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className={styles.mobileNote}>
                    Closer dots share higher semantic similarity.
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.mobileStep}>
              <div className={styles.stepLabel}>{STEP_LABELS[3]}</div>
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
          {currentStep === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>{STEP_LABELS[0]}</div>
              {isLoading ? (
                <div className={styles.loading}>Computing embedding...</div>
              ) : (
                <>
                  <div className={styles.encodingGrid}>
                    <div className={styles.stageRail}>
                      {ENCODING_STAGES.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={styles.stageCard}
                          data-testid={`${stage.id}-stage`}
                          data-active={encodingStage === index}
                          data-complete={encodingStage > index}
                        >
                          <span className={styles.stageIndex}>
                            {index + 1}
                          </span>
                          <div className={styles.stageText}>
                            <div className={styles.stageLabel}>{stage.label}</div>
                            <div className={styles.stageHint}>{stage.hint}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.stageContent}>
                      <TokenizationFlow
                        tweet={tweetText}
                        isActive={isActive}
                        maxTokens={maxTokens}
                        stage={encodingStage}
                      />
                      {encodingStage === 1 && (
                        <EmbeddingHeatmap
                          embedding={userEmbedding}
                          label="TWEET EMBEDDING"
                          isActive={isActive}
                          tokenCount={tokenCount}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.step} data-testid="placement-stage">
              <div className={styles.stepLabel}>{STEP_LABELS[1]}</div>
              {isLoading ? (
                <div className={styles.loading}>Computing similarities...</div>
              ) : (
                <>
                  <VectorSpace
                    userPoint={USER_POINT}
                    candidates={candidateData}
                    showSimilarity={false}
                    label="PLACEMENT PASS"
                    isActive={isActive}
                    userTweet={tweetText || 'Your tweet'}
                  />
                  <div className={styles.placementNote}>
                    First place candidates, then reveal the similarity map.
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>{STEP_LABELS[2]}</div>
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
                    userTweet={tweetText || 'Your tweet'}
                  />
                </>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>{STEP_LABELS[3]}</div>
              <CandidateStreams
                thunderPosts={THUNDER_POSTS}
                phoenixPosts={PHOENIX_POSTS}
                isActive={isActive}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
