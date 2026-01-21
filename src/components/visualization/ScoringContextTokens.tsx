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
  const iconMap: Record<string, JSX.Element> = {
    liked: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 20.6 4.6 12.9C2.4 10.6 2.5 7 4.9 5c2-1.6 4.8-1 6.4 1.2L12 7.3l0.7-1.1c1.6-2.2 4.4-2.8 6.4-1.2 2.4 2 2.5 5.6 0.3 7.9L12 20.6z"
        />
      </svg>
    ),
    replied: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <polyline
          points="10 6 4 12 10 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    reposted: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <polyline
          points="7 4 3 8 7 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="17 12 21 16 17 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 8h10a4 4 0 0 1 4 4v1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 16H11a4 4 0 0 1-4-4v-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  };

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
            <span className={styles.action} data-action={token.action}>
              {iconMap[token.action] ? (
                <>
                  <span
                    className={styles.icon}
                    data-testid={`action-icon-${token.action}`}
                    aria-hidden="true"
                  >
                    {iconMap[token.action]}
                  </span>
                  <span className={styles.srOnly}>{token.action}</span>
                </>
              ) : (
                token.action
              )}
            </span>
            <span className={styles.text}>{token.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
