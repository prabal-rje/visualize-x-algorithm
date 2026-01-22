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
 
 

##### Phase 2.75: Changes to "The Gathering"
 
 


##### Phase 2.875: Changes to "The Scoring"

 

##### Phase 2.9: Fix Loading BIOS Screen
 

#### Phase 3: Embedding + Hover Fix
 

#### Phase 4: Chapter 3 Split + Height Control
 

#### Phase 5: Chapter 4 Split + Scoring Visuals
 

#### Phase 6: Chapter 5 Split + Delivery Feedback

#### Pre-Finish


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
- [x] Move completed tasks to Completed.
- [x] Chrome MCP viewport/zoom verification for Ch.2 encoding split (tokenize/embedding/pooling).
- [x] Split Chapter 2 encoding into tokenize/embedding/pooling sub-chapters with per-step visuals.
- [x] Update Chapter 2 chapter data, narration, and tests for new sub-chapter flow.
- [x] Capture Chrome MCP screenshots for the new split steps (multi-viewport + zoom).

### 0. Immediate: RPG Chapter Revamp & Verification

#### Phase 2.9: Fix Loading BIOS Screen
- [x] Stack the marquee above the BIOS loader on the loading screen.
- [x] Capture BIOS loading screen reference screenshot.

### 0. Mobile Chapter Variants (Chapters 1-5)

#### Pre-Start
- [x] Capture baseline Chrome MCP screenshots (desktop + mobile).
- [x] Review chapter layouts + mobile requirements.

#### Design & Plan
- [x] Draft mobile layout plan (include narration tweaks; omit Two-Tower line).

#### Implementation
- [x] Chapter 1 mobile layout and content.
- [x] Chapter 2 mobile layout (simplified encoding, placement, similarity, streams).
- [x] Chapter 3 mobile layout (filter summaries + gate focus).
- [x] Chapter 4 mobile layout (tokens, attention, probabilities, score).
- [x] Chapter 5 mobile layout (top-K, reach, reactions, report).

#### Verification
- [x] Capture Chrome MCP screenshots (desktop + mobile sizes/zooms).
- [x] Run targeted tests.

#### Pre-Finish
- [x] Update `.codex/TODO.md` and move completed tasks.

### Feedback Fixes: Arena + Marquee + Stack

#### Pre-Start
- [x] Review feedback screenshots for extra bounding boxes and duplications.
- [x] Capture baseline Chrome MCP screenshots (top bar + chapter 0).

#### Design & Plan
- [x] Draft feedback-fix design notes.
- [x] Draft implementation plan with TDD steps.

#### Phase 1: Loadout Chapter + Arena Gating
- [x] Remove extra arena bounding boxes (shell + main).
- [x] Remove ConfigPanel border/background framing.
- [x] Fix marquee duplication and animation.
- [x] Remove function stack duplication and add link emoji + GitHub link.
- [x] Remove Mission Report side panel from app shell.
- [x] Update tests for new structure.

#### Pre-Finish
- [x] Run targeted tests for feedback fixes.
- [x] Capture final Chrome MCP screenshots.
- [x] Update `.codex/TODO.md` and move completed tasks.

### 0. Arena Darkness + Responsiveness

#### Pre-Start
- [x] Review legacy arena screenshots in `.trash` for visual parity.
- [x] Capture baseline Chrome MCP screenshot (desktop).

#### Design & Plan
- [x] Draft arena darkness + responsiveness design doc.
- [x] Draft implementation plan with TDD steps.

#### Phase 1: Arena Surfaces
- [x] Add CRT void/panel-deep tokens + restore spacing scale.
- [x] Apply arena surface classes to app shell, timeline, marquee, and chapter canvas.
- [x] Align ChapterWrapper surface to deep panel styling.
- [x] Update tests for arena surface classes.

#### Phase 2: Responsive Extremes
- [x] Add height-based spacing adjustments for short viewports.
- [x] Add small-screen spacing adjustments for phone/tablet widths.
- [x] Capture Chrome MCP screenshots across target viewports.

#### Pre-Finish
- [x] Run targeted tests for arena styling.
- [x] Capture final Chrome MCP screenshots.
- [x] Update `.codex/TODO.md` and move completed tasks.

### 0. Tailwind Design System Overhaul

#### Pre-Start
- [x] Capture baseline Chrome MCP screenshot (desktop).
- [x] Review Tailwind config and layout CSS modules for refactor targets.

#### Design & Plan
- [x] Draft Tailwind design system design doc.
- [x] Draft implementation plan with TDD steps.

#### Phase 1: Design System Foundations
- [x] Extend Tailwind theme (colors, spacing, containers, grids).
- [x] Add global design-system layer utilities/components.
- [x] Add layout helper classes + data attribute variants.

#### Phase 2: Component Refactors
- [x] Refactor App shell layout to Tailwind system.
- [x] Refactor Marquee, BIOSLoading, MissionReport, ChapterWrapper to Tailwind.
- [x] Simplify Timeline layout using design system utilities.

#### Phase 3: Cleanup
- [x] Remove unused CSS modules and simplify styles.
- [x] Align/extend tests to cover new classnames and layout helpers.

#### Pre-Finish
- [x] Capture Chrome MCP screenshots (desktop/tablet/mobile).
- [x] Run tests and lint.
- [x] Update `.codex/TODO.md` and move completed tasks to Completed.

### Work Review 2: UX Review Across Device Sizes

#### Pre-Start
- [x] Mirror review checklist into `.codex/work_review_2/FEEDBACK_TODO.md`.
- [x] Capture baseline Chrome MCP screenshots (desktop/tablet/mobile).

#### Design & Plan
- [x] Write design notes for Work Review 2 fixes.
- [x] Write implementation plan for Work Review 2 fixes.

#### Phase 1: Critical UX Fixes
- [x] Add defaults warning toast when proceeding without explicit selections.
- [x] Fix embedding hover tooltip readability and layering.
- [x] Make attention weights hover show meaningful details.
- [x] Round MOMENTUM to max 1 decimal place.
- [x] Show user's tweet in Top-K ranking (highlighted).

#### Phase 2: Mission Prep (Ch0) UX
- [x] Remove redundant Mission Loadout header across sub-steps.
- [x] Remove Expert Mode checkbox and related UI.
- [x] Replace audience sliders with multi-select boxes + persona-based defaults.
- [x] Strengthen RPG framing copy for loadout.

#### Phase 3: Chapter 1 (Request) Improvements
- [x] Consolidate function references to one location.
- [x] Add engagement history emoji flow visualization.
- [x] Add USER_PROFILE avatar visualization.
- [x] Merge redundant pages; show function stack instead.

#### Phase 4: Chapter 2 (Gathering) Improvements
- [x] Ensure token list fully visible (scroll/resize).
- [x] Animate tokenization → embeddings → pooling → final vector sequence.
- [x] Fix function bar to match encoding step.
- [x] Vary similarity dot brightness/size; hover on user shows text.
- [x] Animate tweet placement and retrieval (Thunder/Phoenix).
- [x] Add separate placement step before similarity map.

#### Phase 5: Chapter 3 (Filtering) Improvements
- [x] Consolidate filter pages with function stack.
- [x] Animate posts being filtered out.

#### Phase 6: Chapter 4 (Scoring) Improvements
- [x] Animate attention weight bars progressively.
- [x] Merge combining scores + author penalty steps.
- [x] Animate P(like)/P(retweet) calculation + sum.

#### Phase 7: Chapter 5 (Delivery) Improvements
- [x] Replace candidate labels with tweet previews.
- [x] Add fake avatar library for simulated users.
- [x] Animate engagement cascade with emojis.
- [x] Progressive stat reveal for delivery report.

#### Phase 8: Mobile + Tablet Responsiveness
- [x] Stack persona grid to single column on mobile.
- [x] Center CTA buttons and make full-width on mobile.
- [x] Increase touch target sizes (>=44px) and slider size.
- [x] Fix title truncation + ellipsis handling on mobile.
- [x] Fix chapter tab overflow (scroll or menu) + indicators.
- [x] Fix nav buttons (full-width or icon+tooltips).
- [x] Hide/collapse sidebar and CRT CTRL on mobile.
- [x] Tablet: restore full-text nav buttons + padding tweaks.

#### Phase 9: Technical + Global Enhancements
- [x] Collapse sidebar to icon/expandable panel.
- [x] Use Web Worker for embeddings (async).
- [x] Use Matryoshka N=30 for similarity.
- [x] Add function stack header (desktop marquee/mobile vertical).
- [x] Clarify CRT CTRL button (tooltip/label).
- [x] Use intersection observer for animation triggers.
- [x] Lazy-load chapter components.
- [x] Consider skeleton states while computing.

#### Phase 10: Verification
- [x] Chrome MCP screenshots at multiple viewports + zoom levels.
- [x] Run targeted tests and fix failures.
- [x] Move completed tasks to Completed.

### Work Review 1: Layout, Nav, and CRT Polish

#### Pre-Start
- [x] Capture baseline Chrome MCP screenshots (default viewport + loadout).

#### Design & Plan
- [x] Write implementation plan for Work Review 1 fixes.
- [x] Mirror review checklist into `.codex/work_review_1/FEEDBACK_TODO.md`.

#### Phase 1: Title + Favicon
- [x] Update `index.html` title + meta.
- [x] Add CRT-styled favicon asset.

#### Phase 2: Arena Layout + Spacing
- [x] Expand app shell width + tighten vertical gaps.
- [x] Make chapter canvas fill available height and avoid hidden scroll.
- [x] Make Chapter 0 content fill arena width and reduce wasted space.

#### Phase 3: Marquee Loop Fix
- [x] Implement seamless marquee looping (no mid-screen jump).

#### Phase 4: Timeline + Mobile Controls
- [x] Add progress label + chapter ticks to progress bar.
- [x] Ensure chapter tabs scroll on mobile with visible affordance.
- [x] Replace cramped mobile nav labels with icon mode + 44px targets.

#### Phase 5: Function Panel Links
- [x] Add clickable file path + GitHub icon link in FunctionPanel.

#### Phase 6: Persona Grid Enhancements
- [x] Add persona icons in loadout cards.
- [x] Standardize persona card heights + subtitle clamp.
- [x] Increase grid column count on desktop.

#### Phase 7: CRT Controls Placement
- [x] Reposition CRT CTRL handle to reduce right-edge intrusion.

#### Phase 8: Global UI Polish
- [x] Add CRT-green focus ring for keyboard navigation.
- [x] Scale UI for large displays (reduce miniaturization).
- [x] Add Chapter 2 legends/labels where missing.

#### Phase 9: Verification
- [x] Chrome MCP screenshots at multiple viewports + zoom levels.
- [x] Run targeted tests and fix failures.
- [x] Run Playwright end-state screenshot + final tests.
- [x] Review `git diff`, fix style issues, ensure tests pass.
- [x] Move completed tasks to Completed and ensure TODO empty.
- [x] Add input tweet performance summary (below/med/above avg).
- [x] Add reach + audience delivery breakdown.
- [x] Add avatar reactions (like/comment/retweet bursts).
- [x] Split Chapter 5 into granular sub-steps + height control.
- [x] Add delivery step styles (reach panel, reaction burst, report layout).
- [x] Update Chapter 5 tests for new steps.
- [x] Update chapter data + tests.
- [x] Playwright screenshot + commit.
- [x] Add P(...) estimation flow using embedding model data.
- [x] Enhance attention weights interactivity + explanation.
- [x] Split Chapter 4 into granular sub-steps + height control.
- [x] Update chapter data + tests.
- [x] Playwright screenshot + commit.
- [x] Split Chapter 3 into 4 sub-steps with explanations.
- [x] Add interactive filtering callouts per step (tweet highlights + gate focus).
- [x] Set Chapter 3 height to half of Ch1/Ch2.
- [x] Update chapter data + tests.
- [x] Playwright screenshot + commit.
- [x] Add token-level (sub-token) embedding animation flowing into mean pool.
- [x] Animate pooled token contributions into 128-d heatmap.
- [x] Fix vector space hover flicker (overlay or reserved layout).
- [x] Update visualization tests.
- [x] Playwright screenshot + commit.
- [x] Confirm all edits stay in project root (no `.worktrees` changes).
- [x] Currently, loading BIOS screen appears on the side-region - when it should be replacing the entire simulation arena ...
      ONLY WHEN THE LOADING BIOS HAS DISAPPEARED SHOULD THE REGULAR SIMULATION ARENA EVEN BE ALLOWED TO RENDER
- [x] Make sure BIOS Loader is in the middle of the screen ... no upper navigation bar, no simulation arena - just marquee and the BIOS Loader ...
- [x] Show a type-writer cursor typing a variable speed, remove italic font, fron the justification beneath the chapter title ...
- [x] Update App tests for BIOS-only layout and narration typewriter variance.
- [x] Update TypewriterText to support variable typing speed + cursor in narration.
- [x] Remove italic narration styles across chapters 0-5.
- [x] Playwright screenshot + commit.
- [x] Replace "Liked", "Replied", "Reposted" with icons rather than just words (aligned and sized in scoring context).
- [x] Remove words 'Mean Pool' but maintain the spherical signifier of it.
- [x] Show glowing golden shadow of words flowing into the signifier and then the 128-D vector bubbling with a dimmer shared palette to illustrate tweet embedding.
- [x] Replace "User Embedding" with "Tweet Embedding".
- [x] Ensure that the entire tweet is being tokenized (show total token count).
- [x] Use _ instead of ^ to indicate space between words (keep ^ for start of sentence).
- [x] Move progress bar, the chapter buttons, the file name, and the start over /back/pause/next buttons at the top above the simulation arena.
- [x] Simulation arena should largely fit a regular computers screen without vertical scroll across loadout and chapter visualizations/simulations.
- [x] Remove the empty sidebar on the right side that's taking up space.
- [x] From CRT CTRL remove the ON button, and instead turn the MUTE button orange-glow and remove checkbox from it - make it toggle MUTED/LIVE only.
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
