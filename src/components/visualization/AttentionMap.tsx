import styles from '../../styles/attention-map.module.css';

type AttentionItem = {
  id: string;
  label: string;
  weight: number;
};

type AttentionMapProps = {
  items: AttentionItem[];
  isActive?: boolean;
};

export default function AttentionMap({ items, isActive = true }: AttentionMapProps) {
  return (
    <div
      className={styles.container}
      data-testid="attention-map"
      data-active={isActive}
    >
      <div className={styles.header}>ATTENTION WEIGHTS</div>
      <div className={styles.rows}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <span className={styles.label}>{item.label}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.min(1, item.weight) * 100}%` }}
              />
            </div>
            <span className={styles.weight}>{item.weight.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
