import { useEffect } from 'react';
import styles from '../../styles/data-stream.module.css';
import { playDataChirp, setDataDrone } from '../../audio/engine';

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
  useEffect(() => {
    if (!isActive) return undefined;
    void setDataDrone(true);
    const timer = window.setInterval(() => {
      void playDataChirp();
    }, 700);

    return () => {
      window.clearInterval(timer);
      void setDataDrone(false);
    };
  }, [isActive]);

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
        <div
          className={styles.emojiFlow}
          data-testid="engagement-emoji-flow"
          aria-hidden="true"
        >
          <span className={styles.emojiBubble}>
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <path
                d="M12 20s-6.5-4.35-8.7-8.02C1.8 9.2 3.35 6 6.5 6c1.86 0 3.1 1.04 3.8 2.2C11 7.04 12.24 6 14.1 6c3.15 0 4.7 3.2 3.2 5.98C18.5 15.65 12 20 12 20z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className={styles.emojiBubble}>
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <path
                d="M6 8h9V5l5 5-5 5v-3H8c-2.21 0-4 1.79-4 4v3h2v-3c0-1.1.9-2 2-2h7v-3l5 5-5 5v-3H6V8z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className={styles.emojiBubble}>
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <path
                d="M4 4h16v11H7l-3 3V4zm4 4h8v2H8V8zm0 4h5v2H8v-2z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
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
          <div className={styles.avatarRow}>
            <div className={styles.avatar} data-testid="user-profile-avatar">
              <span className={styles.avatarLabel}>YOU</span>
            </div>
            <div className={styles.avatarMeta}>
              <span className={styles.avatarName}>Operator</span>
              <span className={styles.avatarRole}>Algorithm Runner</span>
            </div>
          </div>
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
