import { useEffect } from 'react';
import styles from '../../styles/engagement-cascade.module.css';
import { playEngagementPing } from '../../audio/engine';

type EngagementStat = {
  id: string;
  label: string;
  predicted: number;
  actual: number;
};

type EngagementCascadeProps = {
  stats: EngagementStat[];
  isActive?: boolean;
};

export default function EngagementCascade({
  stats,
  isActive = true
}: EngagementCascadeProps) {
  useEffect(() => {
    if (!isActive) return undefined;
    let index = 0;
    const timer = window.setInterval(() => {
      const pan = index % 5 / 2 - 1;
      void playEngagementPing(pan);
      index += 1;
    }, 480);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const nodes = Array.from({ length: 18 });
  const totalPredicted = stats.reduce((sum, item) => sum + item.predicted, 0);
  const totalActual = stats.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div
      className={styles.container}
      data-testid="engagement-cascade"
      data-active={isActive}
    >
      <div className={styles.header}>ENGAGEMENT CASCADE</div>
      <div className={styles.network}>
        {nodes.map((_, index) => (
          <span
            key={index}
            className={styles.node}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </div>
      <div className={styles.stats}>
        {stats.map((item) => (
          <div key={item.id} className={styles.statRow}>
            <span className={styles.statLabel}>{item.label}</span>
            <span className={styles.predicted}>Pred {item.predicted}</span>
            <span className={styles.actual}>Actual {item.actual}</span>
          </div>
        ))}
      </div>
      <div className={styles.totals}>
        <span>Predicted Total</span>
        <span>{totalPredicted}</span>
        <span>Actual Total</span>
        <span>{totalActual}</span>
      </div>
    </div>
  );
}
