# TODO Stack

Instructions:
1. This file is a stack; the top-most unchecked item is done first.
2. Keep items ordered by priority; insert new tasks in place (do not just append).
3. Use headings for hierarchy; keep child tasks under the relevant parent.
4. When a task is done, mark it [x] and move it to the Completed section.

## Stack (Top = next)

### 0. CRT Fidelity Fixes

### 1. Phase 1: Foundation
### 2. Phase 2: Configuration Panel

### 2.5 RPG Experience Layer

### 3. Phase 3: ML Pipeline

### 4. Phase 4: Timeline and Chapter Framework

### 5. Phase 5: Chapters 1 and 2

### 6. Phase 6: Chapter 3 (Filtering)
- [ ] Create FilterGate component with pass/fail animations.
- [ ] Implement filter cascade visualization.
- [ ] Show tweets flowing toward each gate.
- [ ] Animate scanning effect on each filter.
- [ ] Green flash + continue for passing tweets.
- [ ] Red flash + slide off for rejected tweets.
- [ ] Update counts in real-time.
- [ ] Show user's tweet highlighted (golden glow) throughout.
- [ ] Display function panels for each filter type.

### 7. Phase 7: Chapter 4 (Scoring)
- [ ] Show engagement history as context tokens.
- [ ] Visualize attention mechanism (which history items activate).
- [ ] Animate 13 engagement probability bars filling.
- [ ] Show positive vs negative action grouping.
- [ ] Animate weight x probability calculation for each action.
- [ ] Show contributions accumulating into final score.
- [ ] Reveal final score with dramatic effect.
- [ ] Show comparative ranking against other candidates.
- [ ] Implement author diversity penalty visualization.

### 8. Phase 8: Chapter 5 (Delivery)
- [ ] Animate top-K selection (sort and pick).
- [ ] Show final visibility filter pass.
- [ ] Create engagement cascade visualization.
- [ ] Animate tweet reaching simulated users (expanding network).
- [ ] Show engagement probabilities converting to actual actions.
- [ ] Likes/reposts/replies appearing with sound effects.
- [ ] Final engagement tally with comparison to predictions.

### 9. Phase 9: Audio System
- [ ] Set up Tone.js with bitcrusher effect.
- [ ] Implement typewriter key sounds (pitch variation).
- [ ] Implement data flow drone + chirps.
- [ ] Implement filter pass (rising chime) and fail (buzz).
- [ ] Implement score counting acceleration.
- [ ] Implement engagement pings with stereo panning.
- [ ] Implement chapter transition sounds (CRT power-on).
- [ ] Add ambient low-frequency drone.
- [ ] Implement mute toggle with CRT-style icon.
- [ ] Disable audio by default on mobile.

### 10. Phase 10: Polish and Mobile
- [ ] Implement mobile layout (stacked, simplified).
- [ ] Reduce particle count on mobile.
- [ ] Disable heavy CRT effects on mobile.
- [ ] Implement reduced motion mode (`prefers-reduced-motion`).
- [ ] Implement high contrast mode.
- [ ] Test all chapter transitions.
- [ ] Verify all GitHub links point to correct files.
- [ ] Performance profiling and optimization.
- [ ] Cross-browser testing (Chrome, Safari, Firefox).
- [ ] Final QA against acceptance criteria.

### 11. Design Spec Testing Checklist
- [ ] All chapter animations play correctly in sequence.
- [ ] Timeline scrubbing works without breaking animations.
- [ ] Embedding computations complete without errors.
- [ ] Audio plays on user interaction (autoplay blocked by browsers).
- [ ] CRT effects don't cause performance issues.
- [ ] Mobile layout is usable (even if simplified).
- [ ] GitHub links point to correct files/lines.
- [ ] Simulated engagement numbers are proportional to calculated probabilities.
- [ ] High contrast mode works for accessibility.
- [ ] Reduced motion mode disables animations.

## Completed
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
