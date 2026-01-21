import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/chapter4-scene.module.css';
import { predictEngagement, calculateWeightedScore } from '../../ml/engagement';
import { isInitialized } from '../../ml/embeddings';
import { useConfigStore } from '../../stores/config';
import AttentionMap from '../visualization/AttentionMap';
import EngagementScoreboard from '../visualization/EngagementScoreboard';
import ProbabilityRack from '../visualization/ProbabilityRack';
import ScoringContextTokens from '../visualization/ScoringContextTokens';
import TypewriterText from '../visualization/TypewriterText';

const STEP_NARRATION = [
  'Phoenix turns your recent actions into context tokens for the ranker...',
  'Attention weights reveal which memories drive the score...',
  'Embedding similarity estimates P(action | tweet, audience)...',
  'Weighted sums merge those odds into a single ranking score...'
];

const STEP_LABELS = [
  '4A: Context Tokens',
  '4B: Attention Weights',
  '4C: Probability Estimates',
  '4D: Weighted Score'
];

const STEP_CALLOUTS = [
  {
    title: 'Tokenized engagement history',
    detail: 'Phoenix encodes your recent actions into discrete context tokens.',
    formula: 'context → attention'
  },
  {
    title: 'Attention heat',
    detail: 'Higher weights mean stronger influence on the prediction.',
    formula: 'alpha_i * token_i'
  },
  {
    title: 'Estimate P(action)',
    detail: 'Embedding similarity maps to action probabilities.',
    formula: 'P(action | embedding)'
  },
  {
    title: 'Weighted score',
    detail: 'Probabilities combine with action weights for the final score.',
    formula: 'sum(p * w)'
  }
];

const FUNCTION_LABELS = [
  'PhoenixRanker.forward()',
  'PhoenixRanker::attention()',
  'PhoenixScorer::score()',
  'WeightedScorer::score()'
];

const CONTEXT_TOKENS = [
  { id: 'c1', action: 'liked', text: 'AI tool demo', weight: 0.34 },
  { id: 'c2', action: 'replied', text: 'Startup advice', weight: 0.18 },
  { id: 'c3', action: 'liked', text: 'Transformer paper', weight: 0.31 },
  { id: 'c4', action: 'reposted', text: 'Product launch', weight: 0.12 },
  { id: 'c5', action: 'liked', text: 'Python tips', weight: 0.22 },
  { id: 'c6', action: 'clicked', text: 'Design thread', weight: 0.14 }
];

const DEFAULT_PROBS = {
  like: 0.22,
  repost: 0.08,
  reply: 0.06,
  bookmark: 0.12,
  click: 0.18
};

type Chapter4SceneProps = {
  currentStep: number;
  isActive: boolean;
};

export default function Chapter4Scene({ currentStep, isActive }: Chapter4SceneProps) {
  const tweetText = useConfigStore((state) => state.tweetText);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const [probs, setProbs] = useState(DEFAULT_PROBS);

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

  const actions = useMemo(() => {
    return [
      { id: 'like', label: 'Like', probability: probs.like, weight: 1.0, group: 'positive' as const },
      { id: 'repost', label: 'Repost', probability: probs.repost, weight: 2.0, group: 'positive' as const },
      { id: 'reply', label: 'Reply', probability: probs.reply, weight: 1.5, group: 'positive' as const },
      { id: 'bookmark', label: 'Bookmark', probability: probs.bookmark, weight: 1.2, group: 'positive' as const },
      { id: 'click', label: 'Click', probability: probs.click, weight: 0.5, group: 'positive' as const },
      { id: 'follow', label: 'Follow', probability: probs.like * 0.2, weight: 1.4, group: 'positive' as const },
      { id: 'share', label: 'Share', probability: probs.repost * 0.4, weight: 0.7, group: 'positive' as const },
      { id: 'dwell', label: 'Dwell', probability: probs.click * 0.6, weight: 0.3, group: 'positive' as const },
      { id: 'hide', label: 'Hide', probability: 0.06, weight: -1.0, group: 'negative' as const },
      { id: 'mute', label: 'Mute', probability: 0.02, weight: -1.5, group: 'negative' as const },
      { id: 'block', label: 'Block', probability: 0.005, weight: -2.5, group: 'negative' as const },
      { id: 'report', label: 'Report', probability: 0.01, weight: -2.0, group: 'negative' as const },
      { id: 'skip', label: 'Skip', probability: 0.08, weight: -0.8, group: 'negative' as const }
    ];
  }, [probs]);

  const probabilityItems = useMemo(
    () => [
      { id: 'like', label: 'Like', probability: probs.like },
      { id: 'repost', label: 'Repost', probability: probs.repost },
      { id: 'reply', label: 'Reply', probability: probs.reply },
      { id: 'bookmark', label: 'Bookmark', probability: probs.bookmark },
      { id: 'click', label: 'Click', probability: probs.click },
      { id: 'follow', label: 'Follow', probability: probs.like * 0.2 }
    ],
    [probs]
  );

  const baseScore = calculateWeightedScore(probs);
  const diversityPenalty = Math.min(0.12, baseScore * 0.12);
  const finalScore = Math.max(0, baseScore - diversityPenalty);

  const rankings = useMemo(() => {
    return [
      { id: 'alpha', label: 'Candidate A', score: finalScore + 0.18 },
      { id: 'you', label: 'Your Tweet', score: finalScore },
      { id: 'beta', label: 'Candidate B', score: Math.max(0, finalScore - 0.07) },
      { id: 'gamma', label: 'Candidate C', score: Math.max(0, finalScore - 0.12) }
    ].sort((a, b) => b.score - a.score);
  }, [finalScore]);

  const attentionItems = useMemo(() => {
    return CONTEXT_TOKENS.map((token) => ({
      id: token.id,
      label: token.text,
      weight: token.weight
    }));
  }, []);

  const callout = STEP_CALLOUTS[currentStep] || STEP_CALLOUTS[0];

  return (
    <div
      className={styles.container}
      data-testid="chapter-4-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 4</span>
        <h2 className={styles.title}>THE SCORING</h2>
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
        <div className={styles.callout}>
          <div className={styles.calloutHeader}>
            <span className={styles.calloutTitle}>{callout.title}</span>
            <span className={styles.calloutFormula}>{callout.formula}</span>
          </div>
          <div className={styles.calloutText}>{callout.detail}</div>
        </div>

        {currentStep === 0 && (
          <ScoringContextTokens tokens={CONTEXT_TOKENS} isActive={isActive} />
        )}

        {currentStep === 1 && (
          <AttentionMap items={attentionItems} isActive={isActive} />
        )}

        {currentStep === 2 && (
          <ProbabilityRack items={probabilityItems} isActive={isActive} />
        )}

        {currentStep === 3 && (
          <EngagementScoreboard
            actions={actions}
            finalScore={finalScore}
            diversityPenalty={diversityPenalty}
            rankings={rankings}
            isActive={isActive}
          />
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
