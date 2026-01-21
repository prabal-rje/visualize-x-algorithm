import styles from '../../styles/tokenization-flow.module.css';

type TokenizationFlowProps = {
  tweet: string;
  isActive?: boolean;
  maxTokens?: number;
};

function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export default function TokenizationFlow({
  tweet,
  isActive = true,
  maxTokens = 10
}: TokenizationFlowProps) {
  const rawTokens = tokenize(tweet || 'Your tweet here');
  const tokens = rawTokens.slice(0, maxTokens);
  const hasOverflow = rawTokens.length > maxTokens;

  return (
    <div
      className={styles.container}
      data-testid="tokenization-flow"
      data-active={isActive}
    >
      <div className={styles.header}>TOKENIZATION</div>
      <div className={styles.flow}>
        <div className={styles.tokens}>
          <div className={styles.sectionLabel}>TOKENS</div>
          <div className={styles.tokenList}>
            {tokens.map((token, index) => (
              <span
                key={`${token}-${index}`}
                className={styles.token}
                data-testid="token-chip"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {token}
              </span>
            ))}
            {hasOverflow && <span className={styles.tokenEllipsis}>…</span>}
          </div>
        </div>

        <div className={styles.pool}>
          <div className={styles.poolLabel}>MEAN POOL</div>
          <div className={styles.poolCore} />
          <div className={styles.poolRing} />
        </div>

        <div className={styles.vector}>
          <div className={styles.sectionLabel}>128-D VECTOR</div>
          <div className={styles.vectorGrid} data-testid="vector-grid">
            {Array.from({ length: 128 }).map((_, index) => (
              <span
                key={`cell-${index}`}
                className={styles.vectorCell}
                style={{ animationDelay: `${(index % 16) * 0.04}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
