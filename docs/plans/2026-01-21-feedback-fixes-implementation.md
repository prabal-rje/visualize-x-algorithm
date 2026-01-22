# Feedback Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove redundant arena framing, simplify Chapter 0 section framing, fix marquee and function stack duplication, add source links, and remove the Mission Report panel.

**Architecture:** Keep the chapter canvas as the single visual frame, strip outer borders, and ensure the function stack and marquee are single-track components. Use lightweight tests to lock in the simplified structure.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS, Vitest, Chrome MCP.

### Task 1: Mission Report removal

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

**Step 1: Write the failing test**

```tsx
it('does not render MissionReport when simulation has rpgStats', () => {
  useMLStore.getState().setReady();
  useConfigStore.setState({
    simulationStarted: true,
    rpgStats: { reach: 1234, resonance: 0.85, momentum: 42, percentile: 75 }
  });
  render(<App />);
  expect(screen.queryByTestId('mission-report')).not.toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL (MissionReport still rendered).

**Step 3: Write minimal implementation**

- Remove MissionReport rendering and side-panel toggle in `src/App.tsx`.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

### Task 2: Marquee single-track behavior

**Files:**
- Modify: `src/components/layout/Marquee.test.tsx`
- Modify: `src/components/layout/Marquee.tsx`
- Modify: `tailwind.config.js`

**Step 1: Write the failing test**

```tsx
it('renders a single marquee track', () => {
  render(<Marquee />);
  expect(screen.getAllByTestId('marquee-track')).toHaveLength(1);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/layout/Marquee.test.tsx`
Expected: FAIL (currently 2 tracks).

**Step 3: Write minimal implementation**

- Remove duplicated marquee track.
- Update marquee keyframes to loop a single track.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/layout/Marquee.test.tsx`
Expected: PASS.

### Task 3: Function stack single list + source link

**Files:**
- Modify: `src/components/layout/Timeline.test.tsx`
- Modify: `src/components/layout/Timeline.tsx`

**Step 1: Write the failing tests**

```tsx
it('renders a single function stack track', () => {
  render(<Timeline position={defaultPosition} status="running" dispatch={mockDispatch} />);
  expect(screen.getAllByTestId('function-stack-track')).toHaveLength(1);
});

it('links the function file to x-algorithm', () => {
  render(<Timeline position={defaultPosition} status="running" dispatch={mockDispatch} />);
  const link = screen.getByTestId('function-file-link');
  expect(link).toHaveAttribute('href', expect.stringContaining('https://github.com/xai-org/x-algorithm/blob/main/'));
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/layout/Timeline.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Remove duplicate function stack rendering.
- Add a source link anchor with a link emoji next to the file name.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/layout/Timeline.test.tsx`
Expected: PASS.

### Task 4: Remove extra arena + config panel frames

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/layout/ConfigPanel.test.tsx`
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/styles/config-panel.module.css`

**Step 1: Write the failing tests**

```tsx
it('does not apply outer frame styling to the app shell', () => {
  useMLStore.getState().setReady();
  render(<App />);
  expect(screen.getByTestId('app-shell')).not.toHaveClass('border');
});
```

```tsx
it('marks config panel as unframed', () => {
  render(<ConfigPanel />);
  expect(screen.getByTestId('config-panel')).toHaveAttribute('data-surface', 'bare');
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL.

Run: `npm test -- src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Remove outer border/rounded classes from app shell and arena wrapper.
- Add `data-surface="bare"` to ConfigPanel.
- Remove border/background/box-shadow in `config-panel.module.css`.

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

Run: `npm test -- src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

### Task 5: Verification + screenshots

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Capture Chrome MCP screenshots**

- Top bar (marquee) + function stack
- Chapter 0 persona step

**Step 2: Update TODO stack**

- Mark tasks complete and move to Completed.
