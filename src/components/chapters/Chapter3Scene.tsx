import styles from '../../styles/chapter3-scene.module.css';
import { useConfigStore } from '../../stores/config';
import FilterCascade from '../visualization/FilterCascade';
import TypewriterText from '../visualization/TypewriterText';

type Chapter3SceneProps = {
  currentStep: number;
  isActive: boolean;
};

const STEP_NARRATION = [
  'Before scoring, the filter cascade removes duplicates and noise from the candidate pool...',
  'Social graph filters block muted or blocked authors and your own posts...',
  'Content filters catch muted keywords and stale posts before scoring begins...'
];

const STEP_LABELS = [
  '3A: Deduplication',
  '3B: Social Graph',
  '3C: Content Filters'
];

const FUNCTION_LABELS = [
  'DropDuplicatesFilter::filter()',
  'AuthorSocialgraphFilter::filter()',
  'MutedKeywordFilter::filter()'
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

const ACTIVE_GATE_BY_STEP = [0, 1, 5];

export default function Chapter3Scene({ currentStep, isActive }: Chapter3SceneProps) {
  const tweetText = useConfigStore((state) => state.tweetText);
  const activeGateIndex = ACTIVE_GATE_BY_STEP[currentStep] ?? 0;

  return (
    <div
      className={styles.container}
      data-testid="chapter-3-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 3</span>
        <h2 className={styles.title}>THE FILTERING</h2>
        <div className={styles.file}>
          <span className={styles.fileLabel}>FILE:</span>
          <span className={styles.filePath}>home-mixer/filters</span>
        </div>
      </div>

      <div className={styles.narration}>
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={26}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
        <FilterCascade
          gates={GATES}
          activeGateIndex={activeGateIndex}
          highlightTweet={tweetText}
          isActive={isActive}
        />
      </div>

      <div className={styles.functionRef}>
        <span className={styles.funcLabel}>FUNCTION:</span>
        <code className={styles.funcName}>
          {FUNCTION_LABELS[currentStep] || FUNCTION_LABELS[0]}
        </code>
      </div>
    </div>
  );
}
