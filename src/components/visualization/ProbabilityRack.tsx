import styles from '../../styles/probability-rack.module.css';

type ProbabilityItem = {
  id: string;
  label: string;
  probability: number;
  weight?: number;
};

type ProbabilityRackProps = {
  items: ProbabilityItem[];
  isActive?: boolean;
};

export default function ProbabilityRack({ items, isActive = true }: ProbabilityRackProps) {
  const weightedSum = items.reduce((sum, item) => {
    const weight = item.weight ?? 1;
    return sum + item.probability * weight;
  }, 0);

  return (
    <div
      className={styles.container}
      data-testid="probability-rack"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.title}>P(action | embedding)</span>
        <span className={styles.subhead}>Estimated from embedding similarity</span>
      </div>
      <div className={styles.rows}>
        {items.map((item, index) => {
          const clamped = Math.max(0, Math.min(1, item.probability));
          const weight = item.weight ?? 1;
          const contribution = clamped * weight;
          const width = isActive ? `${clamped * 100}%` : '0%';
          return (
            <div key={item.id} className={styles.row}>
              <span className={styles.label}>{item.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width, transitionDelay: `${index * 0.08}s` }}
                />
              </div>
              <span className={styles.value}>{(clamped * 100).toFixed(1)}%</span>
              <span className={styles.weight}>x{weight.toFixed(2)}</span>
              <span className={styles.contribution}>{contribution.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <span>Weighted sum</span>
        <span className={styles.sumValue} data-testid="probability-weighted-sum">
          {weightedSum.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
