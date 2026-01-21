import styles from '../../styles/probability-rack.module.css';

type ProbabilityItem = {
  id: string;
  label: string;
  probability: number;
};

type ProbabilityRackProps = {
  items: ProbabilityItem[];
  isActive?: boolean;
};

export default function ProbabilityRack({ items, isActive = true }: ProbabilityRackProps) {
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
        {items.map((item) => {
          const clamped = Math.max(0, Math.min(1, item.probability));
          return (
            <div key={item.id} className={styles.row}>
              <span className={styles.label}>{item.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${clamped * 100}%` }}
                />
              </div>
              <span className={styles.value}>{(clamped * 100).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>Higher bars imply stronger engagement odds.</div>
    </div>
  );
}
