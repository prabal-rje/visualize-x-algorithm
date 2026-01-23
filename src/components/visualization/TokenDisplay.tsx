import styles from '../../styles/token-display.module.css';

type TokenDisplayProps = {
  tokens: string[];
  maxVisible?: number;
  isActive?: boolean;
};

export default function TokenDisplay({
  tokens,
  maxVisible = 20,
  isActive = true
}: TokenDisplayProps) {
  const visibleTokens = tokens.slice(0, maxVisible);
  const hasOverflow = tokens.length > maxVisible;

  return (
    <div
      className={styles.container}
      data-testid="token-display"
      data-active={isActive}
    >
      <div className={styles.tokenGrid}>
        {visibleTokens.map((token, index) => (
          <span
            key={`${token}-${index}`}
            className={styles.token}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {token}
          </span>
        ))}
        {hasOverflow && (
          <span className={styles.overflow}>...</span>
        )}
      </div>
      <div className={styles.count}>
        TOKENS: {tokens.length}
      </div>
    </div>
  );
}
