# RPG Chapter Revamp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a loadout chapter before simulation, split Chapters 3–5 into granular steps with richer visuals, make CRT controls appearable as an in-screen dialog, and verify with Playwright screenshots per phase.

**Architecture:** Extend chapter metadata to include a new Chapter 0 and more sub-steps. Create a new Chapter0Scene that embeds the configuration steps. Update App to render the loadout scene when idle and sync simulation state on begin/reset. Add new visualization components for probability estimation and avatar reactions, plus update existing tokenization/heatmap and vector space hover behavior. Keep Chapters 3–5 compact by showing one primary visualization per step and enforcing smaller heights.

**Tech Stack:** React 18 + TypeScript, CSS Modules, Zustand, Vitest + Testing Library, Playwright (manual screenshots).

---

### Task 1: Add Chapter 0 + expanded chapter metadata

**Files:**
- Modify: `src/data/chapters.ts`
- Test: `src/data/data.test.ts`

**Step 1: Write the failing test**

```ts
// src/data/data.test.ts
import { describe, expect, it } from 'vitest';
import { CHAPTERS } from './chapters';

describe('chapters metadata', () => {
  it('includes a loadout chapter at index 0', () => {
    expect(CHAPTERS[0]?.labelSimple).toMatch(/Loadout|Prep/i);
  });

  it('expands chapters 3-5 into more granular sub-steps', () => {
    const ch3 = CHAPTERS.find((chapter) => chapter.id === 'ch3');
    const ch4 = CHAPTERS.find((chapter) => chapter.id === 'ch4');
    const ch5 = CHAPTERS.find((chapter) => chapter.id === 'ch5');
    expect(ch3?.subChapters.length).toBeGreaterThanOrEqual(4);
    expect(ch4?.subChapters.length).toBeGreaterThanOrEqual(3);
    expect(ch5?.subChapters.length).toBeGreaterThanOrEqual(3);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/data/data.test.ts`
Expected: FAIL with missing loadout chapter / insufficient sub-chapters.

**Step 3: Write minimal implementation**

```ts
// src/data/chapters.ts
export const CHAPTERS: Chapter[] = [
  {
    id: 'ch0',
    number: 0,
    labelSimple: 'Loadout',
    labelTechnical: 'Mission Prep',
    subChapters: [
      { id: 'ch0-a', labelSimple: 'Persona', labelTechnical: 'Persona', functions: [/* stub */] },
      { id: 'ch0-b', labelSimple: 'Audience', labelTechnical: 'Audience', functions: [/* stub */] },
      { id: 'ch0-c', labelSimple: 'Tweet', labelTechnical: 'Tweet', functions: [/* stub */] }
    ]
  },
  // shift existing chapters and expand ch3/ch4/ch5 subChapters
];
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/data/data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/chapters.ts src/data/data.test.ts
git commit -m "feat: add loadout chapter metadata"
```

---

### Task 2: Add Chapter0Scene and render it when idle

**Files:**
- Create: `src/components/chapters/Chapter0Scene.tsx`
- Test: `src/components/chapters/Chapter0Scene.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Timeline.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/chapters/Chapter0Scene.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter0Scene from './Chapter0Scene';

describe('Chapter0Scene', () => {
  it('renders loadout chapter with config steps', () => {
    render(<Chapter0Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 0/i)).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter0Scene.test.tsx`
Expected: FAIL with missing component.

**Step 3: Write minimal implementation**

```tsx
// src/components/chapters/Chapter0Scene.tsx
import ConfigPanel from '../layout/ConfigPanel';
import TypewriterText from '../visualization/TypewriterText';
import styles from '../../styles/chapter0-scene.module.css';

export default function Chapter0Scene({ currentStep, isActive }: { currentStep: number; isActive: boolean }) {
  const narration = [
    'Choose your persona and audience before we run the model...',
    'Tune the audience mix to match who should see this...',
    'Draft the tweet that enters the simulation...'
  ];

  return (
    <div className={styles.container} data-testid="chapter-0-scene" data-active={isActive}>
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 0</span>
        <h2 className={styles.title}>MISSION PREP</h2>
      </div>
      <div className={styles.narration}>
        <TypewriterText text={narration[currentStep] || narration[0]} started={isActive} speed={24} showCursor={true} hideCursorOnComplete={true} />
      </div>
      <ConfigPanel />
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter0Scene.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter0Scene.tsx src/components/chapters/Chapter0Scene.test.tsx src/App.tsx src/components/layout/Timeline.test.tsx
git commit -m "feat: add loadout chapter scene"
```

---

### Task 3: Sync simulation state on begin/reset and render loadout when idle

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Step 1: Write the failing test**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows loadout chapter in canvas before simulation', () => {
    render(<App />);
    expect(screen.getByTestId('chapter-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('chapter-0-scene')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL with missing chapter-0-scene when idle.

**Step 3: Write minimal implementation**

```tsx
// src/App.tsx (excerpt)
const renderChapterScene = () => {
  if (mlStatus !== 'ready') return null;
  if (!simulationStarted) {
    return (
      <ChapterWrapper chapterIndex={0} isActive={true}>
        <Chapter0Scene currentStep={position.subChapterIndex} isActive={true} />
      </ChapterWrapper>
    );
  }
  // existing chapters shifted to index 1+...
};

useEffect(() => {
  if (simulationStarted) {
    dispatch({ type: 'START' });
    dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex: 1 });
  } else {
    dispatch({ type: 'RESET' });
  }
}, [simulationStarted]);
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: render loadout when idle"
```

---

### Task 4: CRT controls as an appearable in-screen dialog

**Files:**
- Modify: `src/components/effects/CRTControls.tsx`
- Modify: `src/styles/crt-controls.module.css`
- Test: `src/components/effects/CRTControls.test.tsx`
- Modify: `src/App.tsx`

**Step 1: Write the failing test**

```ts
// src/components/effects/CRTControls.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CRTControls from './CRTControls';
import { DEFAULT_CRT_CONFIG } from './crtConfig';

describe('CRTControls', () => {
  it('opens dialog when handle is clicked', () => {
    const onChange = () => undefined;
    render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('crt-controls-handle'));
    expect(screen.getByTestId('crt-controls-dialog')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/effects/CRTControls.test.tsx`
Expected: FAIL with missing handle/dialog.

**Step 3: Write minimal implementation**

```tsx
// src/components/effects/CRTControls.tsx (excerpt)
const [isOpen, setIsOpen] = useState(false);
return (
  <div className={styles.shell}>
    <button data-testid="crt-controls-handle" onClick={() => setIsOpen(true)} />
    {isOpen ? (
      <div className={styles.dialog} data-testid="crt-controls-dialog">
        <button onClick={() => setIsOpen(false)} />
        {/* existing controls */}
      </div>
    ) : null}
  </div>
);
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/effects/CRTControls.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/effects/CRTControls.tsx src/styles/crt-controls.module.css src/components/effects/CRTControls.test.tsx src/App.tsx
git commit -m "feat: make crt controls appearable dialog"
```

---

### Task 5: Token-level embedding animation + hover flicker fix

**Files:**
- Modify: `src/components/visualization/EmbeddingHeatmap.tsx`
- Modify: `src/components/visualization/TokenizationFlow.tsx`
- Modify: `src/styles/embedding-heatmap.module.css`
- Modify: `src/styles/tokenization-flow.module.css`
- Modify: `src/components/visualization/VectorSpace.tsx`
- Modify: `src/styles/vector-space.module.css`
- Test: `src/components/visualization/EmbeddingHeatmap.test.tsx`
- Test: `src/components/visualization/TokenizationFlow.test.tsx`
- Test: `src/components/visualization/VectorSpace.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/visualization/VectorSpace.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VectorSpace from './VectorSpace';

describe('VectorSpace', () => {
  it('reserves space for hover panel to avoid layout shift', () => {
    render(
      <VectorSpace
        userPoint={{ x: 50, y: 50, label: 'User' }}
        candidates={[]}
        isActive={true}
      />
    );
    expect(screen.getByTestId('vector-space-hover-slot')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/visualization/VectorSpace.test.tsx`
Expected: FAIL with missing hover slot.

**Step 3: Write minimal implementation**

```tsx
// src/components/visualization/VectorSpace.tsx (excerpt)
<div className={styles.hoverSlot} data-testid="vector-space-hover-slot">
  {showHover ? <VectorSpaceHover ... /> : null}
</div>
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/visualization/VectorSpace.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/VectorSpace.tsx src/styles/vector-space.module.css src/components/visualization/VectorSpace.test.tsx
 git commit -m "fix: reserve vector hover layout"
```

---

### Task 6: Chapter 3 split + compact height

**Files:**
- Modify: `src/components/chapters/Chapter3Scene.tsx`
- Modify: `src/styles/chapter3-scene.module.css`
- Modify: `src/data/chapters.ts`
- Test: `src/components/chapters/Chapter3Scene.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/chapters/Chapter3Scene.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter3Scene from './Chapter3Scene';

describe('Chapter3Scene', () => {
  it('renders 4th step label for content filtering', () => {
    render(<Chapter3Scene currentStep={3} isActive={true} />);
    expect(screen.getByText(/Content Filters/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter3Scene.test.tsx`
Expected: FAIL with missing step.

**Step 3: Write minimal implementation**

```ts
// src/components/chapters/Chapter3Scene.tsx
const STEP_LABELS = [
  '3A: Deduplication',
  '3B: Social Graph',
  '3C: Recency & History',
  '3D: Content Filters'
];
// Show smaller gate subsets per step and set min-height: 200px in CSS.
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter3Scene.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter3Scene.tsx src/styles/chapter3-scene.module.css src/components/chapters/Chapter3Scene.test.tsx src/data/chapters.ts
git commit -m "feat: split chapter 3 into granular steps"
```

---

### Task 7: Chapter 4 split + probability/attention visuals

**Files:**
- Modify: `src/components/chapters/Chapter4Scene.tsx`
- Modify: `src/styles/chapter4-scene.module.css`
- Create: `src/components/visualization/ProbabilityRack.tsx`
- Create: `src/styles/probability-rack.module.css`
- Modify: `src/components/visualization/AttentionMap.tsx`
- Modify: `src/styles/attention-map.module.css`
- Test: `src/components/chapters/Chapter4Scene.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/chapters/Chapter4Scene.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter4Scene from './Chapter4Scene';

describe('Chapter4Scene', () => {
  it('renders probability rack on step 2', () => {
    render(<Chapter4Scene currentStep={2} isActive={true} />);
    expect(screen.getByTestId('probability-rack')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter4Scene.test.tsx`
Expected: FAIL with missing rack.

**Step 3: Write minimal implementation**

```tsx
// src/components/visualization/ProbabilityRack.tsx
export default function ProbabilityRack({ items, isActive }: { items: Array<{ id: string; label: string; value: number }>; isActive?: boolean }) {
  return (
    <div data-testid="probability-rack">
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.label}</span>
          <span>{item.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter4Scene.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter4Scene.tsx src/styles/chapter4-scene.module.css src/components/visualization/ProbabilityRack.tsx src/styles/probability-rack.module.css src/components/visualization/AttentionMap.tsx src/styles/attention-map.module.css src/components/chapters/Chapter4Scene.test.tsx
 git commit -m "feat: split chapter 4 with probability flow"
```

---

### Task 8: Chapter 5 split + delivery feedback

**Files:**
- Modify: `src/components/chapters/Chapter5Scene.tsx`
- Modify: `src/styles/chapter5-scene.module.css`
- Create: `src/components/visualization/AvatarReactions.tsx`
- Create: `src/styles/avatar-reactions.module.css`
- Test: `src/components/chapters/Chapter5Scene.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/chapters/Chapter5Scene.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter5Scene from './Chapter5Scene';

describe('Chapter5Scene', () => {
  it('renders performance summary on step 2', () => {
    render(<Chapter5Scene currentStep={2} isActive={true} />);
    expect(screen.getByTestId('performance-summary')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter5Scene.test.tsx`
Expected: FAIL with missing summary.

**Step 3: Write minimal implementation**

```tsx
// src/components/chapters/Chapter5Scene.tsx (excerpt)
{currentStep === 2 && (
  <div data-testid="performance-summary">
    <h3>Performance</h3>
  </div>
)}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter5Scene.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter5Scene.tsx src/styles/chapter5-scene.module.css src/components/visualization/AvatarReactions.tsx src/styles/avatar-reactions.module.css src/components/chapters/Chapter5Scene.test.tsx
 git commit -m "feat: split chapter 5 with delivery feedback"
```

---

### Task 9: Playwright verification per phase + final sweep

**Files:**
- (screenshots only)

**Step 1: Start dev server**

Run: `npm run dev -- --host 127.0.0.1 --port 5175`

**Step 2: Capture screenshot**

Run: `node test-loading.mjs`
Expected: `/tmp/loading-screenshot.png` updated for the phase.

**Step 3: Repeat per phase + final**

**Step 4: Commit screenshots if required (otherwise keep as local evidence)**

---

### Task 10: Pre-finish checks

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Run test suite**

Run: `npm test`
Expected: PASS

**Step 2: Review diff**

Run: `git diff`

**Step 3: Update TODO**

Mark completed tasks, ensure stack empty, move to Completed section.

**Step 4: Commit**

```bash
git add .codex/TODO.md
git commit -m "chore: close rpg chapter revamp tasks"
```
