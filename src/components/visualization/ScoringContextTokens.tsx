import styles from '../../styles/scoring-context.module.css';

type ContextToken = {
  id: string;
  action: string;
  text: string;
  weight: number;
};

type ScoringContextTokensProps = {
  tokens: ContextToken[];
  isActive?: boolean;
};

export default function ScoringContextTokens({
  tokens,
  isActive = true
}: ScoringContextTokensProps) {
  return (
    <div
      className={styles.container}
      data-testid="scoring-context"
      data-active={isActive}
    >
      <div className={styles.header}>ENGAGEMENT CONTEXT</div>
      <div className={styles.tokenList}>
        {tokens.map((token) => (
          <div
            key={token.id}
            className={styles.token}
            style={{ opacity: 0.6 + Math.min(token.weight, 1) * 0.4 }}
          >
            <span className={styles.action}>{token.action}</span>
            <span className={styles.text}>{token.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
