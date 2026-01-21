# Work Review 1 Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close the Work Review 1 feedback by tightening layout, restoring branding, improving navigation, and polishing CRT affordances across desktop/mobile.

**Architecture:** Adjust existing layout components (App shell, Timeline, ConfigPanel, FunctionPanel, Marquee) and CSS modules to fill the arena, improve spacing, and add navigation affordances. Keep all simulation logic intact; only UI presentation and supporting metadata change.

**Tech Stack:** React + TypeScript, CSS Modules, Vitest, Chrome MCP for visual verification.

---

### Task 1: Title + Favicon Branding

**Files:**
- Modify: `index.html`
- Modify: `src/index.html.test.ts`
- Create: `public/favicon.svg`

**Step 1: Write the failing test**

```ts
// src/index.html.test.ts
it('sets the app title and favicon', () => {
  expect(html).toContain('<title>The Anatomy of Virality</title>');
  expect(html).toContain('rel="icon"');
  expect(html).toContain('favicon.svg');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/index.html.test.ts`
Expected: FAIL with title/favicon mismatch.

**Step 3: Write minimal implementation**

- Update `index.html` title to “The Anatomy of Virality”.
- Swap favicon link to `/favicon.svg`.
- Add `public/favicon.svg` CRT-styled icon (simple SVG).

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/index.html.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add index.html src/index.html.test.ts public/favicon.svg
git commit -m "chore: add CRT branding"
```

---

### Task 2: Arena Layout + Vertical Rhythm

**Files:**
- Modify: `src/styles/app-shell.module.css`
- Modify: `src/styles/chapter0-scene.module.css`
- Modify: `src/styles/config-panel.module.css`
- Modify: `src/App.test.tsx`

**Step 1: Write the failing test**

```ts
// src/App.test.tsx
it('marks chapter canvas as fill-height', () => {
  useMLStore.getState().setReady();
  render(<App />);
  expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
    'data-fill-height',
    'true'
  );
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL (attribute missing).

**Step 3: Write minimal implementation**

- Add `data-fill-height="true"` to chapter canvas.
- Reduce app shell `gap` + padding.
- Make chapter canvas flex-fill height and allow `overflow-y: auto`.
- Remove center-only alignment in Chapter 0 content.
- Expand config panel width within chapter canvas.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/styles/app-shell.module.css src/styles/chapter0-scene.module.css src/styles/config-panel.module.css src/App.test.tsx src/App.tsx
git commit -m "feat: tighten layout and fill arena"
```

---

### Task 3: Seamless Marquee Loop

**Files:**
- Modify: `src/components/layout/Marquee.tsx`
- Modify: `src/styles/marquee.module.css`
- Modify: `src/components/layout/Marquee.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/layout/Marquee.test.tsx
it('renders duplicated marquee tracks for seamless loop', () => {
  render(<Marquee />);
  expect(screen.getAllByTestId('marquee-track')).toHaveLength(2);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/Marquee.test.tsx`
Expected: FAIL (track missing).

**Step 3: Write minimal implementation**

- Duplicate marquee content into two tracks with a continuous animation.
- Use CSS to keep the loop smooth (track width + translate).

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/Marquee.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/Marquee.tsx src/styles/marquee.module.css src/components/layout/Marquee.test.tsx
git commit -m "feat: fix marquee loop"
```

---

### Task 4: Timeline Progress Context + Mobile Nav

**Files:**
- Modify: `src/components/layout/Timeline.tsx`
- Modify: `src/styles/timeline.module.css`
- Modify: `src/components/layout/Timeline.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/layout/Timeline.test.tsx
it('shows progress label and tick markers', () => {
  render(<Timeline position={defaultPosition} status="running" dispatch={mockDispatch} />);
  expect(screen.getByText(/Simulation Progress/i)).toBeInTheDocument();
  expect(screen.getAllByTestId('progress-tick')).toHaveLength(CHAPTERS.length);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add a progress label above the bar.
- Render tick markers aligned with chapter count.
- Add mobile nav icon mode with 44px targets via CSS.
- Add scroll affordance for chapter tabs on mobile.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/Timeline.tsx src/styles/timeline.module.css src/components/layout/Timeline.test.tsx
git commit -m "feat: enhance timeline progress and mobile controls"
```

---

### Task 5: Function Panel Links

**Files:**
- Modify: `src/components/layout/FunctionPanel.tsx`
- Modify: `src/styles/function-panel.module.css`
- Modify: `src/components/layout/FunctionPanel.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/layout/FunctionPanel.test.tsx
it('renders a clickable file link with icon', () => {
  render(<FunctionPanel info={mockFunctionInfo} />);
  const link = screen.getByRole('link', { name: /home-mixer\/server\.rs/i });
  expect(link).toHaveAttribute('href', mockFunctionInfo.githubUrl);
  expect(screen.getByTestId('function-file-icon')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/FunctionPanel.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Render the file path as a link with an icon.
- Ensure link points to `githubUrl`.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/FunctionPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/FunctionPanel.tsx src/styles/function-panel.module.css src/components/layout/FunctionPanel.test.tsx
git commit -m "feat: add GitHub file links"
```

---

### Task 6: Persona Grid Enhancements

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Modify: `src/styles/config-panel.module.css`
- Modify: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/layout/ConfigPanel.test.tsx
it('renders persona icons', () => {
  render(<ConfigPanel />);
  expect(screen.getAllByTestId('persona-icon').length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Render a small SVG icon per persona.
- Clamp subtitle lines and normalize card height.
- Increase grid column usage on desktop.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/ConfigPanel.tsx src/styles/config-panel.module.css src/components/layout/ConfigPanel.test.tsx
git commit -m "feat: polish persona grid"
```

---

### Task 7: CRT Controls Placement

**Files:**
- Modify: `src/styles/crt-controls.module.css`
- Modify: `src/components/effects/CRTControls.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/effects/CRTControls.test.tsx
it('positions CRT controls on the control band', () => {
  render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={() => {}} />);
  expect(screen.getByTestId('crt-controls')).toHaveAttribute('data-placement', 'control-band');
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/effects/CRTControls.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add `data-placement="control-band"` on the container.
- Move handle to top-right control band area in CSS.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/effects/CRTControls.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/styles/crt-controls.module.css src/components/effects/CRTControls.test.tsx src/components/effects/CRTControls.tsx
git commit -m "feat: reposition CRT controls"
```

---

### Task 8: Focus Ring + Large Display Scale + Chapter 2 Labels

**Files:**
- Modify: `src/index.css`
- Modify: `src/styles/chapter2-scene.module.css`
- Modify: `src/components/chapters/Chapter2Scene.tsx`
- Modify: `src/components/chapters/Chapter2Scene.test.tsx`

**Step 1: Write the failing test**

```ts
// src/components/chapters/Chapter2Scene.test.tsx
it('shows a legend label in gathering step', () => {
  render(<Chapter2Scene currentStep={1} isActive={true} />);
  expect(screen.getByText(/Legend/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/chapters/Chapter2Scene.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

- Add CRT-green focus ring in `index.css` for `:focus-visible`.
- Add subtle scale bump for large screens via CSS variables.
- Add a small legend block in Chapter 2 step 1.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/chapters/Chapter2Scene.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/index.css src/components/chapters/Chapter2Scene.tsx src/styles/chapter2-scene.module.css src/components/chapters/Chapter2Scene.test.tsx
git commit -m "feat: add focus ring, scale, and gathering legend"
```

---

### Task 9: Verification + Screenshots

**Files:**
- Modify: `.codex/TODO.md`
- Modify: `.codex/work_review_1/FEEDBACK_TODO.md`

**Step 1: Capture Chrome MCP screenshots**

- Desktop 1440x900, 1920x1080
- Tablet 768x1024
- Mobile 390x844
- Zoom levels 90% and 110%

**Step 2: Run targeted tests**

Run: `npm test -- --run src/index.html.test.ts src/App.test.tsx src/components/layout/Marquee.test.tsx src/components/layout/Timeline.test.tsx src/components/layout/FunctionPanel.test.tsx src/components/layout/ConfigPanel.test.tsx src/components/chapters/Chapter2Scene.test.tsx`
Expected: PASS.

**Step 3: Commit**

```bash
git add .codex/TODO.md .codex/work_review_1/FEEDBACK_TODO.md
git commit -m "chore: update work review checklist"
```

