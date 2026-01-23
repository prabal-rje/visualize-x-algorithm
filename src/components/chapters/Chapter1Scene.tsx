import styles from '../../styles/chapter1-scene.module.css';
import RequestVisualization from '../visualization/RequestVisualization';
import DataStream from '../visualization/DataStream';
import TypewriterText from '../visualization/TypewriterText';
import { useViewport } from '../../hooks/useViewport';

type Chapter1SceneProps = {
  /** Current step within the chapter (0 = gRPC call, 1 = hydration) */
  currentStep: number;
  /** Whether the chapter is currently active */
  isActive: boolean;
  /** User ID to display */
  userId: string;
  /** Callback to continue to next step */
  onContinue?: () => void;
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

const STEP_LABELS = ['1A: The gRPC Call', '1B: Query Hydration'];

const STEP_NARRATION = [
  'When you open X and pull down to refresh, a single gRPC request launches a cascade of computations...',
  'The server hydrates your query with engagement history and user features...'
];

const FEATURE_SUMMARY = [
  { label: 'Following', value: USER_FEATURES.followingCount.toLocaleString() },
  { label: 'Followers', value: USER_FEATURES.followerCount.toLocaleString() },
  { label: 'Account Age', value: `${USER_FEATURES.accountAgeDays}d` },
  { label: 'Verified', value: USER_FEATURES.verified ? 'Yes' : 'No' },
  { label: 'Premium', value: USER_FEATURES.premium ? 'Yes' : 'No' }
];

export default function Chapter1Scene({
  currentStep,
  isActive,
  userId,
  onContinue
}: Chapter1SceneProps) {
  const { isMobile } = useViewport();

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
        <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
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
      {isMobile ? (
        <div className={styles.mobileContent}>
          {currentStep === 0 && (
            <div className={styles.mobileStep}>
              <div className={styles.mobileVizFrame}>
                <RequestVisualization isActive={isActive} userId={userId} />
              </div>
              <div className={styles.mobileNote}>
                One request wakes the recommendation stack.
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.mobileStep}>
              <div className={styles.mobileGrid}>
                <div className={styles.mobileCard}>
                  <div className={styles.mobileCardTitle}>Engagement History</div>
                  <ul className={styles.mobileList}>
                    {ENGAGEMENT_HISTORY.map((item) => (
                      <li key={item.tweetId} className={styles.mobileListItem}>
                        <span className={styles.mobileListLabel}>{item.action}</span>
                        <span className={styles.mobileListMeta}>{item.timeAgo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.mobileCard}>
                  <div className={styles.mobileCardTitle}>User Features</div>
                  <div className={styles.mobileFeatures}>
                    {FEATURE_SUMMARY.map((feature) => (
                      <div key={feature.label} className={styles.mobileFeatureRow}>
                        <span className={styles.mobileFeatureLabel}>{feature.label}</span>
                        <span className={styles.mobileFeatureValue}>{feature.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.mobileNote}>
                History + metadata become the hydration payload.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.content}>
          {currentStep === 0 && (
            <div className={styles.step}>
              <RequestVisualization isActive={isActive} userId={userId} />
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.step}>
              <DataStream
                engagementHistory={ENGAGEMENT_HISTORY}
                userFeatures={USER_FEATURES}
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
