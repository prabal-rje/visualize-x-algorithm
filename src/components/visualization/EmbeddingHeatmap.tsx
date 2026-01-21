import styles from '../../styles/embedding-heatmap.module.css';

type EmbeddingHeatmapProps = {
  /** The embedding vector (ideally 128 values for 16x8 grid, matching X's Phoenix model) */
  embedding: number[];
  /** Optional label for the embedding */
  label?: string;
  /** Whether the animation is active */
  isActive?: boolean;
};

// X's Phoenix model uses 128-dimensional embeddings
const GRID_COLS = 16;
const GRID_ROWS = 8;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS; // 128 dimensions

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate the Nth percentile of absolute values in an array.
 */
function percentile(values: number[], p: number): number {
  const absValues = values.map(Math.abs).sort((a, b) => a - b);
  const index = Math.floor((p / 100) * absValues.length);
  return absValues[Math.min(index, absValues.length - 1)] || 1;
}

/**
 * Normalize embedding values using percentile scaling.
 * This spreads the values across the full -1 to 1 range for better visualization.
 */
function normalizeEmbedding(values: number[]): number[] {
  if (values.length === 0) return values;

  // Use 90th percentile of absolute values as the scale factor
  // This prevents outliers from compressing the color range
  const scale = percentile(values, 90) || 1;

  return values.map(v => clamp(v / scale, -1, 1));
}

function valueToColor(value: number): string {
  // Value should already be normalized to -1 to 1 range
  // Map to 0-1 range
  const t = (value + 1) / 2;

  // CRT-style colorful heatmap:
  // -1.0 (t=0.0): Deep magenta/purple
  // -0.5 (t=0.25): Blue
  // 0.0 (t=0.5): Cyan/Teal
  // +0.5 (t=0.75): Green/Yellow
  // +1.0 (t=1.0): Orange/Red

  let r: number, g: number, b: number;

  if (t < 0.25) {
    // Magenta to Blue
    const s = t / 0.25;
    r = Math.round(180 - s * 140);
    g = Math.round(20 + s * 30);
    b = Math.round(180 + s * 75);
  } else if (t < 0.5) {
    // Blue to Cyan
    const s = (t - 0.25) / 0.25;
    r = Math.round(40 - s * 30);
    g = Math.round(50 + s * 180);
    b = Math.round(255 - s * 55);
  } else if (t < 0.75) {
    // Cyan to Green/Yellow
    const s = (t - 0.5) / 0.25;
    r = Math.round(10 + s * 200);
    g = Math.round(230 + s * 25);
    b = Math.round(200 - s * 180);
  } else {
    // Yellow to Orange/Red
    const s = (t - 0.75) / 0.25;
    r = Math.round(210 + s * 45);
    g = Math.round(255 - s * 100);
    b = Math.round(20 - s * 10);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export default function EmbeddingHeatmap({
  embedding,
  label = 'EMBEDDING',
  isActive = true
}: EmbeddingHeatmapProps) {
  // Pad or trim embedding to fit 128 cells (X's Phoenix model dimension)
  const rawCells = Array.from({ length: TOTAL_CELLS }, (_, i) =>
    embedding[i] ?? 0
  );

  // Normalize using 90th percentile scaling for better color distribution
  const cells = normalizeEmbedding(rawCells);

  return (
    <div
      className={styles.container}
      data-testid="embedding-heatmap"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.dim}>({TOTAL_CELLS}-dim)</span>
      </div>
      <div className={styles.content}>
        {/* Color scale legend */}
        <div className={styles.scale}>
          <span className={styles.scaleLabel}>+1</span>
          <div className={styles.scaleGradient} />
          <span className={styles.scaleLabel}>-1</span>
        </div>
        {/* Embedding grid */}
        <div
          className={styles.grid}
          data-testid="embedding-heatmap-grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
          }}
        >
          {cells.map((normalizedValue, index) => {
            const cellColor = valueToColor(normalizedValue);
            return (
              <div
                key={index}
                data-testid="heatmap-cell"
                className={styles.cell}
                style={{
                  backgroundColor: cellColor,
                  color: cellColor,
                  animationDelay: isActive ? `${(index * 5) % 500}ms` : '0ms'
                }}
                title={`dim ${index}: ${rawCells[index].toFixed(4)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
