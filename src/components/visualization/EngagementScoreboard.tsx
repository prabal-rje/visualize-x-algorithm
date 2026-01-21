import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/engagement-scoreboard.module.css';

type ActionGroup = 'positive' | 'negative';

type EngagementAction = {
  id: string;
  label: string;
  probability: number;
  weight: number;
  group: ActionGroup;
};

type RankingItem = {
  id: string;
  label: string;
  score: number;
};

type EngagementScoreboardProps = {
  actions: EngagementAction[];
  finalScore: number;
  diversityPenalty: number;
  rankings: RankingItem[];
  isActive?: boolean;
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export default function EngagementScoreboard({
  actions,
  finalScore,
  diversityPenalty,
  rankings,
  isActive = true
}: EngagementScoreboardProps) {
  const [displayScore, setDisplayScore] = useState(isActive ? 0 : finalScore);
  const grouped = useMemo(() => {
    return {
      positive: actions.filter((action) => action.group === 'positive'),
      negative: actions.filter((action) => action.group === 'negative')
    };
  }, [actions]);

  useEffect(() => {
    if (!isActive) {
      setDisplayScore(finalScore);
      return undefined;
    }
    let current = 0;
    const step = Math.max(0.01, finalScore / 20);
    const timer = window.setInterval(() => {
      current = Math.min(finalScore, current + step);
      setDisplayScore(current);
      if (current >= finalScore) {
        window.clearInterval(timer);
      }
    }, 80);
    return () => window.clearInterval(timer);
  }, [finalScore, isActive]);

  return (
    <div
      className={styles.container}
      data-testid="engagement-scoreboard"
      data-active={isActive}
    >
      <div className={styles.header}>ENGAGEMENT PREDICTIONS</div>
      <div className={styles.groups}>
        {(['positive', 'negative'] as const).map((group) => (
          <div key={group} className={styles.group}>
            <div className={styles.groupTitle}>{group.toUpperCase()} ACTIONS</div>
            {grouped[group].map((action, index) => {
              const contribution = action.probability * action.weight;
              return (
                <div key={action.id} className={styles.row} style={{ animationDelay: `${index * 0.06}s` }}>
                  <span className={styles.label}>{action.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${clamp01(action.probability) * 100}%` }}
                    />
                  </div>
                  <span className={styles.prob}>{action.probability.toFixed(2)}</span>
                  <span className={styles.weight}>x{action.weight.toFixed(2)}</span>
                  <span className={styles.contribution}>{contribution.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.penalty}>
          <span>Author diversity penalty</span>
          <span>-{diversityPenalty.toFixed(2)}</span>
        </div>
        <div className={styles.finalScore}>
          <span>Final Score</span>
          <span className={styles.scoreValue}>{displayScore.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.rankings}>
        <div className={styles.rankingsTitle}>COMPARATIVE RANKING</div>
        {rankings.map((entry) => (
          <div
            key={entry.id}
            className={`${styles.rankingRow} ${entry.id === 'you' ? styles.rankingRowActive : ''}`.trim()}
          >
            <span>{entry.label}</span>
            <span>{entry.score.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
