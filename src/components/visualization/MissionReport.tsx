import { badgeForPercentile } from '../../utils/rpgStats';
import styles from '../../styles/mission-report.module.css';

export type MissionReportProps = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
  onReplay: () => void;
};

const MissionReport = ({
  reach,
  resonance,
  momentum,
  percentile,
  onReplay
}: MissionReportProps) => {
  const badge = badgeForPercentile(percentile);
  const formattedResonance = resonance.toFixed(2);
  const formattedMomentum = `${momentum.toFixed(1)}%`;

  return (
    <div className={styles.report} data-testid="mission-report">
      <h2 className={styles.title}>Mission Report</h2>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Reach</span>
          <span className={styles.statValue}>{reach}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Resonance</span>
          <span className={styles.statValue}>{formattedResonance}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Momentum</span>
          <span className={styles.statValue}>{formattedMomentum}</span>
        </div>
      </div>

      <div className={styles.badgeSection}>
        <span className={styles.badgeLabel}>Rank</span>
        <span className={styles.badge}>{badge}</span>
      </div>

      <button className={styles.replayButton} onClick={onReplay}>
        Run Another Simulation
      </button>
    </div>
  );
};

export default MissionReport;
