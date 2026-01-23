import { useState, useEffect } from 'react';
import styles from '../../styles/request-visualization.module.css';

type RequestVisualizationProps = {
  /** Whether the animation is active */
  isActive: boolean;
  /** User ID to display */
  userId?: string;
};

// Generate random 8-bit binary string
function randomBinary(): string {
  return Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('');
}

export default function RequestVisualization({
  isActive,
  userId
}: RequestVisualizationProps) {
  const [binarySequence, setBinarySequence] = useState(randomBinary());

  // Animate binary sequence when active
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBinarySequence(randomBinary());
    }, 150); // Change every 150ms
    return () => clearInterval(interval);
  }, [isActive]);

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
          {userId && (
            <div className={styles.userIdContainer}>
              <span className={styles.userIdLabel}>USER_ID</span>
              <span className={styles.userIdValue}>{userId}</span>
            </div>
          )}
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
            <span className={styles.packetBinary}>{binarySequence}</span>
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
