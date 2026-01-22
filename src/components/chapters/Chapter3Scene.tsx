import { useEffect, useState } from 'react';
import styles from '../../styles/chapter3-scene.module.css';
import { useConfigStore } from '../../stores/config';
import FilterCascade from '../visualization/FilterCascade';
import TypewriterText from '../visualization/TypewriterText';
import { useViewport } from '../../hooks/useViewport';

type Chapter3SceneProps = {
  currentStep: number;
  isActive: boolean;
};

const STEP_NARRATION = [
  'First pass: strip duplicates and near-identical reposts to keep the pool clean...',
  'Social graph filters remove blocked, muted, and self-authored posts...',
  'Recency, history, and muted keywords filters drop stale or already-seen candidates...'
];

const STEP_LABELS = [
  '3A: Deduplication',
  '3B: Social Graph',
  '3C: Recency & History'
];

const STEP_CALLOUTS = [
  {
    title: 'Deduplicate the pool',
    detail: 'Near-duplicate threads collapse into a single candidate before scoring.',
    focus: 'DEDUP',
    userStatus: 'PASS'
  },
  {
    title: 'Honor the social graph',
    detail: 'Blocked, muted, and self-authored posts get culled early.',
    focus: 'SOCIAL GRAPH',
    userStatus: 'PASS'
  },
  {
    title: 'Recency + history sweep',
    detail: 'Stale, already-seen, and muted-keyword tweets are removed from the candidate stream.',
    focus: 'RECENCY + CONTENT',
    userStatus: 'PASS'
  }
];

const GATES = [
  {
    id: 'dedup',
    label: 'DEDUP',
    functionName: 'DropDuplicatesFilter::filter()',
    totalIn: 2847,
    totalPass: 2801,
    totalFail: 46,
    tweets: [
      { id: 'd1', text: 'Duplicate thread', status: 'fail' as const },
      { id: 'd2', text: 'Release notes', status: 'pass' as const },
      { id: 'd3', text: 'AI demo clip', status: 'pass' as const },
      { id: 'd4', text: 'Same meme', status: 'fail' as const }
    ]
  },
  {
    id: 'social',
    label: 'SOCIAL GRAPH',
    functionName: 'AuthorSocialgraphFilter::filter()',
    totalIn: 2801,
    totalPass: 2794,
    totalFail: 7,
    tweets: [
      { id: 's1', text: 'Blocked user post', status: 'fail' as const },
      { id: 's2', text: 'Team update', status: 'pass' as const },
      { id: 's3', text: 'Muted account', status: 'fail' as const },
      { id: 's4', text: 'Design tips', status: 'pass' as const }
    ]
  },
  {
    id: 'self',
    label: 'SELF-POST',
    functionName: 'SelfpostFilter::filter()',
    totalIn: 2794,
    totalPass: 2789,
    totalFail: 5,
    tweets: [
      { id: 'sp1', text: 'Your own repost', status: 'fail' as const },
      { id: 'sp2', text: 'Industry news', status: 'pass' as const },
      { id: 'sp3', text: 'Founder memo', status: 'pass' as const }
    ]
  },
  {
    id: 'recency',
    label: 'RECENCY',
    functionName: 'AgeFilter::filter()',
    totalIn: 2789,
    totalPass: 2156,
    totalFail: 633,
    tweets: [
      { id: 'r1', text: 'Old launch', status: 'fail' as const },
      { id: 'r2', text: 'Fresh demo', status: 'pass' as const },
      { id: 'r3', text: '48h recap', status: 'pass' as const }
    ]
  },
  {
    id: 'seen',
    label: 'PREVIOUSLY SEEN',
    functionName: 'PreviouslySeenPostsFilter::filter()',
    totalIn: 2156,
    totalPass: 1847,
    totalFail: 309,
    tweets: [
      { id: 'p1', text: 'Seen already', status: 'fail' as const },
      { id: 'p2', text: 'New thread', status: 'pass' as const },
      { id: 'p3', text: 'Repeat quote', status: 'fail' as const }
    ]
  },
  {
    id: 'keywords',
    label: 'MUTED KEYWORDS',
    functionName: 'MutedKeywordFilter::filter()',
    totalIn: 1847,
    totalPass: 1823,
    totalFail: 24,
    tweets: [
      { id: 'k1', text: 'Crypto hype', status: 'fail' as const },
      { id: 'k2', text: 'AI pipeline', status: 'pass' as const },
      { id: 'k3', text: 'Design systems', status: 'pass' as const }
    ]
  }
];

const GATES_BY_STEP = [
  [GATES[0]],
  [GATES[1], GATES[2]],
  [GATES[3], GATES[4], GATES[5]]
];

export default function Chapter3Scene({ currentStep, isActive }: Chapter3SceneProps) {
  const tweetText = useConfigStore((state) => state.tweetText);
  const { isMobile } = useViewport();
  const gatesForStep = GATES_BY_STEP[currentStep] || GATES_BY_STEP[0];
  const callout = STEP_CALLOUTS[currentStep] || STEP_CALLOUTS[0];
  const [activeGateIndex, setActiveGateIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setActiveGateIndex(0);
      return;
    }
    setActiveGateIndex(0);
    if (gatesForStep.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveGateIndex((prev) => (prev + 1) % gatesForStep.length);
    }, 1600);
    return () => window.clearInterval(interval);
  }, [gatesForStep.length, currentStep, isActive]);

  return (
    <div
      className={styles.container}
      data-testid="chapter-3-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 3</span>
        <h2 className={styles.title}>THE FILTERING</h2>
      </div>

      <div className={styles.narration}>
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={26}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      {isMobile ? (
        <div className={styles.mobileContent}>
          <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
          <div className={styles.callout} data-testid="filter-callout">
            <div className={styles.calloutHeader}>
              <span className={styles.calloutTitle}>{callout.title}</span>
              <span
                className={styles.calloutTag}
                data-status={callout.userStatus.toLowerCase()}
              >
                USER TWEET {callout.userStatus}
              </span>
            </div>
            <div className={styles.calloutText}>{callout.detail}</div>
            <div className={styles.calloutFocus}>
              <span className={styles.calloutLabel}>FOCUS GATE</span>
              <span className={styles.calloutValue}>{callout.focus}</span>
            </div>
          </div>
          <div className={styles.mobileGateList}>
            {gatesForStep.map((gate, index) => (
              <div
                key={gate.id}
                className={styles.mobileGateCard}
                data-active={index === activeGateIndex}
              >
                <div className={styles.mobileGateHeader}>
                  <span>{gate.label}</span>
                  <span>{gate.totalPass}/{gate.totalIn}</span>
                </div>
                <div className={styles.mobileGateMeta}>{gate.functionName}</div>
                <div className={styles.mobileGateCounts}>
                  <span>Pass {gate.totalPass}</span>
                  <span>Fail {gate.totalFail}</span>
                </div>
                <div className={styles.mobileGateSamples}>
                  {gate.tweets.slice(0, 2).map((tweet) => (
                    <span
                      key={tweet.id}
                      className={styles.mobileGateSample}
                      data-status={tweet.status}
                    >
                      {tweet.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
          <div className={styles.callout} data-testid="filter-callout">
            <div className={styles.calloutHeader}>
              <span className={styles.calloutTitle}>{callout.title}</span>
              <span
                className={styles.calloutTag}
                data-status={callout.userStatus.toLowerCase()}
              >
                USER TWEET {callout.userStatus}
              </span>
            </div>
            <div className={styles.calloutText}>{callout.detail}</div>
            <div className={styles.calloutFocus}>
              <span className={styles.calloutLabel}>FOCUS GATE</span>
              <span className={styles.calloutValue}>{callout.focus}</span>
            </div>
          </div>
          <FilterCascade
            gates={gatesForStep}
            activeGateIndex={activeGateIndex}
            highlightTweet={tweetText}
            isActive={isActive}
          />
        </div>
      )}

    </div>
  );
}
