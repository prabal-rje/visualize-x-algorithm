import { useEffect, useRef, useState, useCallback } from 'react';
import { Shuffle } from 'lucide-react';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';
import { useViewport } from '../../hooks/useViewport';
import styles from '../../styles/config-panel.module.css';

const MAX_TWEET_LENGTH = 280;
type AudienceId = (typeof AUDIENCES)[number]['id'];
type PersonaId = (typeof PERSONAS)[number]['id'];

const PERSONA_AUDIENCE_DEFAULTS: Partial<Record<PersonaId, AudienceId[]>> = {
  'ai-researcher': ['tech', 'founders', 'news'],
  'software-engineer': ['tech', 'creators', 'students'],
  'tech-founder': ['founders', 'investors', 'tech'],
  'venture-capitalist': ['investors', 'founders', 'news'],
  'data-scientist': ['tech', 'news', 'students'],
  'cybersecurity-pro': ['tech', 'news', 'founders'],
  'indie-hacker': ['creators', 'tech', 'founders'],
  'product-manager': ['tech', 'creators', 'founders'],
  'content-creator': ['creators', 'casual', 'news'],
  'tech-reporter': ['news', 'tech', 'casual']
};

const buildAudienceMix = (selectedIds: AudienceId[]) => {
  const selectedCount = selectedIds.length;
  const allIds = AUDIENCES.map((a) => a.id);
  const unselectedIds = allIds.filter((id) => !selectedIds.includes(id));
  const unselectedCount = unselectedIds.length;

  // If all selected or none selected, distribute evenly
  if (selectedCount === 0 || unselectedCount === 0) {
    const share = selectedCount > 0 ? 100 / selectedCount : 0;
    return AUDIENCES.reduce<Record<AudienceId, number>>((acc, audience) => {
      acc[audience.id] = selectedIds.includes(audience.id) ? share : 0;
      return acc;
    }, {} as Record<AudienceId, number>);
  }

  // 75% to selected, 25% to unselected
  // But cap unselected share to never exceed selected share
  const selectedShare = 75 / selectedCount;
  const rawUnselectedShare = 25 / unselectedCount;
  const unselectedShare = Math.min(rawUnselectedShare, selectedShare * 0.3); // Cap at 30% of selected share

  // Redistribute any leftover to selected audiences
  const totalUnselected = unselectedShare * unselectedCount;
  const adjustedSelectedShare = (100 - totalUnselected) / selectedCount;

  return AUDIENCES.reduce<Record<AudienceId, number>>((acc, audience) => {
    acc[audience.id] = selectedIds.includes(audience.id) ? adjustedSelectedShare : unselectedShare;
    return acc;
  }, {} as Record<AudienceId, number>);
};

// Threshold to determine if an audience is "selected" (has significant share)
const SELECTED_THRESHOLD = 8;

const getPersonaInitials = (name: string) => {
  const tokens = name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean);
  const initials = tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? '')
    .join('');
  return initials || name.slice(0, 2).toUpperCase();
};

type ConfigPanelProps = {
  currentStep?: number;
  onStepForward?: () => void;
  onStepBack?: () => void;
  onBeginSimulation?: () => void;
};

const STEP_NAMES = ['persona', 'audience', 'tweet'] as const;
type StepName = (typeof STEP_NAMES)[number];

export default function ConfigPanel({ currentStep = 0, onStepForward, onStepBack, onBeginSimulation }: ConfigPanelProps) {
  const personaId = useConfigStore((state) => state.personaId);
  const setPersonaId = useConfigStore((state) => state.setPersonaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const setTweetText = useConfigStore((state) => state.setTweetText);
  const shuffleSampleTweet = useConfigStore((state) => state.shuffleSampleTweet);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const setAudienceMix = useConfigStore((state) => state.setAudienceMix);
  const { isMobile } = useViewport();

  // Derive step name from currentStep prop (controlled by simulation state)
  const step: StepName = STEP_NAMES[currentStep] ?? 'persona';

  // Helper to advance - use callback if provided, otherwise no-op
  const advanceStep = () => onStepForward?.();
  const goBackStep = () => onStepBack?.();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [personaTouched, setPersonaTouched] = useState(false);
  const [audienceTouched, setAudienceTouched] = useState(false);
  const [personaCarouselIndex, setPersonaCarouselIndex] = useState(0);
  const [audienceCarouselIndex, setAudienceCarouselIndex] = useState(0);
  const toastTimeout = useRef<number | null>(null);
  const remaining = MAX_TWEET_LENGTH - tweetText.length;

  const cyclePersona = useCallback((direction: 'left' | 'right') => {
    setPersonaCarouselIndex((prev) => {
      if (direction === 'left') {
        return prev === 0 ? PERSONAS.length - 1 : prev - 1;
      } else {
        return prev === PERSONAS.length - 1 ? 0 : prev + 1;
      }
    });
  }, []);

  const cycleAudience = useCallback((direction: 'left' | 'right') => {
    setAudienceCarouselIndex((prev) => {
      if (direction === 'left') {
        return prev === 0 ? AUDIENCES.length - 1 : prev - 1;
      } else {
        return prev === AUDIENCES.length - 1 ? 0 : prev + 1;
      }
    });
  }, []);

  const showDefaultsToast = () => {
    setToastMessage('Using defaults: AI/ML Researcher persona, balanced audience mix.');
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current);
    }
    toastTimeout.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;
      if (step === 'tweet') {
        onBeginSimulation?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onBeginSimulation, step]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        window.clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  const selectedAudienceIds = AUDIENCES.filter(
    (audience) => (audienceMix[audience.id] ?? 0) >= SELECTED_THRESHOLD
  ).map((audience) => audience.id);

  const handleAudienceToggle = (audienceId: AudienceId) => {
    setAudienceTouched(true);
    const nextSelected = selectedAudienceIds.includes(audienceId)
      ? selectedAudienceIds.filter((id) => id !== audienceId)
      : [...selectedAudienceIds, audienceId];
    if (nextSelected.length === 0) {
      return;
    }
    setAudienceMix(buildAudienceMix(nextSelected));
  };

  const applyPersonaDefaults = (personaId: PersonaId) => {
    const defaults =
      PERSONA_AUDIENCE_DEFAULTS[personaId] ??
      (AUDIENCES.map((audience) => audience.id) as AudienceId[]);
    setAudienceMix(buildAudienceMix(defaults));
  };

  return (
    <div className={styles.panel} data-testid="config-panel" data-surface="bare">
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
      <header className={styles.header} />

      {step === 'persona' && (
        <section className={styles.section} data-testid="step-persona">
          <h3 className={styles.sectionTitle}>Persona</h3>
          {isMobile ? (
            <>
              <div className={styles.personaCarouselWrapper}>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                  onClick={() => cyclePersona('left')}
                  aria-label="Previous persona"
                >
                  ◀
                </button>
                <div
                  className={styles.personaGrid}
                  data-testid="persona-grid"
                  data-layout="mobile"
                >
                  {(() => {
                    const persona = PERSONAS[personaCarouselIndex];
                    return (
                      <button
                        key={persona.id}
                        type="button"
                        className={
                          persona.id === personaId ? styles.personaActive : styles.persona
                        }
                        aria-pressed={persona.id === personaId}
                        onClick={() => {
                          setPersonaId(persona.id);
                          setPersonaTouched(true);
                          if (!audienceTouched) {
                            applyPersonaDefaults(persona.id);
                          }
                          // Auto-advance to audience on mobile
                          advanceStep();
                        }}
                      >
                        <div className={styles.personaHeader}>
                          <span
                            className={styles.personaIcon}
                            data-testid="persona-icon"
                            aria-hidden="true"
                          >
                            {getPersonaInitials(persona.name)}
                          </span>
                          <div className={styles.personaName}>{persona.name}</div>
                        </div>
                        <div
                          className={`${styles.personaSubtitle} ${styles.personaSubtitleLarge}`}
                        >
                          {persona.subtitle}
                        </div>
                      </button>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                  onClick={() => cyclePersona('right')}
                  aria-label="Next persona"
                >
                  ▶
                </button>
              </div>
              <div className={styles.carouselCounter}>
                {personaCarouselIndex + 1} / {PERSONAS.length} — tap to select
              </div>
            </>
          ) : (
            <div
              className={styles.personaGrid}
              data-testid="persona-grid"
              data-layout="desktop"
            >
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  className={
                    persona.id === personaId ? styles.personaActive : styles.persona
                  }
                  aria-pressed={persona.id === personaId}
                  onClick={() => {
                    setPersonaId(persona.id);
                    setPersonaTouched(true);
                    if (!audienceTouched) {
                      applyPersonaDefaults(persona.id);
                    }
                  }}
                >
                  <div className={styles.personaHeader}>
                    <span
                      className={styles.personaIcon}
                      data-testid="persona-icon"
                      aria-hidden="true"
                    >
                      {getPersonaInitials(persona.name)}
                    </span>
                    <div className={styles.personaName}>{persona.name}</div>
                  </div>
                  <div
                    className={`${styles.personaSubtitle} ${styles.personaSubtitleLarge}`}
                  >
                    {persona.subtitle}
                  </div>
                </button>
              ))}
            </div>
          )}
          {!isMobile && (
            <div className={styles.stepActions}>
              <button
                className={styles.stepButton}
                onClick={() => {
                  if (!personaTouched && !audienceTouched) {
                    showDefaultsToast();
                  }
                  advanceStep();
                }}
                type="button"
              >
                Continue to Audience
              </button>
            </div>
          )}
        </section>
      )}

      {step === 'audience' && (
        <section className={styles.section} data-testid="step-audience">
          <h3 className={styles.sectionTitle}>Audience</h3>
          {isMobile ? (
            <>
              <div className={styles.personaCarouselWrapper}>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                  onClick={() => cycleAudience('left')}
                  aria-label="Previous audience"
                >
                  ◀
                </button>
                <div
                  className={styles.personaGrid}
                  data-testid="audience-carousel"
                  data-layout="mobile"
                >
                  {(() => {
                    const audience = AUDIENCES[audienceCarouselIndex];
                    const isSelected = selectedAudienceIds.includes(audience.id);
                    return (
                      <button
                        key={audience.id}
                        type="button"
                        data-testid={`audience-chip-${audience.id}`}
                        className={
                          isSelected ? styles.personaActive : styles.persona
                        }
                        aria-pressed={isSelected}
                        onClick={() => {
                          // On mobile, single-select: clear others and select this one
                          setAudienceMix(buildAudienceMix([audience.id]));
                          setAudienceTouched(true);
                          // Auto-advance to tweet
                          advanceStep();
                        }}
                      >
                        <div className={styles.personaName}>{audience.label}</div>
                      </button>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                  onClick={() => cycleAudience('right')}
                  aria-label="Next audience"
                >
                  ▶
                </button>
              </div>
              <div className={styles.carouselCounter}>
                {audienceCarouselIndex + 1} / {AUDIENCES.length} — tap to select
              </div>
            </>
          ) : (
            <div className={styles.audienceList}>
              {AUDIENCES.map((audience) => {
                const isSelected = selectedAudienceIds.includes(audience.id);
                return (
                  <button
                    key={audience.id}
                    type="button"
                    data-testid={`audience-chip-${audience.id}`}
                    className={
                      isSelected ? styles.audienceChipActive : styles.audienceChip
                    }
                    aria-pressed={isSelected}
                    onClick={() => handleAudienceToggle(audience.id)}
                  >
                    <span className={styles.audienceLabel}>{audience.label}</span>
                    <span className={styles.audienceMeta}>
                      {isSelected ? 'Selected' : 'Tap to add'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {!isMobile && (
            <div className={styles.stepActions}>
              <button
                className={styles.stepButtonGhost}
                onClick={() => goBackStep()}
                type="button"
              >
                Back to Persona
              </button>
              <button
                className={styles.stepButton}
                onClick={() => {
                  if (!audienceTouched && !personaTouched) {
                    showDefaultsToast();
                  }
                  advanceStep();
                }}
                type="button"
              >
                Continue to Tweet
              </button>
            </div>
          )}
        </section>
      )}

      {step === 'tweet' && (
        <section className={styles.section} data-testid="step-tweet">
          <h3 className={styles.sectionTitle}>Tweet Draft</h3>
          {!isMobile && (
            <div className={styles.sampleRow}>
              <button
                className={styles.shuffleButton}
                data-testid="sample-shuffle"
                onClick={shuffleSampleTweet}
                type="button"
              >
                <Shuffle className={styles.shuffleIcon} aria-hidden="true" size={18} />
                Shuffle Draft
              </button>
            </div>
          )}
          <textarea
            className={`${styles.tweetInput} ${styles.tweetInputLarge}`}
            data-testid="tweet-input"
            maxLength={MAX_TWEET_LENGTH}
            onChange={(event) => setTweetText(event.target.value)}
            value={tweetText}
          />
          <div className={styles.counter} data-testid="tweet-counter">
            {tweetText.length}/{MAX_TWEET_LENGTH} ({remaining} left)
          </div>
          {isMobile ? (
            <div className={styles.mobileButtonRow}>
              <button
                className={styles.shuffleButtonMobile}
                data-testid="sample-shuffle"
                onClick={shuffleSampleTweet}
                type="button"
              >
                <Shuffle className={styles.shuffleIcon} aria-hidden="true" size={16} />
                Shuffle
              </button>
              <button
                className={styles.beginButtonOrange}
                data-testid="begin-simulation"
                onClick={() => onBeginSimulation?.()}
                type="button"
              >
                BEGIN
              </button>
            </div>
          ) : (
            <div className={styles.stepActions}>
              <button
                className={styles.stepButtonGhost}
                onClick={() => goBackStep()}
                type="button"
              >
                Back to Audience
              </button>
              <button
                className={styles.beginButton}
                data-testid="begin-simulation"
                onClick={() => onBeginSimulation?.()}
                type="button"
              >
                BEGIN SIMULATION
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
