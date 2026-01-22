# Simulation Arena Darkness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the CRT-dark simulation arena background and ensure layouts scale cleanly across short, narrow, and wide viewports using Tailwind-first primitives.

**Architecture:** Add new CRT surface tokens (`void`, `panel-deep`) to Tailwind, apply them to the app shell and arena surfaces, and adjust spacing variables for height-based responsiveness. Keep changes isolated to layout surfaces to avoid disrupting the simulation visuals.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS, Vitest, Chrome MCP for visual verification.

### Task 1: Add failing test for arena surface classes

**Files:**
- Modify: `src/App.test.tsx`

**Step 1: Write the failing test**

```tsx
it('uses the CRT void surface for the simulation arena', () => {
  useMLStore.getState().setReady();
  render(<App />);
  expect(screen.getByTestId('chapter-canvas')).toHaveClass('bg-crt-void/90');
  expect(screen.getByTestId('app-shell')).toHaveClass('bg-crt-void');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL because the classes are not present yet.

### Task 2: Add CRT void tokens and apply arena classes

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Modify: `src/components/visualization/ChapterWrapper.tsx`
- Modify: `src/components/layout/Marquee.tsx`
- Modify: `src/components/layout/Timeline.tsx`

**Step 1: Write minimal implementation**

- Add `--crt-void-rgb` and `--crt-panel-deep-rgb` CSS variables in `src/index.css`.
- Add `crt.void` and `crt.panel-deep` colors in `tailwind.config.js` and restore default spacing scale via `defaultTheme.spacing`.
- Apply `bg-crt-void` and `bg-crt-void/90` to the app shell and chapter canvas.
- Update `ChapterWrapper` background to use `bg-crt-panel-deep/80` with the original border and inset glow.
- Darken `Marquee` and `Timeline` banding to match the deeper arena background.

**Step 2: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

### Task 3: Add height-based spacing adjustments

**Files:**
- Modify: `src/index.css`

**Step 1: Write the failing test**

N/A (CSS variable change). Verify visually via Chrome MCP.

**Step 2: Implement responsive variables**

- Add a `@media (max-height: 720px)` block to reduce `--shell-gap` and panel padding.
- Add a `@media (max-width: 560px)` block to reduce `--shell-gutter` and `--panel-pad` for smaller devices.

**Step 3: Visual verification**

- Capture Chrome MCP screenshots at 1920x1080, 1280x720, 1280x600, 768x1024, 390x844, and 844x390.

### Task 4: Pre-finish verification

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Run targeted tests**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

**Step 2: Capture final screenshots**

- Save to `.codex/screenshots/` with size suffixes.

**Step 3: Update TODO stack**

- Mark tasks complete and move them to Completed.
