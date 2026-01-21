import { useMemo, useState } from 'react';
import styles from '../../styles/attention-map.module.css';

type AttentionItem = {
  id: string;
  label: string;
  weight: number;
  action?: string;
  tokens?: string[];
};

type AttentionMapProps = {
  items: AttentionItem[];
  isActive?: boolean;
  sourceTweet?: string;
};

export default function AttentionMap({
  items,
  isActive = true,
  sourceTweet
}: AttentionMapProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const defaultFocusId = useMemo(() => {
    if (items.length === 0) return null;
    return items.reduce((best, item) => (item.weight > best.weight ? item : best)).id;
  }, [items]);

  const focusId = activeId ?? defaultFocusId;
  const focusItem = items.find((item) => item.id === focusId) ?? items[0];
  const focusTokens = focusItem?.tokens ?? focusItem?.label.split(' ') ?? [];

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
      <div className={styles.rows} data-testid="attention-bars">
        {items.map((item, index) => {
          const clamped = Math.min(1, item.weight);
          const width = isActive ? `${clamped * 100}%` : '0%';
          return (
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
                style={{
                  width,
                  transitionDelay: `${index * 0.08}s`
                }}
              />
            </div>
            <span className={styles.weight}>{item.weight.toFixed(2)}</span>
          </div>
        );
        })}
      </div>

      {focusItem ? (
        <div className={styles.detail} data-testid="attention-detail">
          <div className={styles.detailHeader}>INSPECTED MEMORY</div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Action</span>
            <span className={styles.detailValue}>
              {focusItem.action ?? 'engaged'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Weight</span>
            <span className={styles.detailValue}>{focusItem.weight.toFixed(2)}</span>
          </div>
          {sourceTweet ? (
            <div className={styles.detailTweet}>
              <span className={styles.detailLabel}>Input tweet</span>
              <span className={styles.detailTweetText}>{sourceTweet}</span>
            </div>
          ) : null}
          <div className={styles.detailTokens}>
            <span className={styles.detailLabel}>Top tokens</span>
            <div className={styles.tokenList}>
              {focusTokens.slice(0, 6).map((token, index) => (
                <span key={`${token}-${index}`} className={styles.tokenChip}>
                  {token}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
