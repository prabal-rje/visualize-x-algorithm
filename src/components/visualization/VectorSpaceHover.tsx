import styles from '../../styles/vector-space-hover.module.css';

type VectorSpaceHoverProps = {
  tweet: string;
  similarity: number;
  label?: string;
};

export default function VectorSpaceHover({
  tweet,
  similarity,
  label = 'HOVERED TWEET'
}: VectorSpaceHoverProps) {
  return (
    <div className={styles.container} data-testid="vector-space-hover">
      <div className={styles.label}>{label}</div>
      <div className={styles.tweet}>{tweet}</div>
      <div className={styles.meta}>
        <span className={styles.metaLabel}>Similarity</span>
        <span className={styles.metaValue}>{similarity.toFixed(2)}</span>
      </div>
    </div>
  );
}
