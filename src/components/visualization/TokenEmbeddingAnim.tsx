import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/token-embedding-anim.module.css';

type TokenEmbeddingAnimProps = {
  tokens: string[];
  isActive?: boolean;
};

// 8x4 grid = 32 cells for the small matrix
const GRID_COLS = 8;
const GRID_ROWS = 4;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

// Color palette (same as EmbeddingHeatmap but we'll generate random values)
function valueToColor(value: number): string {
  const t = (value + 1) / 2; // Map -1..1 to 0..1

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
  return Array.from({ length: TOTAL_CELLS }, () => {
    const value = Math.random() * 2 - 1; // -1 to 1
    return valueToColor(value);
  });
}

export default function TokenEmbeddingAnim({
  tokens,
  isActive = true
}: TokenEmbeddingAnimProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matrixColors, setMatrixColors] = useState<string[]>(generateRandomColors);
  const [animState, setAnimState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentToken = tokens[currentIndex] || '';

  useEffect(() => {
    if (!isActive || tokens.length === 0) return;

    // Animation cycle: 200ms enter, 500ms visible, 300ms exit = 1000ms total
    const runCycle = () => {
      setAnimState('entering');
      setMatrixColors(generateRandomColors());

      setTimeout(() => {
        setAnimState('visible');
      }, 200);

      setTimeout(() => {
        setAnimState('exiting');
      }, 700);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % tokens.length);
      }, 1000);
    };

    runCycle();
    intervalRef.current = setInterval(runCycle, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, tokens.length]);

  if (tokens.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.container}
      data-testid="token-embedding-anim"
      data-active={isActive}
    >
      <div className={styles.animationArea}>
        <div className={styles.tokenSlot} data-state={animState}>
          <span className={styles.token}>{currentToken}</span>
        </div>

        <div className={styles.arrow}>
          <span className={styles.arrowChar}>&rarr;</span>
        </div>

        <div className={styles.matrixSlot} data-state={animState}>
          <div
            className={styles.matrix}
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
            }}
          >
            {matrixColors.map((color, index) => (
              <div
                key={index}
                className={styles.cell}
                style={{
                  backgroundColor: color,
                  animationDelay: `${(index % 8) * 20}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
