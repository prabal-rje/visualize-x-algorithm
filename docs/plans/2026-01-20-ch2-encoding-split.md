# Chapter 2 Encoding Split Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split Chapter 2 user-tower encoding into three navigable sub-chapters (tokenize → token embeddings → pooling) with each step showing only its relevant visualization.

**Architecture:** Extend Chapter 2 subchapters in `src/data/chapters.ts` to add tokenize/embedding/pooling steps, then map those subchapter indices in `Chapter2Scene` to distinct views. Each encoding step uses a fixed `TokenizationFlow` stage and selectively renders the embedding heatmap so navigation moves through distinct pages.

**Tech Stack:** React + TypeScript, CSS modules, Vitest/Testing Library.

### Task 1: Update Chapter 2 tests for new step mapping

**Files:**
- Modify: `src/components/chapters/Chapter2Scene.test.tsx`

**Step 1: Write the failing test**

```tsx
it('shows only tokenization visuals at step 0', async () => {
  render(<Chapter2Scene {...defaultProps} currentStep={0} />);
  await waitFor(() => {
    expect(screen.getByTestId('tokenization-flow')).toBeInTheDocument();
  });
  expect(screen.queryByTestId('embedding-heatmap')).not.toBeInTheDocument();
});

it('shows embedding heatmap at step 1', async () => {
  render(<Chapter2Scene {...defaultProps} currentStep={1} />);
  await waitFor(() => {
    expect(screen.getByTestId('embedding-heatmap')).toBeInTheDocument();
  });
});

it('shows pooling stage at step 2', async () => {
  render(<Chapter2Scene {...defaultProps} currentStep={2} />);
  await waitFor(() => {
    expect(screen.getByTestId('tokenization-flow')).toHaveAttribute('data-stage', '2');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/chapters/Chapter2Scene.test.tsx`
Expected: FAIL because the step mapping and embedding visibility don’t match new expectations.

**Step 3: Write minimal implementation**

(Implementation happens in Task 2.)

**Step 4: Run test to verify it passes**

Run: `npm test src/components/chapters/Chapter2Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/chapters/Chapter2Scene.test.tsx

git commit -m "test: cover chapter 2 encoding split steps"
```

### Task 2: Split Chapter 2 subchapters and update scene mapping

**Files:**
- Modify: `src/data/chapters.ts`
- Modify: `src/components/chapters/Chapter2Scene.tsx`
- Modify: `src/styles/chapter2-scene.module.css`

**Step 1: Write the failing test**

(Use the tests from Task 1.)

**Step 2: Run test to verify it fails**

Run: `npm test src/components/chapters/Chapter2Scene.test.tsx`
Expected: FAIL until new steps are wired.

**Step 3: Write minimal implementation**

```tsx
// Chapter2Scene.tsx: map currentStep 0/1/2 to tokenization/embedding/pooling.
// Update STEP_LABELS/STEP_NARRATION to 6 entries and adjust conditional rendering for steps 3-5.
// Use a fixed encodingStage per step and only render EmbeddingHeatmap for steps 1 and 2.
```

```ts
// chapters.ts: expand ch2.subChapters to include tokenize, token embeddings, pooling, placement, similarity, merge.
// Keep function metadata aligned with each subchapter.
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/chapters/Chapter2Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/data/chapters.ts src/components/chapters/Chapter2Scene.tsx src/styles/chapter2-scene.module.css

git commit -m "feat: split chapter 2 encoding into token/embed/pool substeps"
```

### Task 3: Update TODO + capture Chrome MCP verification shots

**Files:**
- Modify: `.codex/TODO.md`
- Create: `.codex/screenshots/mcp-ch2-encoding-split-*.png`

**Step 1: Capture Chrome MCP screenshots**

Use Chrome MCP to capture tokenize/embedding/pooling pages on at least desktop + mobile (include one zoomed pass).

**Step 2: Update TODO stack**

Mark the new Chapter 2 split items as completed and move to Completed.

**Step 3: Commit**

```bash
git add .codex/TODO.md .codex/screenshots

git commit -m "chore: record chapter 2 encoding split verification"
```
