import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/chapter4-scene.module.css';
import { predictEngagement, calculateWeightedScore } from '../../ml/engagement';
import { classifyContent } from '../../ml/classifier';
import { isInitialized } from '../../ml/embeddings';
import { useConfigStore } from '../../stores/config';
import { AUDIENCES } from '../../data/audiences';
import { useViewport } from '../../hooks/useViewport';
import TypewriterText from '../visualization/TypewriterText';

const STEP_NARRATION = [
  'The ranker reads your recent activity to understand your interests...',
  'Based on your tweet and audience, it predicts how likely each action is...',
  'Each action type has a weight—values X chose to prioritize certain behaviors...',
  'Those probabilities multiply by weights to produce your final ranking score...',
  'Every candidate gets scored the same way. The highest scores win the spots on your timeline...'
];

const STEP_LABELS = [
  '4A: Your History',
  '4B: Engagement Odds',
  '4C: Platform Weights',
  '4D: Final Score',
  '4E: Where You Rank'
];

// Simulated engagement history - what the user has interacted with recently
const ENGAGEMENT_HISTORY = [
  { id: 'h1', action: 'liked', text: 'AI tool demo', icon: '💛' },
  { id: 'h2', action: 'replied', text: 'Startup advice', icon: '💬' },
  { id: 'h3', action: 'liked', text: 'Transformer paper', icon: '💛' },
  { id: 'h4', action: 'reposted', text: 'Product launch', icon: '🔁' },
  { id: 'h5', action: 'liked', text: 'Python tips', icon: '💛' },
  { id: 'h6', action: 'clicked', text: 'Design thread', icon: '👆' }
];

// Weights used in the scoring formula
const ACTION_WEIGHTS: Record<string, number> = {
  like: 1.0,
  repost: 2.0,
  reply: 1.5,
  bookmark: 1.2,
  click: 0.5
};

const DEFAULT_PROBS = {
  like: 0.20,
  repost: 0.12,
  reply: 0.13,
  bookmark: 0.39,
  click: 0.42
};

type Chapter4SceneProps = {
  currentStep: number;
  isActive: boolean;
};

export default function Chapter4Scene({ currentStep, isActive }: Chapter4SceneProps) {
  const tweetText = useConfigStore((state) => state.tweetText);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const { isMobile } = useViewport();
  const [probs, setProbs] = useState(DEFAULT_PROBS);
  const [contentCategory, setContentCategory] = useState<string>('tech');
  const [selectedRanking, setSelectedRanking] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        if (!isInitialized()) {
          setProbs(DEFAULT_PROBS);
          setContentCategory('tech');
          return;
        }
        const [result, classification] = await Promise.all([
          predictEngagement(tweetText || 'Hello world', audienceMix),
          classifyContent(tweetText || 'Hello world')
        ]);
        if (!isMounted) return;
        setProbs(result);
        setContentCategory(classification.topCategory.label);
      } catch (error) {
        if (!isMounted) return;
        setProbs(DEFAULT_PROBS);
        setContentCategory('tech');
        console.error('Failed to compute engagement probabilities', error);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [tweetText, audienceMix]);

  // Get top audiences for display
  const topAudiences = useMemo(() => {
    return Object.entries(audienceMix)
      .filter(([, weight]) => weight > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id, weight]) => {
        const audience = AUDIENCES.find(a => a.id === id);
        return { label: audience?.label || id, weight };
      });
  }, [audienceMix]);

  const baseScore = calculateWeightedScore(probs);
  const diversityPenalty = Math.min(0.12, baseScore * 0.1);
  const finalScore = Math.max(0, baseScore - diversityPenalty);

  const rankings = useMemo(() => {
    const userTweetPreview = (tweetText || 'Hello world').slice(0, 60) + ((tweetText?.length || 0) > 60 ? '...' : '');
    return [
      { id: 'alpha', label: 'Candidate A', score: finalScore + 0.18, isUser: false, preview: 'Breaking: Major tech company announces revolutionary AI product launch next week...' },
      { id: 'you', label: 'Your Tweet', score: finalScore, isUser: true, preview: userTweetPreview },
      { id: 'beta', label: 'Candidate B', score: Math.max(0, finalScore - 0.07), isUser: false, preview: 'Just shipped a new feature! Check out what we built over the weekend...' },
      { id: 'gamma', label: 'Candidate C', score: Math.max(0, finalScore - 0.12), isUser: false, preview: 'Interesting thread on machine learning optimization techniques for beginners...' }
    ].sort((a, b) => b.score - a.score);
  }, [finalScore, tweetText]);

  const narration = STEP_NARRATION[currentStep] || STEP_NARRATION[0];
  const label = STEP_LABELS[currentStep] || STEP_LABELS[0];

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
          text={narration}
          started={isActive}
          speed={26}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.stepLabel}>{label}</div>

        {/* Step 0: Your History */}
        {currentStep === 0 && (
          <div className={styles.panel} data-testid="history-panel">
            <div className={styles.panelHeader}>Your Recent Activity</div>
            <div className={styles.panelSubtext}>
              The algorithm knows what content you engage with
            </div>
            <div className={styles.historyList}>
              {ENGAGEMENT_HISTORY.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.historyItem}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className={styles.historyIcon}>{item.icon}</span>
                  <span className={styles.historyText}>{item.text}</span>
                  <span className={styles.historyAction}>{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Engagement Odds */}
        {currentStep === 1 && (
          <div className={styles.panel} data-testid="odds-panel">
            <div className={styles.panelHeader}>Predicted Engagement</div>
            <div className={styles.panelSubtext}>
              Probabilities computed from content + audience similarity
            </div>

            {/* Input factors */}
            <div className={styles.factorsBox}>
              <div className={styles.factorRow}>
                <span className={styles.factorLabel}>Content type:</span>
                <span className={styles.factorValue}>{contentCategory}</span>
              </div>
              <div className={styles.factorRow}>
                <span className={styles.factorLabel}>Top audiences:</span>
                <span className={styles.factorValue}>
                  {topAudiences.map(a => a.label).join(', ') || 'Mixed'}
                </span>
              </div>
            </div>

            <div className={styles.oddsList}>
              {Object.entries(probs).map(([action, prob], index) => (
                <div
                  key={action}
                  className={styles.oddsItem}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className={styles.oddsAction}>{action}</span>
                  <div className={styles.oddsBarContainer}>
                    <div
                      className={styles.oddsBar}
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                  <span className={styles.oddsValue}>{Math.round(prob * 100)}%</span>
                </div>
              ))}
            </div>

            <div className={styles.oddsNote}>
              X&apos;s Grok transformer predicts these probabilities by analyzing your tweet content, your past engagement patterns, and how similar users have engaged with similar content.
            </div>
          </div>
        )}

        {/* Step 2: Platform Weights */}
        {currentStep === 2 && (
          <div className={styles.panel} data-testid="weights-panel">
            <div className={styles.panelHeader}>Platform Weights</div>
            <div className={styles.panelSubtext}>
              Not all engagement is equal
            </div>

            <div className={styles.weightsIntro}>
              X prioritizes actions that drive platform goals—spreading content, sparking conversation, signaling high intent. Each action type gets a multiplier.
            </div>

            <div className={styles.weightsTable}>
              <div className={styles.weightsTableRow}>
                <span className={styles.weightsTableAction}>Repost</span>
                <span className={styles.weightsTableValue}>2.0×</span>
                <span className={styles.weightsTableReason}>spreads content virally</span>
              </div>
              <div className={styles.weightsTableRow}>
                <span className={styles.weightsTableAction}>Reply</span>
                <span className={styles.weightsTableValue}>1.5×</span>
                <span className={styles.weightsTableReason}>drives conversation</span>
              </div>
              <div className={styles.weightsTableRow}>
                <span className={styles.weightsTableAction}>Bookmark</span>
                <span className={styles.weightsTableValue}>1.2×</span>
                <span className={styles.weightsTableReason}>high intent signal</span>
              </div>
              <div className={styles.weightsTableRow}>
                <span className={styles.weightsTableAction}>Like</span>
                <span className={styles.weightsTableValue}>1.0×</span>
                <span className={styles.weightsTableReason}>baseline engagement</span>
              </div>
              <div className={styles.weightsTableRow}>
                <span className={styles.weightsTableAction}>Click</span>
                <span className={styles.weightsTableValue}>0.5×</span>
                <span className={styles.weightsTableReason}>passive interest</span>
              </div>
            </div>

            <div className={styles.weightsDisclaimer}>
              Actual weights are learned by the Grok transformer and not publicly disclosed. Values shown are illustrative.
            </div>
          </div>
        )}

        {/* Step 3: Final Score Calculation */}
        {currentStep === 3 && (
          <div className={styles.panel} data-testid="score-panel">
            <div className={styles.panelHeader}>Final Score</div>
            <div className={styles.panelSubtext}>
              Probabilities × weights = ranking score
            </div>

            <div className={styles.scoreBreakdown}>
              <div className={styles.formulaSection}>
                {Object.entries(probs).map(([action, prob]) => (
                  <div key={action} className={styles.formulaRow}>
                    <span className={styles.formulaAction}>{action}</span>
                    <span className={styles.formulaCalc}>
                      {Math.round(prob * 100)}% × {ACTION_WEIGHTS[action]?.toFixed(1)}
                    </span>
                    <span className={styles.formulaResult}>
                      = {(prob * (ACTION_WEIGHTS[action] || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className={styles.formulaDivider} />
                <div className={styles.formulaRow}>
                  <span className={styles.formulaAction}>Subtotal</span>
                  <span className={styles.formulaCalc} />
                  <span className={styles.formulaResult}>{baseScore.toFixed(2)}</span>
                </div>
                <div className={styles.formulaRow} data-penalty>
                  <span className={styles.formulaAction}>Diversity penalty</span>
                  <span className={styles.formulaCalc} />
                  <span className={styles.formulaResult}>-{diversityPenalty.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.finalScoreBox}>
                <span className={styles.finalScoreLabel}>Your Score</span>
                <span className={styles.finalScoreValue}>{finalScore.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Where You Rank */}
        {currentStep === 4 && (
          <div className={styles.panel} data-testid="rank-panel">
            <div className={styles.panelHeader}>Where You Rank</div>
            <div className={styles.panelSubtext}>
              Comparing your score against other candidates in the feed
            </div>

            <div className={styles.yourScoreReminder}>
              <span className={styles.reminderLabel}>Your score:</span>
              <span className={styles.reminderValue}>{finalScore.toFixed(2)}</span>
            </div>

            <div className={styles.rankingSection}>
              <div className={styles.rankingNote}>
                {isMobile ? 'Tap to preview each tweet' : 'Hover to preview each tweet'}
              </div>
              {rankings.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.rankingItem}
                  data-user={item.isUser}
                  data-mobile={isMobile}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => isMobile && setSelectedRanking(item.id)}
                >
                  <span className={styles.rankingPosition}>#{index + 1}</span>
                  <span className={styles.rankingLabel}>{item.label}</span>
                  <span className={styles.rankingScore}>{item.score.toFixed(2)}</span>
                  {!isMobile && <div className={styles.rankingTooltip}>{item.preview}</div>}
                </div>
              ))}

              {/* Mobile dialog */}
              {isMobile && selectedRanking && (
                <div className={styles.previewDialog} onClick={() => setSelectedRanking(null)}>
                  <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.previewHeader}>
                      {rankings.find(r => r.id === selectedRanking)?.label}
                      <button
                        className={styles.previewClose}
                        onClick={() => setSelectedRanking(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.previewText}>
                      {rankings.find(r => r.id === selectedRanking)?.preview}
                    </div>
                    <div className={styles.previewScore}>
                      Score: {rankings.find(r => r.id === selectedRanking)?.score.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.rankingExplainer}>
              Higher scores appear earlier in the timeline. Your position depends on how your tweet&apos;s predicted engagement compares to others competing for the same slot.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
