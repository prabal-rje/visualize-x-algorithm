# Work Review 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Address UX feedback across desktop/tablet/mobile by consolidating redundant views, improving progressive animations, fixing mobile layout failures, and clarifying core interactions.

**Architecture:** Update existing chapter components, layout shell, and visualization widgets; add supporting UI components (toast, multi-select, function stack). Use web worker for embeddings and Matryoshka N=30 for similarity preview while preserving 128-D final vectors.

**Tech Stack:** React + TypeScript, CSS Modules, Vitest, Chrome MCP for visual verification.

---

### Task 1: Defaults Warning Toast (Ch0)

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/styles/config-panel.module.css`
- Test: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```ts
it('shows defaults toast when advancing without explicit choices', () => {
  render(<ConfigPanel />);
  fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
  expect(screen.getByText(/Using defaults:/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL (toast missing).

**Step 3: Write minimal implementation**

- Track whether persona/audience/tweet was explicitly modified.
- On advance without explicit choice, show a toast with default summary.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/ConfigPanel.tsx src/styles/config-panel.module.css src/components/layout/ConfigPanel.test.tsx
git commit -m "feat: add defaults toast for loadout"
```

---

### Task 2: Remove Expert Mode + Redundant Loadout Header

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/styles/config-panel.module.css`
- Modify: `src/components/layout/ConfigPanel.test.tsx`
- Modify: `src/stores/config.ts` (if expert mode state is removed)

**Step 1: Write the failing test**

```ts
it('does not render expert mode toggle', () => {
  render(<ConfigPanel />);
  expect(screen.queryByLabelText(/Expert Mode/i)).not.toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL (toggle exists).

**Step 3: Write minimal implementation**

- Remove Expert Mode checkbox and helper copy from ConfigPanel.
- Remove redundant Mission Loadout heading in sub-steps.
- If expert mode is unused, remove from config store and dependent UI.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/ConfigPanel.tsx src/styles/config-panel.module.css src/components/layout/ConfigPanel.test.tsx src/stores/config.ts
git commit -m "refactor: remove expert mode toggle"
```

---

### Task 3: Audience Multi-Select + Persona Defaults

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/styles/config-panel.module.css`
- Modify: `src/stores/config.ts`
- Modify: `src/data/audiences.ts`
- Test: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```ts
it('toggles audience selections via multi-select chips', () => {
  render(<ConfigPanel />);
  fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
  const chip = screen.getByTestId('audience-chip-tech');
  expect(chip).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(chip);
  expect(chip).toHaveAttribute('aria-pressed', 'false');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL (chips missing).

**Step 3: Write minimal implementation**

- Replace sliders with button chips.
- Add persona->audience default mapping and apply on persona select.
- Persist selected audiences in store.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/ConfigPanel.tsx src/styles/config-panel.module.css src/stores/config.ts src/data/audiences.ts src/components/layout/ConfigPanel.test.tsx
git commit -m "feat: replace audience sliders with multi-select"
```

---

### Task 4: Mobile Layout Fixes for Ch0

**Files:**
- Modify: `src/styles/config-panel.module.css`
- Modify: `src/components/layout/ConfigPanel.tsx`
- Test: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```ts
it('marks persona grid as single-column on mobile', () => {
  render(<ConfigPanel />);
  expect(screen.getByTestId('persona-grid')).toHaveAttribute('data-layout', 'mobile');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL (attribute missing).

**Step 3: Write minimal implementation**

- Add `data-layout` attribute based on viewport hook.
- Update CSS for single-column grid, full-width CTAs, larger tap targets.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/styles/config-panel.module.css src/components/layout/ConfigPanel.tsx src/components/layout/ConfigPanel.test.tsx
git commit -m "feat: fix mobile loadout layout"
```

---

### Task 5: Momentum Formatting + Function Reference Consolidation

**Files:**
- Modify: `src/components/layout/Timeline.tsx`
- Modify: `src/components/layout/MissionReport.tsx`
- Modify: `src/components/chapters/Chapter1Scene.tsx`
- Test: `src/components/layout/MissionReport.test.tsx`

**Step 1: Write the failing test**

```ts
it('formats momentum to one decimal place', () => {
  render(<MissionReport stats={{ momentum: 13.528678304239403 }} />);
  expect(screen.getByText(/13.5%/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/MissionReport.test.tsx`
Expected: FAIL (unformatted).

**Step 3: Write minimal implementation**

- Format momentum with `toFixed(1)` and trim.
- Remove redundant function reference line at bottom of Chapter 1.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/MissionReport.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/MissionReport.tsx src/components/layout/MissionReport.test.tsx src/components/chapters/Chapter1Scene.tsx
+git commit -m "fix: format momentum and reduce redundancy"
```

---

### Task 6: Chapter 1 Enhancements (Emoji Flow + Avatar)

**Files:**
- Modify: `src/components/chapters/Chapter1Scene.tsx`
- Modify: `src/styles/chapter1-scene.module.css`
- Test: `src/components/chapters/Chapter1Scene.test.tsx`

**Step 1: Write the failing test**

```ts
it('renders engagement emoji flow into history', () => {
  render(<Chapter1Scene currentStep={0} isActive={true} />);
  expect(screen.getByTestId('engagement-emoji-flow')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter1Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add emoji flow container with floating icons.
- Add a compact avatar/badge for USER_PROFILE.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter1Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter1Scene.tsx src/styles/chapter1-scene.module.css src/components/chapters/Chapter1Scene.test.tsx
git commit -m "feat: add chapter 1 emoji flow and avatar"
```

---

### Task 7: Chapter 2 Progressive Animation + Hover Fixes

**Files:**
- Modify: `src/components/chapters/Chapter2Scene.tsx`
- Modify: `src/components/visualization/VectorSpace.tsx`
- Modify: `src/styles/chapter2-scene.module.css`
- Modify: `src/styles/vector-space.module.css`
- Test: `src/components/chapters/Chapter2Scene.test.tsx`

**Step 1: Write the failing test**

```ts
it('shows tokenization stage before pooling', async () => {
  render(<Chapter2Scene currentStep={0} isActive={true} />);
  expect(screen.getByTestId('token-stage')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter2Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add staged UI: tokenize -> per-token embeddings -> pooling -> final vector.
- Ensure token list scrolls and shows all tokens.
- Fix function label for step 2A.
- Improve vector space tooltip opacity and hover behavior (user shows tweet text).
- Add similarity-based dot size/brightness and placement animation.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter2Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter2Scene.tsx src/components/visualization/VectorSpace.tsx src/styles/chapter2-scene.module.css src/styles/vector-space.module.css src/components/chapters/Chapter2Scene.test.tsx
git commit -m "feat: animate chapter 2 and improve hover"
```

---

### Task 8: Chapter 3 Consolidation + Filtering Animation

**Files:**
- Modify: `src/components/chapters/Chapter3Scene.tsx`
- Modify: `src/styles/chapter3-scene.module.css`
- Modify: `src/data/chapters.ts`
- Test: `src/components/chapters/Chapter3Scene.test.tsx`

**Step 1: Write the failing test**

```ts
it('renders multiple filters per step with stack', () => {
  render(<Chapter3Scene currentStep={0} isActive={true} />);
  expect(screen.getByTestId('filter-stack')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter3Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Consolidate filters per step and add stack UI.
- Animate filtered posts removal.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter3Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter3Scene.tsx src/styles/chapter3-scene.module.css src/data/chapters.ts src/components/chapters/Chapter3Scene.test.tsx
git commit -m "feat: consolidate chapter 3 filters"
```

---

### Task 9: Chapter 4 Scoring Animations + Merge Steps

**Files:**
- Modify: `src/components/chapters/Chapter4Scene.tsx`
- Modify: `src/styles/chapter4-scene.module.css`
- Modify: `src/data/chapters.ts`
- Test: `src/components/chapters/Chapter4Scene.test.tsx`

**Step 1: Write the failing test**

```ts
it('animates attention bars on active step', () => {
  render(<Chapter4Scene currentStep={0} isActive={true} />);
  expect(screen.getByTestId('attention-bars')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter4Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add progressive attention bar animation and hover details.
- Merge redundant steps and update chapter data.
- Animate score calculation for P(like)/P(retweet) aggregation.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter4Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter4Scene.tsx src/styles/chapter4-scene.module.css src/data/chapters.ts src/components/chapters/Chapter4Scene.test.tsx
git commit -m "feat: animate chapter 4 scoring"
```

---

### Task 10: Chapter 5 Top-K + Engagement Cascade

**Files:**
- Modify: `src/components/chapters/Chapter5Scene.tsx`
- Modify: `src/styles/chapter5-scene.module.css`
- Test: `src/components/chapters/Chapter5Scene.test.tsx`

**Step 1: Write the failing test**

```ts
it('shows user tweet in top-k ranking', () => {
  render(<Chapter5Scene currentStep={0} isActive={true} />);
  expect(screen.getByTestId('user-tweet-rank')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter5Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Replace Candidate A/B/C with tweet previews.
- Add avatar library usage and emoji cascade animation.
- Progressive stat reveal.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter5Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter5Scene.tsx src/styles/chapter5-scene.module.css src/components/chapters/Chapter5Scene.test.tsx
git commit -m "feat: improve chapter 5 delivery"
```

---

### Task 11: Navigation + Function Stack Header

**Files:**
- Modify: `src/components/layout/Timeline.tsx`
- Modify: `src/styles/timeline.module.css`
- Modify: `src/components/layout/AppShell.tsx` (if exists)
- Test: `src/components/layout/Timeline.test.tsx`

**Step 1: Write the failing test**

```ts
it('renders function stack header', () => {
  render(<Timeline position={defaultPosition} status="running" dispatch={mockDispatch} />);
  expect(screen.getByTestId('function-stack')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add function stack header (marquee on desktop, vertical stack on mobile).
- Consolidate function references to one location.
- Add mobile chapter menu/scroll indicator.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/Timeline.tsx src/styles/timeline.module.css src/components/layout/Timeline.test.tsx
+git commit -m "feat: add function stack header"
```

---

### Task 12: Web Worker + Matryoshka N=30

**Files:**
- Create: `src/ml/embeddingWorker.ts`
- Modify: `src/ml/embeddings.ts`
- Modify: `src/ml/similarity.ts`
- Test: `src/ml/embeddings.test.ts`

**Step 1: Write the failing test**

```ts
it('computes similarity using 30 dims for preview', async () => {
  const embedding = Array(128).fill(0.1);
  const similarity = cosinePreview(embedding, embedding);
  expect(similarity).toBeGreaterThan(0.9);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/ml/embeddings.test.ts`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Move embedding calls to worker.
- Add preview similarity using N=30 dims.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/ml/embeddings.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/ml/embeddingWorker.ts src/ml/embeddings.ts src/ml/similarity.ts src/ml/embeddings.test.ts
git commit -m "feat: worker embeddings with matryoshka preview"
```

---

### Task 13: Chrome MCP Screenshots + Verification

**Files:**
- Modify: `.codex/TODO.md`
- Modify: `.codex/work_review_2/FEEDBACK_TODO.md`

**Step 1: Capture Chrome MCP screenshots**

- Desktop 1440x900, 1920x1080
- Tablet 768x1024
- Mobile 375x812 or 390x844
- Zoom levels 90% and 110%

**Step 2: Run targeted tests**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx src/components/chapters/Chapter1Scene.test.tsx src/components/chapters/Chapter2Scene.test.tsx src/components/chapters/Chapter3Scene.test.tsx src/components/chapters/Chapter4Scene.test.tsx src/components/chapters/Chapter5Scene.test.tsx src/components/layout/Timeline.test.tsx`
Expected: PASS.

**Step 3: Commit**

```bash
git add .codex/TODO.md .codex/work_review_2/FEEDBACK_TODO.md
+git commit -m "chore: update work review 2 checklist"
```
