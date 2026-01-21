import { useEffect, useMemo } from 'react';
import { AUDIENCES } from '../../data/audiences';
import { PERSONAS } from '../../data/personas';
import { SAMPLE_TWEETS } from '../../data/tweets';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/config-panel.module.css';

const MAX_TWEET_LENGTH = 280;

export default function ConfigPanel() {
  const expertMode = useConfigStore((state) => state.expertMode);
  const setExpertMode = useConfigStore((state) => state.setExpertMode);
  const personaId = useConfigStore((state) => state.personaId);
  const setPersonaId = useConfigStore((state) => state.setPersonaId);
  const tweetText = useConfigStore((state) => state.tweetText);
  const setTweetText = useConfigStore((state) => state.setTweetText);
  const sampleTweetId = useConfigStore((state) => state.sampleTweetId);
  const selectSampleTweet = useConfigStore((state) => state.selectSampleTweet);
  const shuffleSampleTweet = useConfigStore((state) => state.shuffleSampleTweet);
  const audienceMix = useConfigStore((state) => state.audienceMix);
  const setAudienceMixValue = useConfigStore((state) => state.setAudienceMixValue);
  const beginSimulation = useConfigStore((state) => state.beginSimulation);

  const remaining = MAX_TWEET_LENGTH - tweetText.length;
  const sampleOptions = useMemo(
    () => SAMPLE_TWEETS.map((tweet) => ({ id: tweet.id, text: tweet.text })),
    []
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;
      beginSimulation();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [beginSimulation]);

  return (
    <div className={styles.panel} data-testid="config-panel">
      <header className={styles.header}>
        <h2 className={styles.title}>Mission Loadout</h2>
        <label className={styles.expertToggle}>
          <input
            aria-label="Expert Mode"
            checked={expertMode}
            onChange={(event) => setExpertMode(event.target.checked)}
            type="checkbox"
          />
          Expert Mode
        </label>
        <p className={styles.helper}>
          Unlock deep-dive telemetry, full function signatures, and raw scores.
        </p>
      </header>

      <section className={styles.section}>
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
              <div className={styles.personaName}>{persona.name}</div>
              <div className={styles.personaSubtitle}>{persona.subtitle}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Tweet Draft</h3>
        <div className={styles.sampleRow}>
          <select
            className={styles.select}
            data-testid="sample-select"
            onChange={(event) => selectSampleTweet(event.target.value)}
            value={sampleTweetId ?? ''}
          >
            {sampleOptions.map((tweet) => (
              <option key={tweet.id} value={tweet.id}>
                {tweet.text.slice(0, 48)}...
              </option>
            ))}
          </select>
          <button
            className={styles.shuffleButton}
            data-testid="sample-shuffle"
            onClick={shuffleSampleTweet}
            type="button"
          >
            Shuffle
          </button>
        </div>
        <textarea
          className={styles.tweetInput}
          data-testid="tweet-input"
          maxLength={MAX_TWEET_LENGTH}
          onChange={(event) => setTweetText(event.target.value)}
          value={tweetText}
        />
        <div className={styles.counter} data-testid="tweet-counter">
          {tweetText.length}/{MAX_TWEET_LENGTH} ({remaining} left)
        </div>
      </section>

      <section className={styles.section}>
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
      </section>

      <section className={styles.footer}>
        <button
          className={styles.beginButton}
          data-testid="begin-simulation"
          onClick={beginSimulation}
          type="button"
        >
          BEGIN SIMULATION
        </button>
      </section>
    </div>
  );
}
