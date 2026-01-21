import styles from '../../styles/request-visualization.module.css';

type RequestVisualizationProps = {
  /** Whether the animation is active */
  isActive: boolean;
  /** User ID to display */
  userId?: string;
};

export default function RequestVisualization({
  isActive,
  userId
}: RequestVisualizationProps) {
  return (
    <div
      className={styles.container}
      data-testid="request-visualization"
      data-active={isActive}
    >
      {/* Phone Icon */}
      <div className={styles.phone} data-testid="request-phone">
        <div className={styles.phoneScreen}>
          <div className={styles.phoneNotch} />
          {userId && <span className={styles.userId}>USER_ID: {userId}</span>}
        </div>
      </div>

      {/* Request Line */}
      <div className={styles.line} data-testid="request-line">
        <svg viewBox="0 0 200 20" className={styles.lineSvg}>
          <line
            x1="0"
            y1="10"
            x2="200"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <polygon points="195,5 200,10 195,15" fill="currentColor" />
        </svg>

        {/* Animated Packet */}
        {isActive && (
          <div className={styles.packet} data-testid="request-packet">
            <span className={styles.packetBinary}>01010011</span>
          </div>
        )}
      </div>

      {/* Server Icon */}
      <div className={styles.server} data-testid="request-server">
        <div className={styles.serverRack}>
          <div className={styles.serverUnit}>
            <span className={styles.serverLight} />
            <span className={styles.serverLight} />
            <span className={styles.serverLight} />
          </div>
          <div className={styles.serverUnit}>
            <span className={styles.serverLight} />
            <span className={styles.serverLight} />
            <span className={styles.serverLight} />
          </div>
        </div>
        <span className={styles.serverLabel}>HOME-MIXER</span>
      </div>
    </div>
  );
}
