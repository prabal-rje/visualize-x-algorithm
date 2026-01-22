# Tailwind Design System Revamp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Tailwind-heavy CRT design system and refactor layout components to use it, reducing CSS module complexity while preserving behavior.

**Architecture:** Extend Tailwind theme with CRT tokens + layout scales, add shared component utilities in a global CSS layer, then refactor layout components to Tailwind classes and remove their CSS modules.

**Tech Stack:** React 18/19, TypeScript, Tailwind CSS v4, CSS layers, Vitest.

### Task 1: Add CRT design system tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Create: `src/styles/system.css`

**Step 1: Write a failing test**

Not applicable (config-only change). Proceed with configuration updates.

**Step 2: Implement design system tokens**

- Add CRT color tokens, spacing variables, shadows, fonts, keyframes/animations to `tailwind.config.js`.
- Add CSS variables for RGB tokens and layout scales to `src/index.css`.
- Add `@layer components` utilities in `src/styles/system.css` (crt panels, buttons, labels, shell layout).
- Import `src/styles/system.css` from `src/index.css`.

**Step 3: Verify build integrity**

Run: `npm test -- --runTestsByPath src/index.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add tailwind.config.js src/index.css src/styles/system.css
git commit -m "chore: add tailwind crt design system tokens"
```

### Task 2: Add design system markers (tests first)

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/components/layout/Marquee.test.tsx`
- Modify: `src/components/layout/Timeline.test.tsx`
- Modify: `src/components/visualization/BIOSLoading.test.tsx`
- Modify: `src/components/visualization/MissionReport.test.tsx`
- Modify: `src/components/visualization/ChapterWrapper.test.tsx`

**Step 1: Write the failing tests**

Add tests for `data-system` markers on core layout components:

```tsx
expect(screen.getByTestId('app-shell')).toHaveAttribute('data-system', 'shell');
expect(screen.getByTestId('marquee')).toHaveAttribute('data-system', 'marquee');
expect(screen.getByTestId('timeline')).toHaveAttribute('data-system', 'timeline');
expect(screen.getByTestId('bios-loading')).toHaveAttribute('data-system', 'bios');
expect(screen.getByTestId('mission-report')).toHaveAttribute('data-system', 'report');
expect(screen.getByTestId('chapter-wrapper-0')).toHaveAttribute('data-system', 'chapter');
```

**Step 2: Run tests to verify failure**

Run: `npm test -- --runTestsByPath src/App.test.tsx src/components/layout/Marquee.test.tsx src/components/layout/Timeline.test.tsx src/components/visualization/BIOSLoading.test.tsx src/components/visualization/MissionReport.test.tsx src/components/visualization/ChapterWrapper.test.tsx`
Expected: FAIL with missing `data-system` attributes.

**Step 3: Commit**

```bash
git add src/App.test.tsx src/components/layout/Marquee.test.tsx src/components/layout/Timeline.test.tsx src/components/visualization/BIOSLoading.test.tsx src/components/visualization/MissionReport.test.tsx src/components/visualization/ChapterWrapper.test.tsx
git commit -m "test: add design system marker expectations"
```

### Task 3: Refactor layout components to Tailwind

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Marquee.tsx`
- Modify: `src/components/layout/Timeline.tsx`
- Modify: `src/components/visualization/BIOSLoading.tsx`
- Modify: `src/components/visualization/MissionReport.tsx`
- Modify: `src/components/visualization/ChapterWrapper.tsx`

**Step 1: Write minimal implementation**

- Add `data-system` attributes as per tests.
- Replace CSS module classes with Tailwind classes and shared system utilities.
- Add Tailwind `group` + `data-*` variants for chapter wrapper animations and active state.
- Preserve DOM structure and `data-testid` values.

**Step 2: Run tests to verify pass**

Run: `npm test -- --runTestsByPath src/App.test.tsx src/components/layout/Marquee.test.tsx src/components/layout/Timeline.test.tsx src/components/visualization/BIOSLoading.test.tsx src/components/visualization/MissionReport.test.tsx src/components/visualization/ChapterWrapper.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/App.tsx src/components/layout/Marquee.tsx src/components/layout/Timeline.tsx src/components/visualization/BIOSLoading.tsx src/components/visualization/MissionReport.tsx src/components/visualization/ChapterWrapper.tsx
git commit -m "refactor: move core layout components to tailwind"
```

### Task 4: Remove unused CSS modules

**Files:**
- Delete: `src/styles/app-shell.module.css`
- Delete: `src/styles/marquee.module.css`
- Delete: `src/styles/timeline.module.css`
- Delete: `src/styles/bios-loading.module.css`
- Delete: `src/styles/mission-report.module.css`
- Delete: `src/styles/chapter-wrapper.module.css`

**Step 1: Remove imports + delete files**

Ensure no remaining imports reference these files.

**Step 2: Run tests**

Run: `npm test -- --runTestsByPath src/App.test.tsx src/components/layout/Timeline.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/styles/app-shell.module.css src/styles/marquee.module.css src/styles/timeline.module.css src/styles/bios-loading.module.css src/styles/mission-report.module.css src/styles/chapter-wrapper.module.css
git commit -m "chore: remove unused layout css modules"
```

### Task 5: Visual verification + cleanup

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Visual checks**

- Use Chrome MCP to capture desktop/tablet/mobile screenshots.
- Confirm layout, spacing, and CRT styling are consistent.

**Step 2: Run full tests and lint**

Run: `npm test`
Expected: PASS

Run: `npm run lint`
Expected: PASS

**Step 3: Update TODO + commit**

```bash
git add .codex/TODO.md
git commit -m "chore: complete tailwind design system revamp"
```
