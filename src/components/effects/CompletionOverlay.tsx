import { useCallback, useMemo, useEffect, useState } from 'react';
import { useConfigStore } from '../../stores/config';
import { simulateEngagement } from '../../simulation/simulate';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import styles from '../../styles/completion-overlay.module.css';

type CompletionOverlayProps = {
  onTryAgain: () => void;
};

const TECH_AUDIENCE_IDS = new Set(['tech', 'founders', 'investors', 'students']);
const NON_TECH_AUDIENCE_IDS = new Set(['casual', 'news', 'creators', 'bots']);

// Generate confetti particles with random properties
function generateParticles(count: number) {
  const types = ['square', 'circle', 'line', 'dot'] as const;
  return Array.from({ length: count }, (_, i) => ({
    id: `particle-${i}`,
    type: types[i % types.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`
  }));
}

export default function CompletionOverlay({ onTryAgain }: CompletionOverlayProps) {
  const simulationResult = useConfigStore((state) => state.simulationResult);
  const personaId = useConfigStore((state) => state.personaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const [visible, setVisible] = useState(false);

  // Delay appearance slightly for dramatic effect
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Memoize particles to prevent regeneration on re-renders
  const particles = useMemo(() => generateParticles(40), []);

  const handleTryAgain = useCallback(() => {
    onTryAgain();
  }, [onTryAgain]);

  // Compute stats from simulation result, or calculate on the fly if not available
  const result = useMemo(() =>
    simulationResult ?? simulateEngagement({ personaId, tweetText, audienceMix }),
    [simulationResult, personaId, tweetText, audienceMix]
  );

  const impressions = result.counts.impressions;
  const likes = result.counts.likes;
  const reposts = result.counts.reposts;

  // Calculate alignment and tier (same logic as Chapter5Scene)
  const { alignmentLabel, performanceTier, performanceKey } = useMemo(() => {
    const reachRows = AUDIENCES.map((audience) => {
      const share = audienceMix[audience.id] ?? 0;
      return { id: audience.id, share };
    });

    const persona = PERSONAS.find((item) => item.id === personaId);
    const isTechnical = persona?.technical ?? true;

    const techShare = reachRows
      .filter((row) => TECH_AUDIENCE_IDS.has(row.id))
      .reduce((sum, row) => sum + row.share, 0);
    const nonTechShare = reachRows
      .filter((row) => NON_TECH_AUDIENCE_IDS.has(row.id))
      .reduce((sum, row) => sum + row.share, 0);

    const alignmentScore = isTechnical ? techShare : nonTechShare;
    const alignmentLabel =
      alignmentScore >= 60 ? 'Strong' : alignmentScore >= 35 ? 'Mixed' : 'Off-target';

    const engagementIndex =
      result.rates.likeRate * 1 +
      result.rates.repostRate * 2 +
      result.rates.replyRate * 1.5 +
      result.rates.bookmarkRate * 1.2 +
      result.rates.clickRate * 0.5;

    const adjustedScore = engagementIndex * (0.6 + alignmentScore / 200);
    const performanceTier =
      adjustedScore >= 0.22
        ? 'Above Avg'
        : adjustedScore >= 0.14
          ? 'Mid Avg'
          : 'Below Avg';

    const performanceKey = performanceTier === 'Above Avg'
      ? 'above'
      : performanceTier === 'Mid Avg'
        ? 'mid'
        : 'below';

    return { alignmentLabel, performanceTier, performanceKey };
  }, [audienceMix, personaId, result.rates]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} data-testid="completion-overlay" role="dialog" aria-modal="true">
      <div className={styles.scanlines} aria-hidden="true" />

      {/* Confetti particles */}
      <div className={styles.confettiContainer} aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={styles.particle}
            data-type={p.type}
            style={{
              left: p.left,
              '--delay': p.delay,
              '--fall-duration': p.duration
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <h1
          className={styles.glitchTitle}
          data-text="SIMULATION COMPLETE"
        >
          SIMULATION COMPLETE
        </h1>

        <p className={styles.subtitle}>
          Your tweet has completed its journey through the algorithm
        </p>

        {/* Row 1: Reach, Likes, Reposts */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{impressions.toLocaleString()}</span>
            <span className={styles.statLabel}>Reach</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{likes.toLocaleString()}</span>
            <span className={styles.statLabel}>Likes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{reposts.toLocaleString()}</span>
            <span className={styles.statLabel}>Reposts</span>
          </div>
        </div>

        {/* Row 2: Alignment */}
        <div className={styles.statItem}>
          <span className={styles.statValue}>{alignmentLabel}</span>
          <span className={styles.statLabel}>Alignment</span>
        </div>

        {/* Row 3: Performance Tier (badge first, label below) */}
        <div className={styles.tierRow}>
          <span className={styles.tierBadge} data-tier={performanceKey}>{performanceTier}</span>
          <span className={styles.tierLabel} data-tier={performanceKey}>Performance Tier</span>
        </div>

        <button
          type="button"
          className="crt-button mt-4 px-8 py-3 text-sm tracking-widest"
          onClick={handleTryAgain}
          aria-label="Start a new simulation"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
