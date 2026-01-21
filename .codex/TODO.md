# TODO Stack

Instructions:
1. This file is a stack; the top-most unchecked item is done first.
2. Keep items ordered by priority; insert new tasks in place (do not just append).
3. Use headings for hierarchy; keep child tasks under the relevant parent.
4. When a task is done, mark it [x] and move it to the Completed section.

## Stack (Top = next)

### 1. Phase 1: Foundation
- [ ] Initialize Vite + React + TypeScript project.
- [ ] Configure Tailwind with custom CSS variables from spec (Section 1.2.1).
- [ ] Implement CRT overlay effects (scanlines, vignette, barrel distortion).
- [ ] Implement phosphor text component with ghosting.
- [ ] Implement screen flicker effect.
- [ ] Set up Google Fonts (VT323, Press Start 2P, IBM Plex Mono).
- [ ] Create basic layout shell (marquee, canvas area, timeline, panels).
- [ ] Implement marquee with attribution data from appendix (Section F).

### 2. Phase 2: Configuration Panel
- [ ] Implement persona selector (16 personas from appendix Section A).
- [ ] Add persona technicality mapping (explicit list, default mode).
- [ ] Implement audience mix sliders (8 audiences from appendix Section B).
- [ ] Implement tweet input with character counter.
- [ ] Implement shuffle button for sample tweets (appendix Section C).
- [ ] Implement "BEGIN SIMULATION" button with CRT-style hover.
- [ ] Add Expert Mode toggle with helper copy and persistence.
- [ ] Store selections in Zustand config store.
- [ ] Add keyboard shortcuts (Enter to start, Tab between fields).

### 2.5 RPG Experience Layer
- [ ] Update UI copy to RPG framing (Mission Loadout, Mission Report).
- [ ] Implement mode-aware FunctionPanel (summary + Learn more gate).
- [ ] Add mode-aware labels for timeline and chapters.
- [ ] Compute Reach, Resonance, Momentum from real pipeline outputs.
- [ ] Add badge tier calculation and Mission Report display.
- [ ] Add replay prompt after Mission Report.

### 3. Phase 3: ML Pipeline
- [ ] Set up `@xenova/transformers` with MiniLM model.
- [ ] Implement loading state with BIOS-style sequence (appendix Section G.6).
- [ ] Implement embedding caching system.
- [ ] Pre-compute concept embeddings on model load.
- [ ] Implement `classifyContent()` for category detection.
- [ ] Implement `predictEngagement()` for action probabilities.
- [ ] Implement `calculateWeightedScore()` for final scores.
- [ ] Implement semantic `MutedKeywordFilter`.
- [ ] Generate simulated tweet pool with embeddings.

### 4. Phase 4: Timeline and Chapter Framework
- [ ] Implement GSAP timeline with chapter markers.
- [ ] Create `useTimeline` hook for play/pause/seek.
- [ ] Implement timeline scrubber UI component.
- [ ] Create chapter component wrapper with enter/exit animations.
- [ ] Implement chapter progress indicators.
- [ ] Add keyboard controls (space = play/pause, arrows = skip).
- [ ] Implement current function panel (shows active fn + GitHub link).

### 5. Phase 5: Chapters 1 and 2
- [ ] Animate gRPC request visualization (phone -> server).
- [ ] Show user ID appearing with typewriter effect.
- [ ] Animate query hydration (engagement history stream).
- [ ] Show user features populating.
- [ ] Display function panel for `UserActionSequenceHydrator::hydrate()`.
- [ ] Implement two-tower retrieval visualization.
- [ ] Animate user embedding formation (heatmap filling in).
- [ ] Show candidate embeddings in vector space.
- [ ] Animate dot product similarity calculation.
- [ ] Visualize Thunder (blue) and Phoenix (orange) candidate streams.
- [ ] Show merge into candidate pool with count.

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
- [x] Read full implementation brief, design spec, and appendix.
- [x] Create TODO stack file with instructions.
- [x] Update `.codex/AGENTS.md` with coding style and TODO guidance.
- [x] Worktree requirement waived by user; no worktree created.
- [x] Draft RPG experience + complexity-mode spec.
- [x] Review spec against the implementation brief and append gaps to the stack.
- [x] Add RPG spec artifacts to the repo.
- [x] Write implementation plan document for full checklist execution.
- [x] Add coding style guidelines and hooks to `.codex/AGENTS.md`.
