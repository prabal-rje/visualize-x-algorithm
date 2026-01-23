import styles from '../../styles/chapter3-scene.module.css';
import TypewriterText from '../visualization/TypewriterText';
import FunnelViz from '../visualization/FunnelViz';
import { useViewport } from '../../hooks/useViewport';

type Chapter3SceneProps = {
  currentStep: number;
  isActive: boolean;
  /** Callback to continue to next step */
  onContinue?: () => void;
};

const STEP_NARRATION = [
  'First, we clean the pool—duplicates collapse, blocked accounts vanish...',
  'Next, freshness—stale posts and things you\'ve already seen get swept away...'
];

const STEP_LABELS = [
  '3A: Quality Gates',
  '3B: Freshness Gates'
];

// Step 0: Quality gates (dedup + social graph)
const QUALITY_GATES = [
  { id: 'dedup', label: 'DUPLICATES', removed: 46 },
  { id: 'blocked', label: 'BLOCKED', removed: 7 },
  { id: 'self', label: 'SELF-POSTS', removed: 5 }
];

// Step 1: Freshness gates (recency + history + muted)
const FRESHNESS_GATES = [
  { id: 'stale', label: 'STALE', removed: 633 },
  { id: 'seen', label: 'ALREADY SEEN', removed: 309 },
  { id: 'muted', label: 'MUTED TOPICS', removed: 24 }
];

const STEP_DATA = [
  { gates: QUALITY_GATES, startCount: 2847, endCount: 2789 },
  { gates: FRESHNESS_GATES, startCount: 2789, endCount: 1823 }
];

export default function Chapter3Scene({ currentStep, isActive, onContinue }: Chapter3SceneProps) {
  const { isMobile } = useViewport();
  const stepData = STEP_DATA[currentStep] || STEP_DATA[0];
  const narration = STEP_NARRATION[currentStep] || STEP_NARRATION[0];
  const label = STEP_LABELS[currentStep] || STEP_LABELS[0];

  return (
    <div
      className={styles.container}
      data-testid="chapter-3-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 3</span>
        <h2 className={styles.title}>THE FILTERING</h2>
        <div className={styles.stepLabel}>{label}</div>
      </div>

      <div className={styles.narration}>
        <TypewriterText
          text={narration}
          started={isActive}
          speed={26}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      <div className={isMobile ? styles.mobileContent : styles.content}>
        <FunnelViz
          gates={stepData.gates}
          startCount={stepData.startCount}
          endCount={stepData.endCount}
          isActive={isActive}
        />
      </div>

      {/* Continue button */}
      {onContinue && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="crt-button px-8 py-3 text-sm tracking-widest"
            onClick={onContinue}
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
}
