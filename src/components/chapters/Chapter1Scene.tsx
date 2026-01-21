import styles from '../../styles/chapter1-scene.module.css';
import RequestVisualization from '../visualization/RequestVisualization';
import DataStream from '../visualization/DataStream';
import TypewriterText from '../visualization/TypewriterText';

type Chapter1SceneProps = {
  /** Current step within the chapter (0 = gRPC call, 1 = hydration) */
  currentStep: number;
  /** Whether the chapter is currently active */
  isActive: boolean;
  /** User ID to display */
  userId: string;
};

// Sample engagement history data
const ENGAGEMENT_HISTORY = [
  { action: 'liked' as const, tweetId: 'tweet_39284', timeAgo: '2m ago' },
  { action: 'liked' as const, tweetId: 'tweet_28371', timeAgo: '5m ago' },
  { action: 'replied' as const, tweetId: 'tweet_19283', timeAgo: '8m ago' },
  { action: 'reposted' as const, tweetId: 'tweet_48271', timeAgo: '1h ago' },
  { action: 'liked' as const, tweetId: 'tweet_58392', timeAgo: '2h ago' }
];

// Sample user features data
const USER_FEATURES = {
  followingCount: 847,
  followerCount: 12394,
  accountAgeDays: 2847,
  verified: false,
  premium: true
};

const STEP_NARRATION = [
  'When you open X and pull down to refresh, a single gRPC request launches a cascade of computations...',
  'The server hydrates your query with engagement history and user features...'
];

export default function Chapter1Scene({
  currentStep,
  isActive,
  userId
}: Chapter1SceneProps) {
  return (
    <div
      className={styles.container}
      data-testid="chapter-1-scene"
      data-active={isActive}
    >
      {/* Chapter Header */}
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 1</span>
        <h2 className={styles.title}>THE REQUEST</h2>
      </div>

      {/* Narration */}
      <div className={styles.narration}>
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={30}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      {/* Step Content */}
      <div className={styles.content}>
        {currentStep === 0 && (
          <div className={styles.step}>
            <div className={styles.stepLabel}>1A: The gRPC Call</div>
            <RequestVisualization isActive={isActive} userId={userId} />
          </div>
        )}

        {currentStep === 1 && (
          <div className={styles.step}>
            <div className={styles.stepLabel}>1B: Query Hydration</div>
            <DataStream
              engagementHistory={ENGAGEMENT_HISTORY}
              userFeatures={USER_FEATURES}
              isActive={isActive}
            />
          </div>
        )}
      </div>

      {/* Function Panel Reference */}
      <div className={styles.functionRef}>
        <span className={styles.funcLabel}>FUNCTION:</span>
        <code className={styles.funcName}>
          {currentStep === 0
            ? 'ScoredPostsService::get_scored_posts()'
            : 'UserActionSequenceHydrator::hydrate()'}
        </code>
      </div>
    </div>
  );
}
