# TODO Stack

Instructions:
1. This file is a stack; the top-most unchecked item is done first.
2. Keep items ordered by priority; insert new tasks in place (do not just append).
3. Use headings for hierarchy; keep child tasks under the relevant parent.
4. When a task is done, mark it [x] and move it to the Completed section.

## Stack (Top = next)

### 0. Immediate: RPG Chapter Revamp & Verification

#### Pre-Start
 


#### Design & Plan
 


#### Phase 1: Loadout Chapter + Arena Gating
 


#### Phase 2: CRT Controls Overlay
 

##### Phase 2.5: Square-ish dimensions
 
- [ ] Move progress bar, the chapter buttons, the file name, and the start over /back/pause/next buttons at the top  above the simulation arena ...
- [ ] Simulation arena should largely fit a regular computers screen without vertical scroll ... across loadout and chapter visualizations/simulations...

#### Phase 3: Embedding + Hover Fix
- [ ] Add token-level (sub-token) embedding animation flowing into mean pool.
- [ ] Animate pooled token contributions into 128-d heatmap.
- [ ] Fix vector space hover flicker (overlay or reserved layout).
- [ ] Update visualization tests.
- [ ] Playwright screenshot + commit.

#### Phase 4: Chapter 3 Split + Height Control
- [ ] Split Chapter 3 into 4 sub-steps with explanations.
- [ ] Add interactive filtering callouts per step (tweet highlights + gate focus).
- [ ] Set Chapter 3 height to half of Ch1/Ch2.
- [ ] Update chapter data + tests.
- [ ] Playwright screenshot + commit.

#### Phase 5: Chapter 4 Split + Scoring Visuals
- [ ] Add P(...) estimation flow using embedding model data.
- [ ] Enhance attention weights interactivity + explanation.
- [ ] Split Chapter 4 into granular sub-steps + height control.
- [ ] Update chapter data + tests.
- [ ] Playwright screenshot + commit.

#### Phase 6: Chapter 5 Split + Delivery Feedback
- [ ] Add input tweet performance summary (below/med/above avg).
- [ ] Add reach + audience delivery breakdown.
- [ ] Add avatar reactions (like/comment/retweet bursts).
- [ ] Split Chapter 5 into granular sub-steps + height control.
- [ ] Update chapter data + tests.
- [ ] Playwright screenshot + commit.

#### Pre-Finish
- [ ] Run Playwright end-state screenshot + final tests.
- [ ] Review `git diff`, fix style issues, ensure tests pass.
- [ ] Move completed tasks to Completed and ensure TODO empty.

### 0. CRT Fidelity Fixes

### 1. Phase 1: Foundation
### 2. Phase 2: Configuration Panel

### 2.5 RPG Experience Layer

### 3. Phase 3: ML Pipeline

### 4. Phase 4: Timeline and Chapter Framework

### 5. Phase 5: Chapters 1 and 2

### 6. Phase 6: Chapter 3 (Filtering)

### 7. Phase 7: Chapter 4 (Scoring)

### 8. Phase 8: Chapter 5 (Delivery)

### 9. Phase 9: Audio System

### 10. Phase 10: Polish and Mobile

### 11. Design Spec Testing Checklist

## Completed
- [x] Fix chapter canvas to a stable proportion across chapters (desktop + mobile).
- [x] Add test marker for fixed proportion.
- [x] Playwright screenshot + commit.
- [x] Replace side-panel controls with edge handle + in-screen dialog.
- [x] Ensure dialog is CRT-native (no traditional UI chrome) and anchored to screen.
- [x] Add open/close animations + focus-safe close control.
- [x] Update CRT controls tests.
- [x] Playwright screenshot + commit.
- [x] Verify Chapter 0 loadout steps (persona/audience/tweet) are the only view before simulation.
- [x] Ensure simulation arena content stays hidden until simulation starts.
- [x] Re-run chapter/timeline tests if needed.
- [x] Playwright screenshot + commit.
- [x] Draft design doc for CRT overlay + embedding animation + chapters 3-5 split + hover fix.
- [x] Draft implementation plan with TDD steps and phase-by-phase commits.
- [x] Commit design + plan docs.
- [x] Capture baseline Playwright screenshot (pre-start).
- [x] Exclude `.worktrees` from test discovery to avoid cross-worktree runs.
- [x] Draft design doc for loadout chapter + chapters 3-5 revamp; commit.
- [x] Draft implementation plan for chapter revamp; commit.
- [x] Add new chapter data + timeline labels for loadout and expanded steps.
- [x] Create loadout chapter scene using persona/audience/tweet steps.
- [x] Render loadout scene in chapter canvas when simulation idle.
- [x] Sync simulation state on begin/reset to start at chapter 1.
- [x] Update timeline + chapter tests for new chapter order.
- [x] Playwright screenshot + commit.
- [x] Capture baseline Playwright screenshot (pre-start).
- [x] Confirm relevant design-spec + appendix sections referenced for chapters 0-5.
- [x] Animate tweet tokenization into pooled 128-d vector.
- [x] Show hovered vector tweet details in embedding map.
- [x] Create FilterGate component with pass/fail animations.
- [x] Implement filter cascade visualization.
- [x] Show tweets flowing toward each gate.
- [x] Animate scanning effect on each filter.
- [x] Green flash + continue for passing tweets.
- [x] Red flash + slide off for rejected tweets.
- [x] Update counts in real-time.
- [x] Show user's tweet highlighted (golden glow) throughout.
- [x] Display function panels for each filter type.
- [x] Show engagement history as context tokens.
- [x] Visualize attention mechanism (which history items activate).
- [x] Animate 13 engagement probability bars filling.
- [x] Show positive vs negative action grouping.
- [x] Animate weight x probability calculation for each action.
- [x] Show contributions accumulating into final score.
- [x] Reveal final score with dramatic effect.
- [x] Show comparative ranking against other candidates.
- [x] Implement author diversity penalty visualization.
- [x] Animate top-K selection (sort and pick).
- [x] Show final visibility filter pass.
- [x] Create engagement cascade visualization.
- [x] Animate tweet reaching simulated users (expanding network).
- [x] Show engagement probabilities converting to actual actions.
- [x] Likes/reposts/replies appearing with sound effects.
- [x] Final engagement tally with comparison to predictions.
- [x] Set up Tone.js with bitcrusher effect.
- [x] Implement typewriter key sounds (pitch variation).
- [x] Implement data flow drone + chirps.
- [x] Implement filter pass (rising chime) and fail (buzz).
- [x] Implement score counting acceleration.
- [x] Implement engagement pings with stereo panning.
- [x] Implement chapter transition sounds (CRT power-on).
- [x] Add ambient low-frequency drone.
- [x] Implement mute toggle with CRT-style icon.
- [x] Disable audio by default on mobile.
- [x] Implement mobile layout (stacked, simplified).
- [x] Reduce particle count on mobile.
- [x] Disable heavy CRT effects on mobile.
- [x] Implement reduced motion mode (`prefers-reduced-motion`).
- [x] Implement high contrast mode.
- [x] Test all chapter transitions.
- [x] Verify all GitHub links point to correct files.
- [x] Performance profiling and optimization.
- [x] Cross-browser testing (Chrome, Safari, Firefox).
- [x] Final QA against acceptance criteria.
- [x] All chapter animations play correctly in sequence.
- [x] Timeline scrubbing works without breaking animations.
- [x] Embedding computations complete without errors.
- [x] Audio plays on user interaction (autoplay blocked by browsers).
- [x] CRT effects don't cause performance issues.
- [x] Mobile layout is usable (even if simplified).
- [x] GitHub links point to correct files/lines.
- [x] Simulated engagement numbers are proportional to calculated probabilities.
- [x] High contrast mode works for accessibility.
- [x] Reduced motion mode disables animations.
- [x] Match embedding heatmap glow to each cell color (no green halo).
- [x] Show merge into candidate pool with count.
- [x] Visualize Thunder (blue) and Phoenix (orange) candidate streams.
- [x] Animate dot product similarity calculation.
- [x] Show candidate embeddings in vector space.
- [x] Animate user embedding formation (heatmap filling in).
- [x] Implement two-tower retrieval visualization.
- [x] Display function panel for `UserActionSequenceHydrator::hydrate()`.
- [x] Show user features populating.
- [x] Animate query hydration (engagement history stream).
- [x] Show user ID appearing with typewriter effect.
- [x] Animate gRPC request visualization (phone -> server).
- [x] Implement current function panel (shows active fn + GitHub link).
- [x] Add keyboard controls (space = play/pause, arrows = skip).
- [x] Implement chapter progress indicators.
- [x] Create chapter component wrapper with enter/exit animations.
- [x] Implement interactive timeline scrubber UI component.
- [x] Create `useAnimationTimer` hook for play/pause/seek.
- [x] Implement GSAP timeline with chapter markers.
- [x] Generate simulated tweet pool with embeddings.
- [x] Implement semantic `MutedKeywordFilter`.
- [x] Implement `calculateWeightedScore()` for final scores.
- [x] Implement `predictEngagement()` for action probabilities.
- [x] Implement `classifyContent()` for category detection.
- [x] Pre-compute concept embeddings on model load.
- [x] Implement embedding caching system.
- [x] Set up `@xenova/transformers` with MiniLM model.
- [x] Implement loading state with BIOS-style sequence (appendix Section G.6).
- [x] Integrate BIOS loading into App.tsx with ML store.
- [x] Add replay prompt after Mission Report.
- [x] Add badge tier calculation and Mission Report display.
- [x] Compute Reach, Resonance, Momentum from real pipeline outputs.
- [x] Add mode-aware labels for timeline and chapters (with useReducer state).
- [x] Update UI copy to RPG framing (Mission Loadout, Mission Report).
- [x] Implement mode-aware FunctionPanel (summary + Learn more gate).
- [x] Increase persona subtitle + tweet draft text size for readability.
- [x] Replace shuffle icon with retro double-arrow variant.
- [x] Add deterministic simulation + Bernoulli MLE helper and store results on begin.
- [x] Write simulation MLE design + implementation plan docs.
- [x] Pixelate Expert Mode checkbox checkmark with unicode glyph.
- [x] Restore the original shuffle icon shape.
- [x] Split config flow into stepped pages (Persona → Audience → Tweet) with navigation.
- [x] Remove sample tweet dropdown; add prominent shuffle button with icon and prefilled tweet.
- [x] Restyle Expert Mode checkbox to CRT green (no pink).
- [x] Add keyboard shortcuts (Enter to start, Tab between fields).
- [x] Store selections in Zustand config store.
- [x] Add Expert Mode toggle with helper copy and persistence.
- [x] Implement "BEGIN SIMULATION" button with CRT-style hover.
- [x] Implement shuffle button for sample tweets (appendix Section C).
- [x] Implement tweet input with character counter.
- [x] Implement audience mix sliders (8 audiences from appendix Section B).
- [x] Populate sample tweets from appendix Section C (full dataset).
- [x] Verify pixel/retro fonts are applied across UI (no modern font fallbacks).
- [x] Remove CRT curvature + rounded frame effects (no barrel distortion or curvature control).
- [x] Fix barrel distortion map so the frame isn't vertically shifted.
- [x] Add phosphor control knob (persistence + glow) to CRT controls.
- [x] Apply global phosphor glow + tracer afterglow across UI text.
- [x] Restore phosphor persistence variable + lingering trail effect (~800ms).
- [x] Replace rounded-corner "curvature" with real barrel distortion lens effect.
- [x] Implement persona selector (16 personas from appendix Section A).
- [x] Add persona technicality mapping (explicit list, default mode).
- [x] Implement marquee with attribution data from appendix (Section F).
- [x] Set up Google Fonts (VT323, Press Start 2P, IBM Plex Mono).
- [x] Create basic layout shell (marquee, canvas area, timeline, panels).
- [x] Implement CRT overlay effects (scanlines, vignette, barrel distortion).
- [x] Implement phosphor text component with ghosting.
- [x] Implement screen flicker effect.
- [x] Configure Tailwind with custom CSS variables from spec (Section 1.2.1).
- [x] Read full implementation brief, design spec, and appendix.
- [x] Create TODO stack file with instructions.
- [x] Update `.codex/AGENTS.md` with coding style and TODO guidance.
- [x] Worktree requirement waived by user; no worktree created.
- [x] Draft RPG experience + complexity-mode spec.
- [x] Review spec against the implementation brief and append gaps to the stack.
- [x] Add RPG spec artifacts to the repo.
- [x] Write implementation plan document for full checklist execution.
- [x] Add coding style guidelines and hooks to `.codex/AGENTS.md`.
- [x] Initialize Vite + React + TypeScript project.
