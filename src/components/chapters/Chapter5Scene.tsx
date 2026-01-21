import styles from '../../styles/chapter5-scene.module.css';
import { useConfigStore } from '../../stores/config';
import { simulateEngagement } from '../../simulation/simulate';
import EngagementCascade from '../visualization/EngagementCascade';
import TopKSelector from '../visualization/TopKSelector';
import TypewriterText from '../visualization/TypewriterText';
import { useViewport } from '../../hooks/useViewport';

const STEP_NARRATION = [
  'Top-K selection picks the strongest candidates for delivery...',
  'Visibility filters pass the remaining tweets into the delivery graph...'
];

const STEP_LABELS = ['5A: Top-K Selector', '5B: Delivery Cascade'];

const CANDIDATES = [
  { id: 'c1', label: 'Candidate A', score: 0.92 },
  { id: 'c2', label: 'Candidate B', score: 0.81 },
  { id: 'c3', label: 'Candidate C', score: 0.78 },
  { id: 'c4', label: 'Candidate D', score: 0.64 },
  { id: 'c5', label: 'Candidate E', score: 0.58 }
];

type Chapter5SceneProps = {
  currentStep: number;
  isActive: boolean;
};

export default function Chapter5Scene({ currentStep, isActive }: Chapter5SceneProps) {
  const personaId = useConfigStore((state) => state.personaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const simulationResult = useConfigStore((state) => state.simulationResult);
  const { isMobile } = useViewport();

  const result = simulationResult ??
    simulateEngagement({
      personaId,
      tweetText,
      audienceMix
    });

  const impressions = result.counts.impressions;
  const predictedLikes = Math.round(impressions * result.rates.likeRate);
  const predictedReposts = Math.round(impressions * result.rates.repostRate);
  const predictedReplies = Math.round(impressions * result.rates.replyRate);

  const stats = [
    {
      id: 'likes',
      label: 'Likes',
      predicted: predictedLikes,
      actual: result.counts.likes
    },
    {
      id: 'reposts',
      label: 'Reposts',
      predicted: predictedReposts,
      actual: result.counts.reposts
    },
    {
      id: 'replies',
      label: 'Replies',
      predicted: predictedReplies,
      actual: result.counts.replies
    }
  ];

  return (
    <div
      className={styles.container}
      data-testid="chapter-5-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 5</span>
        <h2 className={styles.title}>THE DELIVERY</h2>
      </div>

      <div className={styles.narration}>
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={24}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.stepLabel}>{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
        <TopKSelector candidates={CANDIDATES} topK={3} isActive={isActive} />
        <EngagementCascade stats={stats} isActive={isActive} nodeCount={isMobile ? 12 : 18} />
      </div>

      <div className={styles.functionRef}>
        <span className={styles.funcLabel}>FUNCTION:</span>
        <code className={styles.funcName}>
          {currentStep === 0 ? 'TopKScoreSelector::select()' : 'PhoenixCandidatePipeline::run()'}
        </code>
      </div>
    </div>
  );
}
