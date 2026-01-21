# Chapters 3-5 + Audio + Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Chapters 3-5 visualizations, embedding tokenization animation + vector hover details, audio system, and polish/mobile accessibility requirements so the TODO stack is fully complete.

**Architecture:** Add modular visualization components per chapter, a central audio engine with Zustand state, and small layout/responsiveness hooks. App composes new scenes based on simulation position while Timeline/FunctionPanel continue to reflect chapter functions.

**Tech Stack:** React + TypeScript, CSS modules, Zustand, Tone.js, Vitest + Testing Library, Playwright (manual screenshots).

### Task 1: Tokenization animation + hover details

**Files:**
- Create: `src/components/visualization/TokenizationFlow.tsx`
- Create: `src/styles/tokenization-flow.module.css`
- Modify: `src/components/chapters/Chapter2Scene.tsx`
- Modify: `src/components/visualization/VectorSpace.tsx`
- Create: `src/components/visualization/VectorSpaceHover.tsx`
- Create: `src/styles/vector-space-hover.module.css`
- Test: `src/components/visualization/TokenizationFlow.test.tsx`
- Test: `src/components/visualization/VectorSpaceHover.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/components/visualization/TokenizationFlow.test.tsx
import { render, screen } from '@testing-library/react';
import TokenizationFlow from './TokenizationFlow';

test('shows token list and pooled vector label', () => {
  render(<TokenizationFlow tweet="Hello world" isActive={true} />);
  expect(screen.getByTestId('tokenization-flow')).toBeInTheDocument();
  expect(screen.getByText(/tokens/i)).toBeInTheDocument();
  expect(screen.getByText(/128-d/i)).toBeInTheDocument();
});
```

```tsx
// src/components/visualization/VectorSpaceHover.test.tsx
import { render, screen } from '@testing-library/react';
import VectorSpaceHover from './VectorSpaceHover';

test('shows hovered tweet content', () => {
  render(<VectorSpaceHover tweet="Hello" similarity={0.42} />);
  expect(screen.getByText(/Hello/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/visualization/TokenizationFlow.test.tsx src/components/visualization/VectorSpaceHover.test.tsx -- --run`
Expected: FAIL with module not found.

**Step 3: Write minimal implementation**

```tsx
// TokenizationFlow renders tokens, pooling arrow, and a 128-dim label.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/visualization/TokenizationFlow.test.tsx src/components/visualization/VectorSpaceHover.test.tsx -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/TokenizationFlow.tsx src/styles/tokenization-flow.module.css src/components/visualization/VectorSpaceHover.tsx src/styles/vector-space-hover.module.css src/components/chapters/Chapter2Scene.tsx src/components/visualization/VectorSpace.tsx
npm test -- --run
git commit -m "feat: add tokenization animation and vector hover panel"
```

### Task 2: Chapter 3 filtering components

**Files:**
- Create: `src/components/visualization/FilterGate.tsx`
- Create: `src/styles/filter-gate.module.css`
- Create: `src/components/visualization/FilterCascade.tsx`
- Create: `src/styles/filter-cascade.module.css`
- Create: `src/components/chapters/Chapter3Scene.tsx`
- Create: `src/styles/chapter3-scene.module.css`
- Test: `src/components/visualization/FilterGate.test.tsx`
- Test: `src/components/chapters/Chapter3Scene.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import FilterGate from './FilterGate';

test('renders gate labels and counts', () => {
  render(
    <FilterGate
      label="DEDUP"
      functionName="DropDuplicatesFilter::filter()"
      totalIn={100}
      totalPass={92}
      totalFail={8}
      isActive={true}
    />
  );
  expect(screen.getByText(/DEDUP/)).toBeInTheDocument();
  expect(screen.getByText(/92/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/visualization/FilterGate.test.tsx -- --run`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
// FilterGate shows label, scanline, pass/fail counts, and tweet flow slots.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/visualization/FilterGate.test.tsx -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/FilterGate.tsx src/styles/filter-gate.module.css
npm test -- --run
git commit -m "feat: add filter gate visualization"
```

### Task 3: Chapter 4 scoring components

**Files:**
- Create: `src/components/visualization/ScoringContextTokens.tsx`
- Create: `src/components/visualization/AttentionMap.tsx`
- Create: `src/components/visualization/EngagementScoreboard.tsx`
- Create: `src/styles/scoring-context.module.css`
- Create: `src/styles/attention-map.module.css`
- Create: `src/styles/engagement-scoreboard.module.css`
- Create: `src/components/chapters/Chapter4Scene.tsx`
- Create: `src/styles/chapter4-scene.module.css`
- Test: `src/components/visualization/EngagementScoreboard.test.tsx`
- Test: `src/components/chapters/Chapter4Scene.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import EngagementScoreboard from './EngagementScoreboard';

test('renders engagement bars and final score', () => {
  render(
    <EngagementScoreboard
      actions={[{ id: 'like', label: 'Like', probability: 0.4, weight: 1 }]}
      finalScore={0.4}
      isActive={true}
    />
  );
  expect(screen.getByText(/Like/)).toBeInTheDocument();
  expect(screen.getByText(/Final/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/visualization/EngagementScoreboard.test.tsx -- --run`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
// EngagementScoreboard renders 13 probability bars, grouped actions, and score summary.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/visualization/EngagementScoreboard.test.tsx -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/ScoringContextTokens.tsx src/components/visualization/AttentionMap.tsx src/components/visualization/EngagementScoreboard.tsx src/styles/scoring-context.module.css src/styles/attention-map.module.css src/styles/engagement-scoreboard.module.css src/components/chapters/Chapter4Scene.tsx src/styles/chapter4-scene.module.css
npm test -- --run
git commit -m "feat: add chapter 4 scoring visualization"
```

### Task 4: Chapter 5 delivery components

**Files:**
- Create: `src/components/visualization/TopKSelector.tsx`
- Create: `src/components/visualization/EngagementCascade.tsx`
- Create: `src/styles/topk-selector.module.css`
- Create: `src/styles/engagement-cascade.module.css`
- Create: `src/components/chapters/Chapter5Scene.tsx`
- Create: `src/styles/chapter5-scene.module.css`
- Test: `src/components/visualization/TopKSelector.test.tsx`
- Test: `src/components/chapters/Chapter5Scene.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import TopKSelector from './TopKSelector';

test('shows selected top-K entries', () => {
  render(
    <TopKSelector
      candidates={[{ id: 'a', label: 'Tweet A', score: 0.9 }]}
      topK={1}
      isActive={true}
    />
  );
  expect(screen.getByText(/Tweet A/)).toBeInTheDocument();
  expect(screen.getByText(/Top 1/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/visualization/TopKSelector.test.tsx -- --run`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
// TopKSelector sorts and highlights selected candidates; EngagementCascade shows network pulses.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/visualization/TopKSelector.test.tsx -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/TopKSelector.tsx src/components/visualization/EngagementCascade.tsx src/styles/topk-selector.module.css src/styles/engagement-cascade.module.css src/components/chapters/Chapter5Scene.tsx src/styles/chapter5-scene.module.css
npm test -- --run
git commit -m "feat: add chapter 5 delivery visualization"
```

### Task 5: Audio system + toggle

**Files:**
- Create: `src/audio/engine.ts`
- Create: `src/stores/audio.ts`
- Modify: `src/components/effects/CRTControls.tsx`
- Modify: `src/styles/crt-controls.module.css`
- Modify: `src/components/visualization/TypewriterText.tsx`
- Modify: `src/components/visualization/DataStream.tsx`
- Modify: `src/components/visualization/FilterGate.tsx`
- Modify: `src/components/visualization/EngagementScoreboard.tsx`
- Modify: `src/components/chapters/ChapterWrapper.tsx`
- Test: `src/stores/audio.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { getDefaultAudioState } from './audio';

describe('audio store', () => {
  it('defaults to muted on mobile', () => {
    expect(getDefaultAudioState(true).enabled).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/stores/audio.test.ts -- --run`
Expected: FAIL

**Step 3: Write minimal implementation**

```ts
// audio store with enabled + muted state, getDefaultAudioState helper.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/stores/audio.test.ts -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/audio/engine.ts src/stores/audio.ts src/components/effects/CRTControls.tsx src/styles/crt-controls.module.css src/components/visualization/TypewriterText.tsx src/components/visualization/DataStream.tsx src/components/visualization/FilterGate.tsx src/components/visualization/EngagementScoreboard.tsx src/components/chapters/ChapterWrapper.tsx src/stores/audio.test.ts
npm test -- --run
git commit -m "feat: add audio engine and mute control"
```

### Task 6: App wiring + responsive polish

**Files:**
- Modify: `src/App.tsx`
- Create: `src/hooks/useViewport.ts`
- Modify: `src/components/effects/CRTOverlay.tsx`
- Modify: `src/index.css`
- Create: `src/styles/app-shell.module.css`
- Test: `src/App.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';
import { useMLStore } from './stores/ml';

test('renders chapter 3 scene when position is chapter 3', () => {
  useMLStore.getState().setReady();
  render(<App />);
  expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/App.test.tsx -- --run`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
// Render Chapter3Scene/Chapter4Scene/Chapter5Scene and add responsive layout classes.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/App.test.tsx -- --run`
Expected: PASS

**Step 5: Commit**

```bash
git add src/App.tsx src/hooks/useViewport.ts src/components/effects/CRTOverlay.tsx src/index.css src/styles/app-shell.module.css src/App.test.tsx
npm test -- --run
git commit -m "feat: wire chapters 3-5 and responsive polish"
```

### Task 7: TODO + verification checklist cleanup

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Update TODO stack**

Mark all completed items as done and move to Completed section.

**Step 2: Commit**

```bash
git add .codex/TODO.md
npm test -- --run
git commit -m "chore: complete TODO stack"
```
