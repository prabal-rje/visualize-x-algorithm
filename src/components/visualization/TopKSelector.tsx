import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/topk-selector.module.css';
import { playFilterPass, playFilterFail } from '../../audio/engine';

export type Candidate = {
  id: string;
  label: string;
  score: number;
  isUser?: boolean;
};

type AnimationPhase = 'inherited' | 'selecting' | 'filtering' | 'result';

const PHASE_LABELS: Record<AnimationPhase, string> = {
  inherited: 'EVALUATING...',
  selecting: 'SELECTING...',
  filtering: 'FILTERING...',
  result: 'COMPLETE'
};

type TopKSelectorProps = {
  candidates: Candidate[];
  topK?: number;
  minScore?: number;
  isActive?: boolean;
};

export default function TopKSelector({
  candidates,
  topK = 3,
  minScore = 0.4,
  isActive = true
}: TopKSelectorProps) {
  const [phase, setPhase] = useState<AnimationPhase>('inherited');

  // Sort candidates by score
  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  // Find user's rank (1-indexed)
  const userCandidate = sorted.find(c => c.isUser);
  const userRank = sorted.findIndex(c => c.isUser) + 1;
  const userScore = userCandidate?.score ?? 0;

  // Determine if user passes: must be in top K AND score >= minScore
  const userInTopK = userRank > 0 && userRank <= topK;
  const userMeetsMinScore = userScore >= minScore;
  const userPassed = userInTopK && userMeetsMinScore;

  // Which candidates are selected (top K with score >= minScore)
  const selectedIds = new Set(
    sorted
      .slice(0, topK)
      .filter(c => c.score >= minScore)
      .map(c => c.id)
  );

  // Progress through animation phases
  useEffect(() => {
    if (!isActive) {
      setPhase('inherited');
      return;
    }

    setPhase('inherited');

    const timer1 = setTimeout(() => setPhase('selecting'), 1000);
    const timer2 = setTimeout(() => setPhase('filtering'), 2000);
    const timer3 = setTimeout(() => setPhase('result'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isActive, candidates]);

  // Play pass/fail sound when result phase is reached
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    if (phase === 'result' && prevPhaseRef.current !== 'result') {
      if (userPassed) {
        void playFilterPass();
      } else {
        void playFilterFail();
      }
    }
    prevPhaseRef.current = phase;
  }, [phase, userPassed]);

  // Determine row state based on phase
  const getRowState = (candidate: Candidate) => {
    const isSelected = selectedIds.has(candidate.id);
    const meetsMinScore = candidate.score >= minScore;

    if (phase === 'inherited') {
      return 'neutral';
    }

    if (phase === 'selecting') {
      return isSelected ? 'highlighted' : 'fading';
    }

    if (phase === 'filtering' || phase === 'result') {
      if (!meetsMinScore) return 'filtered';
      if (!isSelected) return 'filtered';
      return 'selected';
    }

    return 'neutral';
  };

  return (
    <div
      className={styles.container}
      data-testid="topk-selector"
      data-active={isActive}
      data-phase={phase}
    >
      <div className={styles.header}>
        <span className={styles.title}>TOP {topK} SELECTION</span>
        <span className={styles.subtitle}>{PHASE_LABELS[phase]}</span>
      </div>

      <div className={styles.list}>
        {sorted.map((candidate, index) => {
          const rowState = getRowState(candidate);
          return (
            <div
              key={candidate.id}
              className={styles.row}
              data-state={rowState}
              data-user={candidate.isUser}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.label}>{candidate.label}</span>
              <span className={styles.score}>{candidate.score.toFixed(2)}</span>
              {rowState === 'filtered' && phase === 'result' && (
                <span className={styles.filteredBadge}>FILTERED</span>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.visibility} data-passed={userPassed} data-phase={phase}>
        <span className={styles.visibilityLabel}>VISIBILITY FILTER</span>
        {phase === 'result' ? (
          <span className={userPassed ? styles.pass : styles.fail}>
            {userPassed ? 'PASS' : 'FAIL'}
          </span>
        ) : (
          <span className={styles.pending}>...</span>
        )}
      </div>

      {phase === 'result' && !userPassed && (
        <div className={styles.failReason}>
          {!userMeetsMinScore
            ? `Score ${userScore.toFixed(2)} below minimum threshold (${minScore})`
            : `Ranked #${userRank} — only top ${topK} selected`
          }
        </div>
      )}
    </div>
  );
}
