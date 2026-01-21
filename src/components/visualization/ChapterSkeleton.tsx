import styles from '../../styles/chapter-skeleton.module.css';

export default function ChapterSkeleton() {
  return (
    <div
      className={styles.container}
      data-testid="chapter-skeleton"
      aria-hidden="true"
    >
      <div className={styles.header}>
        <span className={styles.pill} />
        <span className={styles.title} />
      </div>
      <div className={styles.narration}>
        <span className={styles.line} />
        <span className={styles.line} />
      </div>
      <div className={styles.grid}>
        <span className={styles.card} />
        <span className={styles.card} />
        <span className={styles.card} />
      </div>
    </div>
  );
}
