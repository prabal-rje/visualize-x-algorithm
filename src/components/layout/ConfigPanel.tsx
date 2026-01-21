import { useEffect, useRef, useState } from 'react';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/config-panel.module.css';
import { useViewport } from '../../hooks/useViewport';

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
  const count = selectedIds.length;
  const share = count > 0 ? 100 / count : 0;
  return AUDIENCES.reduce<Record<AudienceId, number>>((acc, audience) => {
    acc[audience.id] = selectedIds.includes(audience.id) ? share : 0;
    return acc;
  }, {} as Record<AudienceId, number>);
};

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

export default function ConfigPanel() {
  const personaId = useConfigStore((state) => state.personaId);
  const setPersonaId = useConfigStore((state) => state.setPersonaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const setTweetText = useConfigStore((state) => state.setTweetText);
  const shuffleSampleTweet = useConfigStore((state) => state.shuffleSampleTweet);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const setAudienceMix = useConfigStore((state) => state.setAudienceMix);
  const beginSimulation = useConfigStore((state) => state.beginSimulation);
  const { isMobile } = useViewport();

  const [step, setStep] = useState<'persona' | 'audience' | 'tweet'>('persona');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [personaTouched, setPersonaTouched] = useState(false);
  const [audienceTouched, setAudienceTouched] = useState(false);
  const toastTimeout = useRef<number | null>(null);
  const remaining = MAX_TWEET_LENGTH - tweetText.length;

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
        beginSimulation();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [beginSimulation, step]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        window.clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  const selectedAudienceIds = AUDIENCES.filter(
    (audience) => (audienceMix[audience.id] ?? 0) > 0
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
    <div className={styles.panel} data-testid="config-panel">
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
      <header className={styles.header} />

      {step === 'persona' && (
        <section className={styles.section} data-testid="step-persona">
          <h3 className={styles.sectionTitle}>Persona</h3>
          <div
            className={styles.personaGrid}
            data-testid="persona-grid"
            data-layout={isMobile ? 'mobile' : 'desktop'}
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
          <div className={styles.stepActions}>
            <button
              className={styles.stepButton}
              onClick={() => {
                if (!personaTouched && !audienceTouched) {
                  showDefaultsToast();
                }
                setStep('audience');
              }}
              type="button"
            >
              Continue to Audience
            </button>
          </div>
        </section>
      )}

      {step === 'audience' && (
        <section className={styles.section} data-testid="step-audience">
          <h3 className={styles.sectionTitle}>Audience Mix</h3>
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
          <div className={styles.stepActions}>
            <button
              className={styles.stepButtonGhost}
              onClick={() => setStep('persona')}
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
                setStep('tweet');
              }}
              type="button"
            >
              Continue to Tweet
            </button>
          </div>
        </section>
      )}

      {step === 'tweet' && (
        <section className={styles.section} data-testid="step-tweet">
          <h3 className={styles.sectionTitle}>Tweet Draft</h3>
          <div className={styles.sampleRow}>
            <button
              className={styles.shuffleButton}
              data-testid="sample-shuffle"
              onClick={shuffleSampleTweet}
              type="button"
            >
              <span className={styles.shuffleIcon} aria-hidden="true">
                <svg viewBox="0 0 20 20" role="presentation">
                  <path
                    d="M3 5h4l2 2 2-2h6M15 3l2 2-2 2M3 15h4l2-2 2 2h6M15 13l2 2-2 2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              Shuffle Draft
            </button>
          </div>
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
          <div className={styles.stepActions}>
            <button
              className={styles.stepButtonGhost}
              onClick={() => setStep('audience')}
              type="button"
            >
              Back to Audience
            </button>
            <button
              className={styles.beginButton}
              data-testid="begin-simulation"
              onClick={beginSimulation}
              type="button"
            >
              BEGIN SIMULATION
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
