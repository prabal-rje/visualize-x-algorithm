import styles from '../../styles/tokenization-flow.module.css';

type TokenizationFlowProps = {
  tweet: string;
  isActive?: boolean;
  maxTokens?: number;
};

function splitWord(word: string, size: number): string[] {
  const parts: string[] = [];
  for (let i = 0; i < word.length; i += size) {
    parts.push(word.slice(i, i + size));
  }
  return parts;
}

export function tokenizeSubTokens(text: string): string[] {
  const raw = text.match(/[A-Za-z0-9#@']+|[^\s]/g) ?? [];
  const tokens: string[] = [];
  let wordIndex = 0;
  for (const token of raw) {
    if (/^[A-Za-z0-9#@']+$/.test(token)) {
      const parts = splitWord(token, 3);
      parts.forEach((part, index) => {
        if (index === 0) {
          const prefix = wordIndex === 0 ? '^' : '_';
          tokens.push(`${prefix}${part}`);
        } else {
          tokens.push(part);
        }
      });
      wordIndex += 1;
    } else {
      tokens.push(token);
    }
  }
  return tokens;
}

export default function TokenizationFlow({
  tweet,
  isActive = true,
  maxTokens = 12
}: TokenizationFlowProps) {
  const rawTokens = tokenizeSubTokens(tweet || 'Your tweet here');
  const tokens = rawTokens.slice(0, maxTokens);
  const hasOverflow = rawTokens.length > maxTokens;
  const vectorPalette = [
    { fill: 'rgba(180, 20, 180, 0.35)', glow: 'rgba(180, 20, 180, 0.25)' },
    { fill: 'rgba(40, 50, 255, 0.35)', glow: 'rgba(40, 50, 255, 0.25)' },
    { fill: 'rgba(10, 200, 200, 0.35)', glow: 'rgba(10, 200, 200, 0.2)' },
    { fill: 'rgba(210, 255, 40, 0.32)', glow: 'rgba(210, 255, 40, 0.2)' },
    { fill: 'rgba(240, 170, 40, 0.32)', glow: 'rgba(240, 170, 40, 0.22)' },
    { fill: 'rgba(120, 220, 120, 0.32)', glow: 'rgba(120, 220, 120, 0.2)' }
  ];

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
          <div className={styles.tokenTotal} data-testid="token-total">
            TOTAL TOKENS: {rawTokens.length}
          </div>
        </div>

        <div className={styles.tokenStream} aria-hidden="true">
          {tokens.map((token, index) => (
            <span
              key={`${token}-ghost-${index}`}
              className={styles.tokenGhost}
              style={{
                animationDelay: `${index * 0.12}s`,
                top: `${(index % 4) * 10 - 14}px`
              }}
            >
              {token}
            </span>
          ))}
        </div>

        <div className={styles.pool}>
          <div className={styles.poolCore} />
          <div className={styles.poolRing} />
          <div className={styles.poolPulses} aria-hidden="true">
            {tokens.map((_, index) => (
              <span
                key={`pulse-${index}`}
                className={styles.poolPulse}
                data-testid="pool-pulse"
                style={{ animationDelay: `${index * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        <div className={styles.vector}>
          <div className={styles.sectionLabel}>128-D VECTOR</div>
          <div className={styles.vectorGrid} data-testid="vector-grid">
            {Array.from({ length: 128 }).map((_, index) => {
              const paletteIndex = (index * 7 + index % 3) % vectorPalette.length;
              const colors = vectorPalette[paletteIndex];
              return (
                <span
                  key={`cell-${index}`}
                  className={styles.vectorCell}
                  data-testid="token-vector-cell"
                  style={{
                    backgroundColor: colors.fill,
                    boxShadow: `0 0 8px ${colors.glow}`,
                    animationDelay: `${(index % 16) * 0.04}s`
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
