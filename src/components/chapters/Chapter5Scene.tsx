import type { CSSProperties } from 'react';
import styles from '../../styles/chapter5-scene.module.css';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';
import { simulateEngagement } from '../../simulation/simulate';
import EngagementCascade from '../visualization/EngagementCascade';
import TopKSelector from '../visualization/TopKSelector';
import TypewriterText from '../visualization/TypewriterText';
import { useViewport } from '../../hooks/useViewport';

const STEP_NARRATION = [
  'Top-K selection picks the strongest candidates for delivery...',
  'Reach forecasts split impressions across the audience mix...',
  'Engagement bursts simulate the first wave of reactions...',
  'Delivery report summarizes performance against expectations...'
];

const STEP_LABELS = [
  '5A: Top-K Selector',
  '5B: Reach Forecast',
  '5C: Reaction Burst',
  '5D: Delivery Report'
];

const FUNCTION_LABELS = [
  'TopKScoreSelector::select()',
  'AudienceReachForecaster::estimate()',
  'EngagementBurstSimulator::run()',
  'format_response()'
];

const CANDIDATES = [
  { id: 'c1', label: 'Candidate A', score: 0.92 },
  { id: 'c2', label: 'Candidate B', score: 0.81 },
  { id: 'c3', label: 'Candidate C', score: 0.78 },
  { id: 'c4', label: 'Candidate D', score: 0.64 },
  { id: 'c5', label: 'Candidate E', score: 0.58 }
];

const REACTION_TYPES = ['like', 'reply', 'repost'] as const;
const REACTION_ICONS: Record<(typeof REACTION_TYPES)[number], string> = {
  like: '♥',
  reply: '💬',
  repost: '↻'
};

const BURST_POSITIONS = [
  { left: '12%', top: '18%' },
  { left: '28%', top: '36%' },
  { left: '42%', top: '14%' },
  { left: '58%', top: '32%' },
  { left: '74%', top: '16%' },
  { left: '86%', top: '38%' },
  { left: '18%', top: '62%' },
  { left: '36%', top: '70%' },
  { left: '52%', top: '56%' },
  { left: '68%', top: '72%' }
];

const AVATAR_LABELS = ['AE', 'TS', 'MK', 'RP', 'JV', 'CL', 'NB', 'SK', 'OG', 'DA'];

const TECH_AUDIENCE_IDS = new Set(['tech', 'founders', 'investors', 'students']);
const NON_TECH_AUDIENCE_IDS = new Set(['casual', 'news', 'creators', 'bots']);

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

  const result =
    simulationResult ??
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

  const reachRows = AUDIENCES.map((audience) => {
    const share = audienceMix[audience.id] ?? 0;
    return {
      id: audience.id,
      label: audience.label,
      share,
      count: Math.round(impressions * (share / 100))
    };
  }).sort((a, b) => b.share - a.share);

  const topReachRows = reachRows.slice(0, 4);

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

  const alignmentNote = isTechnical
    ? alignmentScore >= 60
      ? 'Tech persona aligned with a tech-heavy audience.'
      : alignmentScore >= 35
        ? 'Mixed audience pulls reach in both directions.'
        : 'Off-target mix dampens technical resonance.'
    : alignmentScore >= 60
      ? 'Non-technical persona aligned with broad audiences.'
      : alignmentScore >= 35
        ? 'Mixed audience yields uneven resonance.'
        : 'Off-target mix dampens general appeal.';

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

  const burstCount = Math.min(
    BURST_POSITIONS.length,
    Math.max(6, Math.round((predictedLikes + predictedReposts + predictedReplies) / 120))
  );

  const bursts = BURST_POSITIONS.slice(0, burstCount).map((position, index) => ({
    id: `burst-${index}`,
    reaction: REACTION_TYPES[index % REACTION_TYPES.length],
    delay: index * 0.2,
    ...position
  }));

  const avatarItems = AVATAR_LABELS.map((label, index) => ({
    id: `avatar-${index}`,
    label,
    reaction: REACTION_TYPES[index % REACTION_TYPES.length]
  }));

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
        <div className={styles.stepLabel}>
          {STEP_LABELS[currentStep] || STEP_LABELS[0]}
        </div>

        {currentStep === 0 && (
          <TopKSelector candidates={CANDIDATES} topK={3} isActive={isActive} />
        )}

        {currentStep === 1 && (
          <div className={styles.reachPanel} data-testid="audience-reach">
            <div className={styles.reachHeader}>REACH FORECAST</div>
            <div className={styles.reachTotal}>
              Total Impressions: {impressions.toLocaleString()}
            </div>
            <div className={styles.reachRows}>
              {topReachRows.map((row) => (
                <div key={row.id} className={styles.reachRow}>
                  <span className={styles.reachLabel}>{row.label}</span>
                  <div className={styles.reachBar}>
                    <div
                      className={styles.reachFill}
                      style={{ width: `${row.share}%` }}
                    />
                  </div>
                  <span className={styles.reachValue}>{row.count}</span>
                </div>
              ))}
            </div>
            <div className={styles.reachNote}>
              Estimated from embedding similarity + audience mix.
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.reactionPanel} data-testid="reaction-burst">
            <div className={styles.reactionHeader}>AUDIENCE REACTIONS</div>
            <div className={styles.avatarGrid}>
              {avatarItems.map((avatar, index) => (
                <div
                  key={avatar.id}
                  className={styles.avatar}
                  data-reaction={avatar.reaction}
                  style={{ '--index': index } as CSSProperties}
                >
                  {avatar.label}
                </div>
              ))}
            </div>
            {bursts.map((burst) => (
              <span
                key={burst.id}
                className={styles.burst}
                data-reaction={burst.reaction}
                style={{
                  left: burst.left,
                  top: burst.top,
                  animationDelay: `${burst.delay}s`
                }}
                aria-hidden="true"
              >
                {REACTION_ICONS[burst.reaction]}
              </span>
            ))}
            <div className={styles.reactionNote}>
              Burst timing estimated from embedding similarity + persona fit.
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.reportGrid}>
            <div className={styles.summaryPanel} data-testid="delivery-summary">
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTitle}>PERFORMANCE SUMMARY</span>
                <span
                  className={styles.summaryBadge}
                  data-tier={performanceKey}
                >
                  {performanceTier}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Reach</span>
                <span>{impressions.toLocaleString()} impressions</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Alignment</span>
                <span>{alignmentLabel}</span>
              </div>
              <div className={styles.summaryNote}>{alignmentNote}</div>
            </div>
            <EngagementCascade
              stats={stats}
              isActive={isActive}
              nodeCount={isMobile ? 10 : 14}
            />
          </div>
        )}
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
