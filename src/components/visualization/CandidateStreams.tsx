import styles from '../../styles/candidate-streams.module.css';

type PostPreview = {
  id: string;
  preview: string;
};

type CandidateStreamsProps = {
  /** Thunder posts (in-network from followed accounts) */
  thunderPosts: PostPreview[];
  /** Phoenix posts (out-of-network AI recommendations) */
  phoenixPosts: PostPreview[];
  /** Whether the animation is active */
  isActive?: boolean;
};

export default function CandidateStreams({
  thunderPosts,
  phoenixPosts,
  isActive = true
}: CandidateStreamsProps) {
  return (
    <div
      className={styles.container}
      data-testid="candidate-streams"
      data-active={isActive}
    >
      {/* Thunder Stream - In-Network (Blue) */}
      <div className={styles.stream} data-testid="thunder-stream">
        <div className={styles.header}>
          <span className={styles.label}>THUNDER</span>
          <span className={styles.sublabel}>In-Network</span>
        </div>
        <div className={styles.divider} data-source="thunder" />
        <div className={styles.posts}>
          {thunderPosts.map((post, index) => (
            <div
              key={post.id}
              className={`${styles.post} ${styles.thunderPost}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <span className={styles.postPreview}>{post.preview}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center merge indicator */}
      <div className={styles.mergeIndicator}>
        <div className={styles.mergeArrow} data-source="thunder" />
        <div className={styles.mergeCenter}>
          <span className={styles.mergeLabel}>CANDIDATE_POOL</span>
        </div>
        <div className={styles.mergeArrow} data-source="phoenix" />
      </div>

      {/* Phoenix Stream - Out-of-Network (Orange) */}
      <div className={styles.stream} data-testid="phoenix-stream">
        <div className={styles.header}>
          <span className={styles.label}>PHOENIX</span>
          <span className={styles.sublabel}>Out-of-Network</span>
        </div>
        <div className={styles.divider} data-source="phoenix" />
        <div className={styles.posts}>
          {phoenixPosts.map((post, index) => (
            <div
              key={post.id}
              className={`${styles.post} ${styles.phoenixPost}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <span className={styles.postPreview}>{post.preview}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
