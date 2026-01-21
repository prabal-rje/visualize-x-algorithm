# Simulation MLE Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a deterministic engagement simulation with MLE rate estimation and store it when the user begins a simulation.

**Architecture:** Introduce a small `src/simulation/` module with pure functions for MLE and deterministic engagement counts. The config store becomes the integration point, computing `simulationResult` on `beginSimulation`.

**Tech Stack:** React 18, TypeScript, Zustand, Vitest.

### Task 0: Verify and commit UI sizing + shuffle icon updates

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/components/layout/ConfigPanel.test.tsx`
- Modify: `src/styles/config-panel.module.css`

**Step 1: Run focused UI test**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS

**Step 2: Commit UI changes**

```bash
git add src/components/layout/ConfigPanel.tsx src/components/layout/ConfigPanel.test.tsx src/styles/config-panel.module.css
git commit -m "feat: enlarge tweet text and refine shuffle icon"
```

### Task 1: Add MLE helper

**Files:**
- Create: `src/simulation/mle.test.ts`
- Create: `src/simulation/mle.ts`

**Step 1: Write the failing test**

```typescript
import { describe, expect, it } from 'vitest';
import { estimateBernoulliMLE } from './mle';

describe('estimateBernoulliMLE', () => {
  it('returns 0 when trials are non-positive', () => {
    expect(estimateBernoulliMLE(2, 0)).toBe(0);
  });

  it('clamps rates between 0 and 1', () => {
    expect(estimateBernoulliMLE(10, 5)).toBe(1);
  });

  it('returns successes divided by trials', () => {
    expect(estimateBernoulliMLE(2, 10)).toBeCloseTo(0.2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/simulation/mle.test.ts`
Expected: FAIL (module not found)

**Step 3: Write minimal implementation**

```typescript
export const estimateBernoulliMLE = (successes: number, trials: number) => {
  if (trials <= 0) return 0;
  const ratio = successes / trials;
  return Math.min(1, Math.max(0, ratio));
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/simulation/mle.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/simulation/mle.ts src/simulation/mle.test.ts
git commit -m "feat: add Bernoulli MLE helper"
```

### Task 2: Add deterministic engagement simulation

**Files:**
- Create: `src/simulation/simulate.test.ts`
- Create: `src/simulation/simulate.ts`

**Step 1: Write the failing test**

```typescript
import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { simulateEngagement } from './simulate';

const mix = AUDIENCES.reduce<Record<string, number>>((acc, audience) => {
  acc[audience.id] = audience.id === 'bots' ? 10 : 90 / (AUDIENCES.length - 1);
  return acc;
}, {});

describe('simulateEngagement', () => {
  it('returns MLE rates derived from counts', () => {
    const result = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'hello world',
      audienceMix: mix
    });

    expect(result.counts.impressions).toBeGreaterThan(0);
    expect(result.rates.likeRate).toBeCloseTo(
      result.counts.likes / result.counts.impressions
    );
  });

  it('increases impressions for longer tweets', () => {
    const short = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'short',
      audienceMix: mix
    });
    const long = simulateEngagement({
      personaId: 'tech-founder',
      tweetText: 'this is a much longer tweet with more detail',
      audienceMix: mix
    });

    expect(long.counts.impressions).toBeGreaterThan(short.counts.impressions);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/simulation/simulate.test.ts`
Expected: FAIL (module not found)

**Step 3: Write minimal implementation**

```typescript
import { AUDIENCES } from '../data/audiences';
import { PERSONAS } from '../data/personas';
import { estimateBernoulliMLE } from './mle';

// Implementation uses deterministic heuristics to produce counts.
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/simulation/simulate.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/simulation/simulate.ts src/simulation/simulate.test.ts
git commit -m "feat: add deterministic engagement simulation"
```

### Task 3: Store integration for simulation results

**Files:**
- Modify: `src/stores/config.test.ts`
- Modify: `src/stores/config.ts`
- Modify: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```typescript
it('computes a simulation result on begin', () => {
  useConfigStore.setState({
    personaId: 'tech-founder',
    tweetText: 'demo',
    simulationStarted: false
  });
  useConfigStore.getState().beginSimulation();
  const result = useConfigStore.getState().simulationResult;
  expect(result).not.toBeNull();
  expect(result?.rates.likeRate).toBeCloseTo(
    (result?.counts.likes ?? 0) / (result?.counts.impressions ?? 1)
  );
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/stores/config.test.ts`
Expected: FAIL (simulationResult missing)

**Step 3: Write minimal implementation**

```typescript
import { simulateEngagement } from '../simulation/simulate';

beginSimulation: () =>
  set((state) => ({
    simulationStarted: true,
    simulationResult: simulateEngagement({
      personaId: state.personaId,
      tweetText: state.tweetText,
      audienceMix: state.audienceMix
    })
  })),
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/stores/config.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/stores/config.ts src/stores/config.test.ts src/components/layout/ConfigPanel.test.tsx
git commit -m "feat: store simulation result on begin"
```

### Task 4: Update TODO and verify pre-finish hooks

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Update TODO stack**

- Insert new tasks for simulation + UI adjustments at the top.
- Mark completed tasks and move them to Completed.

**Step 2: Run focused verification**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx src/stores/config.test.ts src/simulation/mle.test.ts src/simulation/simulate.test.ts`
Expected: PASS

**Step 3: Take pre-finish screenshots**

- Use Playwright to capture Expert Mode unchecked and checked states.
- Save to `/tmp/codex-screenshots/`.

**Step 4: Commit TODO update**

```bash
git add .codex/TODO.md
git commit -m "docs: update TODO stack for simulation work"
```
