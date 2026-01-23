import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import Avatar from 'boring-avatars';
import styles from '../../styles/chapter5-scene.module.css';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';
import { simulateEngagement } from '../../simulation/simulate';
import { predictEngagement, calculateWeightedScore } from '../../ml/engagement';
import { isInitialized } from '../../ml/embeddings';
import { computeSemanticReach, areAudienceEmbeddingsReady } from '../../ml/reach';
import TopKSelector, { type Candidate } from '../visualization/TopKSelector';
import TypewriterText from '../visualization/TypewriterText';
import { useViewport } from '../../hooks/useViewport';

const STEP_NARRATION = [
  'Top-K selection picks the strongest candidates for delivery...',
  'Your tweet enters the feed of users who match your content...',
  'The first wave of users see your tweet and react...',
  'Your tweet\'s performance after the first delivery cycle...'
];

const STEP_LABELS = [
  '5A: Top-K Selector',
  '5B: Reach Forecast',
  '5C: Reaction Burst',
  '5D: Delivery Report'
];

const REACTION_TYPES = ['like', 'reply', 'repost'] as const;
const REACTION_ICONS: Record<(typeof REACTION_TYPES)[number], string> = {
  like: '♥',
  reply: '💬',
  repost: '↻'
};

const AVATAR_LABELS = [
  'Ava',
  'Theo',
  'Mika',
  'Ria',
  'Jules',
  'Clara',
  'Noah',
  'Sage',
  'Omar',
  'Dani'
];

const AVATAR_COLORS = ['#1EFC8B', '#49C6FF', '#FFB000', '#FF5C5C', '#A37FFF'];

const TECH_AUDIENCE_IDS = new Set(['tech', 'founders', 'investors', 'students']);
const NON_TECH_AUDIENCE_IDS = new Set(['casual', 'news', 'creators', 'bots']);

type Chapter5SceneProps = {
  currentStep: number;
  isActive: boolean;
  /** Callback to continue to next step */
  onContinue?: () => void;
};

const DEFAULT_PROBS = {
  like: 0.20,
  repost: 0.12,
  reply: 0.13,
  bookmark: 0.39,
  click: 0.42
};

type AudienceId = (typeof AUDIENCES)[number]['id'];
type AudienceMixType = Record<AudienceId, number>;

export default function Chapter5Scene({ currentStep, isActive, onContinue }: Chapter5SceneProps) {
  const personaId = useConfigStore((state) => state.personaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const simulationResult = useConfigStore((state) => state.simulationResult);
  const { isMobile } = useViewport();
  const [probs, setProbs] = useState(DEFAULT_PROBS);
  const [semanticReach, setSemanticReach] = useState<AudienceMixType>(audienceMix);

  // Compute semantic reach based on tweet content similarity to each audience
  useEffect(() => {
    let isMounted = true;
    async function computeReach() {
      try {
        if (!areAudienceEmbeddingsReady()) {
          setSemanticReach(audienceMix);
          return;
        }
        const reach = await computeSemanticReach(tweetText || 'Hello world', audienceMix);
        if (!isMounted) return;
        setSemanticReach(reach);
      } catch (error) {
        if (!isMounted) return;
        setSemanticReach(audienceMix);
        console.error('Failed to compute semantic reach', error);
      }
    }
    computeReach();
    return () => {
      isMounted = false;
    };
  }, [tweetText, audienceMix]);

  // Compute engagement probabilities (same as Chapter 4)
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        if (!isInitialized()) {
          setProbs(DEFAULT_PROBS);
          return;
        }
        const result = await predictEngagement(tweetText || 'Hello world', audienceMix);
        if (!isMounted) return;
        setProbs(result);
      } catch (error) {
        if (!isMounted) return;
        setProbs(DEFAULT_PROBS);
        console.error('Failed to compute engagement probabilities', error);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [tweetText, audienceMix]);

  // Compute final score (same formula as Chapter 4)
  const baseScore = calculateWeightedScore(probs);
  const diversityPenalty = Math.min(0.12, baseScore * 0.1);
  const finalScore = Math.max(0, baseScore - diversityPenalty);

  // Rankings matching Chapter 4 format
  const rankings: Candidate[] = useMemo(() => {
    return [
      { id: 'alpha', label: 'Candidate A', score: finalScore + 0.18, isUser: false },
      { id: 'you', label: 'Your Tweet', score: finalScore, isUser: true },
      { id: 'beta', label: 'Candidate B', score: Math.max(0, finalScore - 0.07), isUser: false },
      { id: 'gamma', label: 'Candidate C', score: Math.max(0, finalScore - 0.12), isUser: false }
    ];
  }, [finalScore]);

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
    const share = semanticReach[audience.id] ?? 0;
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
        <span className="crt-body text-crt-ink/70 tracking-[0.2em]">CHAPTER 5</span>
        <h2 className="crt-h2">THE DELIVERY</h2>
        <div className="crt-badge">{STEP_LABELS[currentStep] || STEP_LABELS[0]}</div>
      </div>

      <div className="crt-body text-center opacity-90 min-h-[48px] px-6">
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={24}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      {isMobile ? (
        <div className={styles.mobileContent}>
          {currentStep === 0 && (
            <TopKSelector
              candidates={rankings}
              topK={3}
              minScore={0.4}
              isActive={isActive}
            />
          )}

          {currentStep === 1 && (
            <div className={styles.mobilePanel} data-testid="audience-reach">
              <div className={styles.mobilePanelHeader}>REACH FORECAST</div>
              <div className={styles.mobileImpressionsRow}>
                <span>Total Impressions</span>
                <span className={styles.countUp}>{impressions.toLocaleString()}</span>
              </div>
              {topReachRows.map((row, index) => (
                <div
                  key={row.id}
                  className={styles.mobileReachRow}
                  style={{ '--index': index } as CSSProperties}
                >
                  <span className={styles.mobileReachLabel}>{row.label}</span>
                  <div className={styles.mobileProgressBar}>
                    <div
                      className={styles.mobileProgressFill}
                      style={{ '--target-width': `${row.share}%` } as CSSProperties}
                    />
                  </div>
                  <span className={styles.mobileReachValue}>{row.share.toFixed(0)}%</span>
                </div>
              ))}
              <div className={styles.mobileNote}>
                Distribution based on interest overlap and follow graph.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.mobileReactionPanel} data-testid="reaction-burst">
              <div className={styles.mobilePanelHeader}>AUDIENCE REACTIONS</div>
              <div className={styles.mobileAvatarRow}>
                {avatarItems.slice(0, 5).map((avatar, index) => (
                  <div
                    key={avatar.id}
                    className={styles.mobileAvatar}
                    style={{ '--index': index } as CSSProperties}
                  >
                    <Avatar
                      size={24}
                      name={avatar.label}
                      variant="beam"
                      colors={AVATAR_COLORS}
                    />
                    <span
                      className={styles.mobileAvatarBurst}
                      data-reaction={avatar.reaction}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {REACTION_ICONS[avatar.reaction]}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.mobileStatsArea}>
                {[...Array(8)].map((_, i) => (
                  <span
                    key={`particle-${i}`}
                    className={styles.microParticle}
                    data-reaction={REACTION_TYPES[i % 3]}
                    style={{
                      left: `${10 + (i * 11)}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    {REACTION_ICONS[REACTION_TYPES[i % 3]]}
                  </span>
                ))}
                {stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className={styles.mobileStatRow}
                    style={{ '--index': index } as CSSProperties}
                  >
                    <span>{stat.label}</span>
                    <span className={styles.countUp} style={{ '--target': stat.actual } as CSSProperties}>
                      {stat.actual.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.mobileNote}>
                Early engagement signals.
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.mobilePanel} data-testid="delivery-summary">
              <div className={styles.mobilePanelHeader}>PERFORMANCE SUMMARY</div>
              <div
                className={styles.mobileRevealRow}
                style={{ '--delay': '0s' } as CSSProperties}
              >
                <span>Reach</span>
                <span>{impressions.toLocaleString()}</span>
              </div>
              <div
                className={styles.mobileRevealRow}
                style={{ '--delay': '0.3s' } as CSSProperties}
              >
                <span>Alignment</span>
                <span>{alignmentLabel}</span>
              </div>
              <div
                className={styles.mobileRevealRow}
                style={{ '--delay': '0.6s' } as CSSProperties}
              >
                <span>Tier</span>
                <span
                  className={styles.mobileTierBadge}
                  data-tier={performanceKey}
                >
                  {performanceTier}
                </span>
              </div>
              <div
                className={styles.mobileRevealNote}
                style={{ '--delay': '0.9s' } as CSSProperties}
              >
                {alignmentNote}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.content}>
          {currentStep === 0 && (
            <TopKSelector
              candidates={rankings}
              topK={3}
              minScore={0.4}
              isActive={isActive}
            />
          )}

          {currentStep === 1 && (
            <div className={styles.reachPanel} data-testid="audience-reach">
              <div className={styles.reachHeader}>REACH FORECAST</div>
              <div className={styles.impressionsRow}>
                <span>Total Impressions</span>
                <span className={styles.impressionsValue}>{impressions.toLocaleString()}</span>
              </div>
              {topReachRows.map((row, index) => (
                <div
                  key={row.id}
                  className={styles.reachRow}
                  style={{ '--index': index } as CSSProperties}
                >
                  <span className={styles.reachLabel}>{row.label}</span>
                  <div className={styles.reachBar}>
                    <div
                      className={styles.reachFill}
                      style={{ '--target-width': `${row.share}%` } as CSSProperties}
                    />
                  </div>
                  <span className={styles.reachValue}>{row.share.toFixed(0)}%</span>
                </div>
              ))}
              <div className={styles.reachNote}>
                Distribution based on interest overlap and follow graph.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.reactionPanel} data-testid="reaction-burst">
              <div className={styles.reactionHeader}>AUDIENCE REACTIONS</div>
              <div className={styles.avatarRow}>
                {avatarItems.slice(0, 5).map((avatar, index) => (
                  <div
                    key={avatar.id}
                    className={styles.avatarCircle}
                    style={{ '--index': index } as CSSProperties}
                    aria-label={`Audience member ${avatar.label}`}
                  >
                    <Avatar
                      size={44}
                      name={avatar.label}
                      variant="beam"
                      colors={AVATAR_COLORS}
                      className={styles.avatarSvg}
                    />
                    <span
                      className={styles.avatarBurst}
                      data-reaction={avatar.reaction}
                      style={{ animationDelay: `${index * 0.2}s` }}
                      aria-hidden="true"
                    >
                      {REACTION_ICONS[avatar.reaction]}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.statsArea}>
                {[...Array(8)].map((_, i) => (
                  <span
                    key={`particle-${i}`}
                    className={styles.floatingParticle}
                    data-reaction={REACTION_TYPES[i % 3]}
                    style={{
                      left: `${10 + (i * 11)}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    {REACTION_ICONS[REACTION_TYPES[i % 3]]}
                  </span>
                ))}
                {stats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className={styles.statRow}
                    style={{ '--index': index } as CSSProperties}
                  >
                    <span>{stat.label}</span>
                    <span className={styles.statValue}>
                      {stat.actual.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.reactionNote}>
                Early engagement signals.
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div
              className={styles.summaryPanel}
              data-testid="delivery-summary"
              data-active={isActive}
            >
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTitle}>PERFORMANCE SUMMARY</span>
              </div>
              <div
                className={styles.summaryRow}
                data-reveal="true"
                style={{ '--delay': '0s' } as CSSProperties}
              >
                <span>Reach</span>
                <span>{impressions.toLocaleString()}</span>
              </div>
              <div
                className={styles.summaryRow}
                data-reveal="true"
                style={{ '--delay': '0.3s' } as CSSProperties}
              >
                <span>Alignment</span>
                <span>{alignmentLabel}</span>
              </div>
              <div
                className={styles.summaryRow}
                data-reveal="true"
                style={{ '--delay': '0.6s' } as CSSProperties}
              >
                <span>Tier</span>
                <span
                  className={styles.tierBadge}
                  data-tier={performanceKey}
                >
                  {performanceTier}
                </span>
              </div>
              <div
                className={styles.summaryNote}
                data-reveal="true"
                style={{ '--delay': '0.9s' } as CSSProperties}
              >
                {alignmentNote}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
      {onContinue && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="crt-button-secondary"
            onClick={onContinue}
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
}
