import { useEffect, useState } from 'react';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/config-panel.module.css';

const MAX_TWEET_LENGTH = 280;

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
  const expertMode = useConfigStore((state) => state.expertMode);
  const setExpertMode = useConfigStore((state) => state.setExpertMode);
  const personaId = useConfigStore((state) => state.personaId);
  const setPersonaId = useConfigStore((state) => state.setPersonaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const setTweetText = useConfigStore((state) => state.setTweetText);
  const shuffleSampleTweet = useConfigStore((state) => state.shuffleSampleTweet);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const setAudienceMixValue = useConfigStore((state) => state.setAudienceMixValue);
  const beginSimulation = useConfigStore((state) => state.beginSimulation);

  const [step, setStep] = useState<'persona' | 'audience' | 'tweet'>('persona');
  const remaining = MAX_TWEET_LENGTH - tweetText.length;

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

  return (
    <div className={styles.panel} data-testid="config-panel">
      <header className={styles.header}>
        <h2 className={styles.title}>Mission Loadout</h2>
        <label className={styles.expertToggle}>
          <input
            aria-label="Expert Mode"
            checked={expertMode}
            className={styles.expertCheckbox}
            data-testid="expert-check"
            onChange={(event) => setExpertMode(event.target.checked)}
            type="checkbox"
          />
          Expert Mode
        </label>
        <p className={styles.helper}>
          Unlock deep-dive telemetry, full function signatures, and raw scores.
        </p>
      </header>

      {step === 'persona' && (
        <section className={styles.section} data-testid="step-persona">
          <h3 className={styles.sectionTitle}>Persona</h3>
          <div className={styles.personaGrid}>
            {PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                className={
                  persona.id === personaId ? styles.personaActive : styles.persona
                }
                aria-pressed={persona.id === personaId}
                onClick={() => setPersonaId(persona.id)}
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
              onClick={() => setStep('audience')}
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
            {AUDIENCES.map((audience) => (
              <label key={audience.id} className={styles.audienceRow}>
                <span>{audience.label}</span>
                <input
                  className={styles.audienceSlider}
                  data-testid={`audience-slider-${audience.id}`}
                  max={100}
                  min={0}
                  onChange={(event) =>
                    setAudienceMixValue(audience.id, Number(event.target.value))
                  }
                  step={5}
                  type="range"
                  value={audienceMix[audience.id] ?? 0}
                />
                <span className={styles.audienceValue}>
                  {Math.round(audienceMix[audience.id] ?? 0)}%
                </span>
              </label>
            ))}
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
              onClick={() => setStep('tweet')}
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
