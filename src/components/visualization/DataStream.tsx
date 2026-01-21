import styles from '../../styles/data-stream.module.css';

type EngagementItem = {
  action: 'liked' | 'replied' | 'reposted';
  tweetId: string;
  timeAgo: string;
};

type UserFeatures = {
  followingCount: number;
  followerCount: number;
  accountAgeDays: number;
  verified: boolean;
  premium: boolean;
};

type DataStreamProps = {
  /** Engagement history items */
  engagementHistory: EngagementItem[];
  /** User profile features */
  userFeatures: UserFeatures;
  /** Whether the animation is active */
  isActive: boolean;
};

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export default function DataStream({
  engagementHistory,
  userFeatures,
  isActive
}: DataStreamProps) {
  return (
    <div
      className={styles.container}
      data-testid="data-stream"
      data-active={isActive}
    >
      {/* Left Stream: Engagement History */}
      <div className={styles.stream} data-testid="data-stream-left">
        <div className={styles.header}>ENGAGEMENT_HISTORY</div>
        <div className={styles.divider} />
        <div className={styles.content}>
          {engagementHistory.map((item, index) => (
            <div key={index} className={styles.item}>
              <span className={styles.action}>
                {item.action}: {item.tweetId}
              </span>
              <span className={styles.meta}>({item.timeAgo})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Stream: User Features */}
      <div className={styles.stream} data-testid="data-stream-right">
        <div className={styles.header}>USER_PROFILE</div>
        <div className={styles.divider} />
        <div className={styles.content}>
          <div className={styles.item}>
            <span>following_count: {formatNumber(userFeatures.followingCount)}</span>
          </div>
          <div className={styles.item}>
            <span>follower_count: {formatNumber(userFeatures.followerCount)}</span>
          </div>
          <div className={styles.item}>
            <span>account_age: {userFeatures.accountAgeDays} days</span>
          </div>
          <div className={styles.item}>
            <span>verified: {String(userFeatures.verified)}</span>
          </div>
          <div className={styles.item}>
            <span>premium: {String(userFeatures.premium)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
