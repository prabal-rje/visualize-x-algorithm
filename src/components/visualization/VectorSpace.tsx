import { useState } from 'react';
import styles from '../../styles/vector-space.module.css';
import VectorSpaceHover from './VectorSpaceHover';

type Point = {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  label: string;
};

type CandidatePoint = Point & {
  similarity: number; // 0-1
  text?: string; // Tweet content for hover tooltip
};

type VectorSpaceProps = {
  /** The user point (center reference) */
  userPoint: Point;
  /** Candidate points with similarity scores */
  candidates: CandidatePoint[];
  /** Whether to show similarity scores */
  showSimilarity?: boolean;
  /** Optional label for the visualization */
  label?: string;
  /** Whether animation is active */
  isActive?: boolean;
};

function getSimilarityClass(similarity: number): string {
  if (similarity >= 0.8) return styles.high;
  if (similarity >= 0.5) return styles.medium;
  return styles.low;
}

export default function VectorSpace({
  userPoint,
  candidates,
  showSimilarity = false,
  label = 'VECTOR SPACE',
  isActive = true
}: VectorSpaceProps) {
  const [hovered, setHovered] = useState<CandidatePoint | null>(null);
  const showHover = hovered && hovered.text;

  return (
    <div
      className={styles.container}
      data-testid="vector-space"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.space}>
        {/* Grid lines for depth effect */}
        <div className={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className={styles.gridLineH} style={{ top: `${i * 10}%` }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className={styles.gridLineV} style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Candidate points */}
        {candidates.map((candidate, index) => (
          <div
            key={index}
            data-testid="vector-space-candidate"
            className={`${styles.point} ${styles.candidate} ${getSimilarityClass(candidate.similarity)}`}
            style={{
              left: `${candidate.x}%`,
              top: `${candidate.y}%`,
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={() => setHovered(candidate)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(candidate)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            title={candidate.text ? `${candidate.text}\n\nSimilarity: ${candidate.similarity.toFixed(3)}` : undefined}
          >
            <div className={styles.pointDot} />
            {showSimilarity && (
              <span className={styles.similarity}>{candidate.similarity.toFixed(2)}</span>
            )}
          </div>
        ))}

        {/* User point (central reference) */}
        <div
          data-testid="vector-space-user"
          className={`${styles.point} ${styles.user}`}
          style={{
            left: `${userPoint.x}%`,
            top: `${userPoint.y}%`
          }}
        >
          <div className={styles.pointDot} />
          <span className={styles.pointLabel}>{userPoint.label}</span>
        </div>
      </div>
      <div className={styles.hoverSlot} data-testid="vector-space-hover-slot">
        {showHover && hovered?.text ? (
          <VectorSpaceHover tweet={hovered.text} similarity={hovered.similarity} />
        ) : null}
      </div>
    </div>
  );
}
