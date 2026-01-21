import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/filter-gate.module.css';
import { playFilterFail, playFilterPass } from '../../audio/engine';

type FilterTweet = {
  id: string;
  text: string;
  status: 'pass' | 'fail' | 'pending';
};

type FilterGateProps = {
  label: string;
  functionName: string;
  totalIn: number;
  totalPass: number;
  totalFail: number;
  tweets: FilterTweet[];
  highlightTweet?: string;
  isActive?: boolean;
};

function getStep(total: number): number {
  return Math.max(1, Math.ceil(total / 18));
}

export default function FilterGate({
  label,
  functionName,
  totalIn,
  totalPass,
  totalFail,
  tweets,
  highlightTweet,
  isActive = true
}: FilterGateProps) {
  const [passCount, setPassCount] = useState(isActive ? 0 : totalPass);
  const [failCount, setFailCount] = useState(isActive ? 0 : totalFail);
  const passStep = useMemo(() => getStep(totalPass), [totalPass]);
  const failStep = useMemo(() => getStep(totalFail), [totalFail]);

  useEffect(() => {
    if (!isActive) {
      setPassCount(totalPass);
      setFailCount(totalFail);
      return undefined;
    }

    let pass = 0;
    let fail = 0;
    const timer = window.setInterval(() => {
      pass = Math.min(totalPass, pass + passStep);
      fail = Math.min(totalFail, fail + failStep);
      setPassCount(pass);
      setFailCount(fail);
      if (pass === totalPass && fail === totalFail) {
        window.clearInterval(timer);
      }
    }, 90);

    return () => window.clearInterval(timer);
  }, [isActive, totalPass, totalFail, passStep, failStep]);

  useEffect(() => {
    if (!isActive) return undefined;
    void playFilterPass();
    const timer = window.setTimeout(() => {
      void playFilterFail();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [isActive]);

  return (
    <div className={styles.container} data-testid="filter-gate" data-active={isActive}>
      <div className={styles.header}>
        <div className={styles.label}>{label}</div>
        <div className={styles.functionName}>{functionName}</div>
      </div>

      {highlightTweet ? (
        <div className={styles.highlight} data-testid="filter-highlight-tweet">
          <span className={styles.highlightLabel}>USER TWEET</span>
          <span className={styles.highlightText}>{highlightTweet}</span>
        </div>
      ) : null}

      <div className={styles.body}>
        <div className={styles.tweetLane}>
          {tweets.map((tweet, index) => (
            <div
              key={tweet.id}
              className={styles.tweet}
              data-status={tweet.status}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {tweet.text}
            </div>
          ))}
        </div>
        <div className={styles.scanline} aria-hidden="true" />
        <div className={styles.counts}>
          <div className={styles.countItem}>
            <span className={styles.countLabel}>IN</span>
            <span className={styles.countValue}>{totalIn}</span>
          </div>
          <div className={styles.countItem}>
            <span className={styles.countLabel}>PASS</span>
            <span className={styles.countValue} data-testid="filter-count-pass">
              {passCount}
            </span>
          </div>
          <div className={styles.countItem}>
            <span className={styles.countLabel}>FAIL</span>
            <span className={styles.countValue} data-testid="filter-count-fail">
              {failCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
