import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/pooling-viz.module.css';
import EmbeddingHeatmap from './EmbeddingHeatmap';

type PoolingVizProps = {
  tokens: string[];
  embedding: number[];
  isActive?: boolean;
};

// Small matrix: 4x2 = 8 cells
const SMALL_COLS = 4;
const SMALL_ROWS = 2;
const SMALL_CELLS = SMALL_COLS * SMALL_ROWS;

function valueToColor(value: number): string {
  const t = (value + 1) / 2;

  let r: number, g: number, b: number;

  if (t < 0.25) {
    const s = t / 0.25;
    r = Math.round(180 - s * 140);
    g = Math.round(20 + s * 30);
    b = Math.round(180 + s * 75);
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    r = Math.round(40 - s * 30);
    g = Math.round(50 + s * 180);
    b = Math.round(255 - s * 55);
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    r = Math.round(10 + s * 200);
    g = Math.round(230 + s * 25);
    b = Math.round(200 - s * 180);
  } else {
    const s = (t - 0.75) / 0.25;
    r = Math.round(210 + s * 45);
    g = Math.round(255 - s * 100);
    b = Math.round(20 - s * 10);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

function generateRandomColors(): string[] {
  return Array.from({ length: SMALL_CELLS }, () => {
    const value = Math.random() * 2 - 1;
    return valueToColor(value);
  });
}

type TokenVectorState = {
  tokenIndex: number;
  colors: string[];
};

export default function PoolingViz({
  tokens,
  embedding,
  isActive = true
}: PoolingVizProps) {
  const matrixCount = Math.min(tokens.length, 3);
  const [vectorStates, setVectorStates] = useState<TokenVectorState[]>(() =>
    Array.from({ length: matrixCount }, (_, i) => ({
      tokenIndex: i,
      colors: generateRandomColors()
    }))
  );
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    if (!isActive || tokens.length === 0) return;

    // Clear existing intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    // Each matrix cycles through tokens at different rates (offset phases)
    const baseInterval = 1200;

    for (let i = 0; i < matrixCount; i++) {
      const interval = setInterval(() => {
        setVectorStates((prev) => {
          const newStates = [...prev];
          const current = newStates[i];
          newStates[i] = {
            tokenIndex: (current.tokenIndex + matrixCount) % tokens.length,
            colors: generateRandomColors()
          };
          return newStates;
        });
      }, baseInterval + i * 300); // Offset each matrix

      intervalsRef.current.push(interval);
    }

    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, [isActive, tokens.length, matrixCount]);

  // Reset states when token count changes
  useEffect(() => {
    setVectorStates(
      Array.from({ length: matrixCount }, (_, i) => ({
        tokenIndex: i % tokens.length,
        colors: generateRandomColors()
      }))
    );
  }, [tokens.length, matrixCount]);

  if (tokens.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.container}
      data-testid="pooling-viz"
      data-active={isActive}
    >
      <div className={styles.layout}>
        {/* Left side: Token vectors */}
        <div className={styles.tokenVectors}>
          <div className={styles.vectorLabel}>TOKEN VECTORS</div>
          <div className={styles.vectorList}>
            {vectorStates.map((state, idx) => (
              <div key={idx} className={styles.vectorRow}>
                <span className={styles.vectorToken}>
                  {tokens[state.tokenIndex] || ''}
                </span>
                <div
                  className={styles.smallMatrix}
                  style={{
                    gridTemplateColumns: `repeat(${SMALL_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${SMALL_ROWS}, 1fr)`
                  }}
                >
                  {state.colors.map((color, cellIdx) => (
                    <div
                      key={cellIdx}
                      className={styles.smallCell}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className={styles.arrowColumn}>
          <div className={styles.pulsingArrow}>
            <span className={styles.arrowGlyph}>&rArr;</span>
          </div>
        </div>

        {/* Right side: Final embedding */}
        <div className={styles.finalEmbedding}>
          <EmbeddingHeatmap
            embedding={embedding}
            label="POOLED EMBEDDING"
            isActive={isActive}
          />
        </div>
      </div>
    </div>
  );
}
