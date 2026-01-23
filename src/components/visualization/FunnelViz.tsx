import { useEffect, useState } from 'react';
import styles from '../../styles/funnel-viz.module.css';

type Gate = {
  id: string;
  label: string;
  removed: number;
};

type FunnelVizProps = {
  gates: Gate[];
  startCount: number;
  endCount: number;
  isActive?: boolean;
};

export default function FunnelViz({
  gates,
  startCount,
  endCount,
  isActive = true
}: FunnelVizProps) {
  const [animatedCounts, setAnimatedCounts] = useState<number[]>([]);
  const [currentGate, setCurrentGate] = useState(0);

  // Calculate running totals for each gate
  const runningTotals = gates.reduce<number[]>((acc, gate, i) => {
    const prev = i === 0 ? startCount : acc[i - 1];
    acc.push(prev - gate.removed);
    return acc;
  }, []);

  // Animate through gates
  useEffect(() => {
    if (!isActive) {
      setCurrentGate(0);
      setAnimatedCounts([]);
      return;
    }

    setCurrentGate(0);
    setAnimatedCounts([]);

    const interval = setInterval(() => {
      setCurrentGate((prev) => {
        if (prev >= gates.length) {
          clearInterval(interval);
          return prev;
        }
        setAnimatedCounts((counts) => [...counts, runningTotals[prev]]);
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive, gates.length, runningTotals.join(',')]);

  const displayedEndCount = animatedCounts.length === gates.length
    ? endCount
    : (animatedCounts[animatedCounts.length - 1] ?? startCount);

  return (
    <div
      className={styles.container}
      data-testid="funnel-viz"
      data-active={isActive}
    >
      {/* Start count */}
      <div className={styles.countBox} data-position="start">
        <span className={styles.countValue}>{startCount.toLocaleString()}</span>
        <span className={styles.countLabel}>CANDIDATES</span>
      </div>

      {/* Gates */}
      <div className={styles.pipeline}>
        {gates.map((gate, index) => {
          const isReached = index < currentGate;
          const isCurrent = index === currentGate - 1;
          return (
            <div
              key={gate.id}
              className={styles.gate}
              data-reached={isReached}
              data-current={isCurrent}
            >
              <div className={styles.gateBar}>
                <span className={styles.gateLabel}>{gate.label}</span>
                <span className={styles.gateRemoved}>
                  {isReached ? `-${gate.removed}` : ''}
                </span>
              </div>
              {isReached && (
                <div className={styles.gateCount}>
                  {runningTotals[index].toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End count */}
      <div
        className={styles.countBox}
        data-position="end"
        data-complete={currentGate >= gates.length}
      >
        <span className={styles.countValue}>
          {displayedEndCount.toLocaleString()}
        </span>
        <span className={styles.countLabel}>SURVIVORS</span>
      </div>
    </div>
  );
}
