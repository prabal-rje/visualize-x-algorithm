import styles from '../../styles/topk-selector.module.css';

type Candidate = {
  id: string;
  label: string;
  score: number;
};

type TopKSelectorProps = {
  candidates: Candidate[];
  topK: number;
  isActive?: boolean;
};

export default function TopKSelector({
  candidates,
  topK,
  isActive = true
}: TopKSelectorProps) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const selectedIds = new Set(sorted.slice(0, topK).map((c) => c.id));

  return (
    <div
      className={styles.container}
      data-testid="topk-selector"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.title}>TOP {topK} SELECTION</span>
        <span className={styles.subtitle}>SORT + PICK</span>
      </div>
      <div className={styles.list}>
        {sorted.map((candidate, index) => (
          <div
            key={candidate.id}
            className={`${styles.row} ${selectedIds.has(candidate.id) ? styles.selected : ''}`.trim()}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <span className={styles.rank}>#{index + 1}</span>
            <span className={styles.label}>{candidate.label}</span>
            <span className={styles.score}>{candidate.score.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className={styles.visibility}>
        <span>VISIBILITY FILTER</span>
        <span className={styles.pass}>PASS</span>
      </div>
    </div>
  );
}
