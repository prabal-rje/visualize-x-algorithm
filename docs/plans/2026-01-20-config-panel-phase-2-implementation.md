# Phase 2 Configuration Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete Phase 0/2 TODO items by verifying CRT font coverage and upgrading the configuration panel with sample tweets, audience sliders, tweet input + counter, shuffle, expert mode helper + persistence, begin simulation action, and keyboard shortcut support.

**Architecture:** Expand the Zustand config store to own all configuration inputs and a start flag. The ConfigPanel reads/writes from the store, rendering the UI controls and delegating selection logic to store actions. Use CSS modules for CRT-style presentation while keeping tests focused on behavior.

**Tech Stack:** React 18, TypeScript, Zustand (with persist), Vitest + React Testing Library, CSS Modules.

---

### Task 1: Verify CRT font coverage (Phase 0)

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Verify font usage in CSS**
Run: `rg -n "font-family" src`
Expected: Only VT323 / Press Start 2P / IBM Plex Mono with monospace fallbacks.

**Step 2: Update TODO**
Move the Phase 0 item to Completed.

**Step 3: Commit**
```bash
git add .codex/TODO.md

git commit -m "docs: mark CRT font verification complete"
```

---

### Task 2: Expand config store (tweets, audiences, persistence, start)

**Files:**
- Modify: `src/stores/config.ts`
- Modify: `src/stores/config.test.ts`

**Step 1: Write failing tests**
```ts
import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { SAMPLE_TWEETS } from '../data/tweets';
import { useConfigStore } from './config';

describe('config store', () => {
  it('initializes audience mix for all audiences', () => {
    const { audienceMix } = useConfigStore.getState();
    expect(Object.keys(audienceMix)).toHaveLength(AUDIENCES.length);
  });

  it('updates tweet text and sample selection', () => {
    const { setTweetText, selectSampleTweet } = useConfigStore.getState();
    setTweetText('hello');
    expect(useConfigStore.getState().tweetText).toBe('hello');
    selectSampleTweet(SAMPLE_TWEETS[0].id);
    expect(useConfigStore.getState().sampleTweetId).toBe(SAMPLE_TWEETS[0].id);
  });

  it('toggles simulation started', () => {
    const { beginSimulation, resetSimulation } = useConfigStore.getState();
    beginSimulation();
    expect(useConfigStore.getState().simulationStarted).toBe(true);
    resetSimulation();
    expect(useConfigStore.getState().simulationStarted).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --run src/stores/config.test.ts`
Expected: FAIL because new fields/actions do not exist.

**Step 3: Implement store expansion**
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUDIENCES } from '../data/audiences';
import { PERSONAS } from '../data/personas';
import { SAMPLE_TWEETS } from '../data/tweets';

const defaultPersonaId = PERSONAS[0]?.id ?? 'tech-founder';
const defaultSample = SAMPLE_TWEETS[0];
const audienceDefault = 100 / AUDIENCES.length;

const defaultAudienceMix = AUDIENCES.reduce((acc, audience) => {
  acc[audience.id] = Number(audienceDefault.toFixed(2));
  return acc;
}, {} as Record<(typeof AUDIENCES)[number]['id'], number>);

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      expertMode: false,
      personaId: defaultPersonaId,
      tweetText: defaultSample?.text ?? '',
      sampleTweetId: defaultSample?.id ?? null,
      audienceMix: defaultAudienceMix,
      simulationStarted: false,
      setExpertMode: (value) => set({ expertMode: value }),
      setPersonaId: (personaId) => set({ personaId }),
      setTweetText: (text) => set({ tweetText: text, sampleTweetId: null }),
      selectSampleTweet: (id) => {
        const sample = SAMPLE_TWEETS.find((item) => item.id === id);
        set({ sampleTweetId: id, tweetText: sample?.text ?? '' });
      },
      shuffleSampleTweet: () => {
        const index = Math.floor(Math.random() * SAMPLE_TWEETS.length);
        const sample = SAMPLE_TWEETS[index];
        if (sample) {
          set({ sampleTweetId: sample.id, tweetText: sample.text });
        }
      },
      setAudienceMixValue: (id, value) => {
        const clamped = Math.max(0, Math.min(100, value));
        set((state) => ({
          audienceMix: { ...state.audienceMix, [id]: clamped }
        }));
      },
      beginSimulation: () => set({ simulationStarted: true }),
      resetSimulation: () => set({ simulationStarted: false })
    }),
    {
      name: 'x-algorithm-config',
      partialize: (state) => ({
        expertMode: state.expertMode,
        personaId: state.personaId,
        tweetText: state.tweetText,
        sampleTweetId: state.sampleTweetId,
        audienceMix: state.audienceMix
      })
    }
  )
);
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --run src/stores/config.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/stores/config.ts src/stores/config.test.ts

git commit -m "feat: expand config store for phase 2"
```

---

### Task 3: Build ConfigPanel UI controls and keyboard shortcuts

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/components/layout/ConfigPanel.test.tsx`
- Create: `src/styles/config-panel.module.css`

**Step 1: Write failing tests**
```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SAMPLE_TWEETS } from '../../data/tweets';
import { useConfigStore } from '../../stores/config';
import ConfigPanel from './ConfigPanel';

describe('ConfigPanel', () => {
  beforeEach(() => {
    useConfigStore.setState((state) => ({
      ...state,
      simulationStarted: false
    }));
  });

  it('renders tweet input, counter, sample controls, audiences, and begin button', () => {
    render(<ConfigPanel />);
    expect(screen.getByTestId('tweet-input')).toBeInTheDocument();
    expect(screen.getByTestId('tweet-counter')).toBeInTheDocument();
    expect(screen.getByTestId('sample-select')).toBeInTheDocument();
    expect(screen.getByTestId('sample-shuffle')).toBeInTheDocument();
    expect(screen.getByTestId('begin-simulation')).toBeInTheDocument();
    expect(screen.getByTestId('audience-slider-tech')).toBeInTheDocument();
  });

  it('updates tweet text when selecting a sample', () => {
    render(<ConfigPanel />);
    fireEvent.change(screen.getByTestId('sample-select'), {
      target: { value: SAMPLE_TWEETS[0].id }
    });
    expect(screen.getByTestId('tweet-input')).toHaveValue(SAMPLE_TWEETS[0].text);
  });

  it('shuffles sample tweets', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    render(<ConfigPanel />);
    fireEvent.click(screen.getByTestId('sample-shuffle'));
    expect(screen.getByTestId('tweet-input')).toHaveValue(SAMPLE_TWEETS.at(-1)?.text);
  });

  it('starts simulation on begin button', () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByTestId('begin-simulation'));
    expect(useConfigStore.getState().simulationStarted).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL because UI controls are missing.

**Step 3: Implement ConfigPanel UI**
```tsx
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
              className={persona.id === personaId ? styles.personaActive : styles.persona}
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
```

**Step 4: Add CRT styling**
```css
.panel {
  display: grid;
  gap: 20px;
  padding: 20px;
  border: 1px solid rgba(51, 255, 51, 0.35);
  background: rgba(10, 10, 10, 0.88);
  box-shadow: inset 0 0 30px rgba(51, 255, 51, 0.1), 0 0 24px rgba(51, 255, 51, 0.2);
}

.header {
  display: grid;
  gap: 8px;
}

.title {
  font-size: 18px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.expertToggle {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  text-transform: uppercase;
}

.helper {
  color: var(--phosphor-amber);
  font-size: 14px;
  margin: 0;
}

.section {
  display: grid;
  gap: 10px;
}

.sectionTitle {
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.personaGrid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.persona,
.personaActive {
  border: 1px solid rgba(51, 255, 51, 0.35);
  background: rgba(5, 15, 5, 0.8);
  padding: 10px;
  text-align: left;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.personaActive {
  border-color: var(--phosphor-amber);
  box-shadow: 0 0 14px rgba(255, 176, 0, 0.4);
}

.personaName {
  font-size: 16px;
}

.personaSubtitle {
  font-size: 12px;
  color: rgba(51, 255, 51, 0.7);
}

.sampleRow {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr auto;
}

.select {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(51, 255, 51, 0.35);
  color: inherit;
  padding: 6px 8px;
}

.shuffleButton {
  border: 1px solid var(--phosphor-amber);
  color: var(--phosphor-amber);
  background: transparent;
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
}

.shuffleButton:hover {
  box-shadow: 0 0 12px rgba(255, 176, 0, 0.6);
}

.tweetInput {
  min-height: 90px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(51, 255, 51, 0.35);
  color: inherit;
  padding: 10px;
  resize: vertical;
}

.counter {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.audienceList {
  display: grid;
  gap: 12px;
}

.audienceRow {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 2fr auto;
  align-items: center;
}

.audienceSlider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(51, 255, 51, 0.2);
  border: 1px solid rgba(51, 255, 51, 0.4);
}

.audienceSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--phosphor-green);
  box-shadow: 0 0 10px var(--phosphor-green);
}

.audienceSlider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--phosphor-green);
  border: none;
  box-shadow: 0 0 10px var(--phosphor-green);
}

.audienceValue {
  color: var(--phosphor-amber);
}

.footer {
  display: flex;
  justify-content: flex-end;
}

.beginButton {
  border: 1px solid var(--phosphor-green);
  background: rgba(0, 20, 0, 0.6);
  color: var(--phosphor-green);
  padding: 10px 16px;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(51, 255, 51, 0.25);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.beginButton:hover {
  box-shadow: 0 0 24px rgba(51, 255, 51, 0.6);
  transform: translateY(-1px);
}
```

**Step 5: Run test to verify it passes**
Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 6: Commit**
```bash
git add src/components/layout/ConfigPanel.tsx src/components/layout/ConfigPanel.test.tsx src/styles/config-panel.module.css

git commit -m "feat: expand config panel inputs"
```
