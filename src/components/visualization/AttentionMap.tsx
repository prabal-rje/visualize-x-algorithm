import { useMemo, useState } from 'react';
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const defaultFocusId = useMemo(() => {
    if (items.length === 0) return null;
    return items.reduce((best, item) => (item.weight > best.weight ? item : best)).id;
  }, [items]);

  const focusId = activeId ?? defaultFocusId;

  return (
    <div
      className={styles.container}
      data-testid="attention-map"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span>ATTENTION WEIGHTS</span>
        <span className={styles.helper}>Hover to inspect</span>
      </div>
      <div className={styles.rows}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.row}
            data-active={item.id === focusId}
            data-testid={`attention-row-${item.id}`}
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(item.id)}
            onBlur={() => setActiveId(null)}
            tabIndex={0}
            aria-label={`Attention ${item.label}`}
          >
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
