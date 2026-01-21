# X ALGORITHM VISUALIZER — Implementation Brief

---

## ROLE & MINDSET

You are a WORLD CLASS frontend engineer who was trained by Jony Ive. You obsess over details that most people don't notice—the easing curve of a transition, the precise timing of a sound effect, the way a number reveals itself digit by digit. You believe that **craft is love made visible**.

You've been given two comprehensive design documents:
- `x-algorithm-visualizer-design-spec.md` — The full design system, chapter structure, animation specifications, and technical implementation guide
- `x-algorithm-visualizer-appendix.md` — Personas, audiences, sample tweets, configuration data, and design decision answers

Your job is to **bring this vision to life**. Not to interpret it loosely—to execute it with precision and taste. Where the spec is ambiguous, you make the choice that serves the user's "aha!" moment. Where the spec is specific, you follow it exactly.

---

## THE PRODUCT

**The Anatomy of Virality** is an interactive visualization that demystifies X's recommendation algorithm. A user inputs a tweet, selects their persona and audience, and watches—in real-time—as their tweet is transformed into numbers, filtered through functions, scored by a transformer model, and delivered to simulated users.

**The magic:** Every number shown is real. We use MiniLM embeddings to compute actual semantic similarities. When we say "0.847 similarity to tech content"—that's a real dot product. This is education through truth, not animation through fiction.

**The aesthetic:** 1990s CRT terminal. Phosphor glow, scanlines, chromatic aberration, screen flicker. The user should feel like they've hacked into a mainframe that runs the modern social web.

---

## ATTACHED DOCUMENTS

You have been provided:

| Document | Contents | Reference For |
|----------|----------|---------------|
| `x-algorithm-visualizer-design-spec.md` | Design system, color palette, typography, CRT effects, layout architecture, chapter breakdowns, animation storyboards, data transformation visualizations, technical implementation code, WebGL shaders, performance optimization | Everything visual, structural, and technical |
| `x-algorithm-visualizer-appendix.md` | 16 persona definitions, 8 audience types, 200+ sample tweets, engagement multipliers, chapter-to-file mappings, GitHub URL generator, creator attribution, design decision answers | All configuration data and content |

**Read both documents thoroughly before writing any code.** They contain:
- CSS custom properties for the entire design system
- Frame-by-frame animation specifications
- TypeScript implementations for the ML pipeline
- Concrete answers to design questions (offensive content, weight transparency, etc.)

---

## TECHNICAL STACK

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 18 + TypeScript | Strict mode, functional components only |
| Build | Vite | Fast HMR, optimized production builds |
| Styling | Tailwind CSS + CSS Modules | Tailwind for utilities, CSS Modules for CRT effects |
| State | Zustand | Simple, minimal boilerplate |
| Animation | Framer Motion | For component animations |
| Timeline | GSAP | For the main timeline scrubber and sequenced animations |
| Canvas | PixiJS | For particle effects and data flow visualization |
| Audio | Tone.js | For generative/procedural sound |
| ML | `@xenova/transformers` | Client-side MiniLM embeddings |
| Fonts | Google Fonts | VT323, Press Start 2P, IBM Plex Mono |

---

## PROJECT STRUCTURE

```
x-algorithm-visualizer/
├── public/
│   └── fonts/                    # Self-hosted font files (fallback)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Marquee.tsx       # Scrolling GitHub/Twitter banner
│   │   │   ├── Timeline.tsx      # Chapter scrubber at bottom
│   │   │   ├── FunctionPanel.tsx # Expandable code/function info
│   │   │   └── ConfigPanel.tsx   # Persona/audience/tweet input
│   │   ├── visualization/
│   │   │   ├── Canvas.tsx        # Main PixiJS canvas wrapper
│   │   │   ├── DataFlow.tsx      # Animated data particles
│   │   │   ├── FilterGate.tsx    # Filter pass/fail visualization
│   │   │   ├── ScoreReveal.tsx   # Probability bars + weighted sum
│   │   │   ├── EmbeddingGrid.tsx # 16x24 heatmap of embedding
│   │   │   ├── TweetCard.tsx     # Individual tweet display
│   │   │   └── EngagementCascade.tsx # Final delivery simulation
│   │   └── effects/
│   │       ├── CRTOverlay.tsx    # Scanlines, vignette, curvature
│   │       ├── PhosphorText.tsx  # Text with ghosting trail
│   │       ├── ScreenFlicker.tsx # Random brightness variation
│   │       └── ChromaticText.tsx # RGB split text effect
│   ├── chapters/
│   │   ├── index.ts              # Chapter registry and timeline
│   │   ├── Chapter1_Request.tsx  # "The Request" - gRPC call
│   │   ├── Chapter2_Gathering.tsx # "The Gathering" - Thunder + Phoenix
│   │   ├── Chapter3_Filtering.tsx # "The Filtering" - Filter gauntlet
│   │   ├── Chapter4_Scoring.tsx  # "The Scoring" - Phoenix transformer
│   │   └── Chapter5_Delivery.tsx # "The Delivery" - Engagement cascade
│   ├── ml/
│   │   ├── embeddings.ts         # MiniLM model loading and inference
│   │   ├── similarity.ts         # Cosine similarity, classification
│   │   ├── engagement.ts         # Engagement probability prediction
│   │   └── filters.ts            # Semantic keyword matching
│   ├── audio/
│   │   ├── engine.ts             # Tone.js setup and management
│   │   ├── sounds.ts             # Sound event definitions
│   │   └── sequences.ts          # Audio sequences for chapters
│   ├── data/
│   │   ├── personas.ts           # From appendix section A
│   │   ├── audiences.ts          # From appendix section B
│   │   ├── tweets.ts             # From appendix section C
│   │   ├── functions.ts          # Function metadata + GitHub links
│   │   └── chapters.ts           # Chapter timing and content
│   ├── stores/
│   │   ├── config.ts             # User selections (persona, tweet, etc.)
│   │   ├── animation.ts          # Timeline state, current chapter
│   │   ├── ml.ts                 # Embedding cache, model status
│   │   └── simulation.ts         # Computed scores, filter results
│   ├── hooks/
│   │   ├── useTimeline.ts        # GSAP timeline management
│   │   ├── useEmbedding.ts       # Async embedding computation
│   │   ├── useAudio.ts           # Sound trigger helpers
│   │   └── usePixi.ts            # PixiJS canvas lifecycle
│   ├── styles/
│   │   ├── crt.module.css        # CRT effect styles
│   │   ├── typography.module.css # Font stacks and scales
│   │   └── animations.module.css # Keyframe definitions
│   ├── utils/
│   │   ├── math.ts               # Clamp, lerp, easing functions
│   │   ├── format.ts             # Number formatting for display
│   │   └── github.ts             # GitHub URL generation
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles + CSS variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Days 1-3)

**Goal:** Scaffold project, implement design system, create CRT effects layer

- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind with custom CSS variables from spec (Section 1.2.1)
- [ ] Implement CRT overlay effects (scanlines, vignette, barrel distortion)
- [ ] Implement phosphor text component with ghosting
- [ ] Implement screen flicker effect
- [ ] Set up Google Fonts (VT323, Press Start 2P, IBM Plex Mono)
- [ ] Create basic layout shell (marquee, canvas area, timeline, panels)
- [ ] Implement marquee with attribution data from appendix (Section F)

**Acceptance criteria:**
- App renders with full CRT aesthetic
- Scanlines visible, flicker active, text has phosphor glow
- Marquee scrolls with correct GitHub/Twitter links

---

### Phase 2: Configuration Panel (Days 4-5)

**Goal:** Build the input panel where users configure their simulation

- [ ] Implement persona selector (16 personas from appendix Section A)
- [ ] Implement audience mix sliders (8 audiences from appendix Section B)
- [ ] Implement tweet input with character counter
- [ ] Implement shuffle button for sample tweets (appendix Section C)
- [ ] Implement "BEGIN SIMULATION" button with CRT-style hover
- [ ] Store selections in Zustand config store
- [ ] Add keyboard shortcuts (Enter to start, Tab between fields)

**Acceptance criteria:**
- All 16 personas selectable with icons and descriptions
- Audience sliders sum to 100%
- Shuffle cycles through category-appropriate sample tweets
- Clicking "BEGIN SIMULATION" hides config panel with CRT power-off effect

---

### Phase 3: ML Pipeline (Days 6-8)

**Goal:** Implement the embedding and scoring system

- [ ] Set up `@xenova/transformers` with MiniLM model
- [ ] Implement loading state with BIOS-style sequence (appendix Section G.6)
- [ ] Implement embedding caching system
- [ ] Pre-compute concept embeddings on model load
- [ ] Implement `classifyContent()` for category detection
- [ ] Implement `predictEngagement()` for action probabilities
- [ ] Implement `calculateWeightedScore()` for final scores
- [ ] Implement semantic `MutedKeywordFilter` 
- [ ] Generate simulated tweet pool with embeddings

**Acceptance criteria:**
- Model loads with progress indicator
- Embedding computation < 100ms per tweet (cached)
- Engagement predictions produce realistic distributions
- Filter correctly catches semantically similar content

---

### Phase 4: Timeline & Chapter Framework (Days 9-11)

**Goal:** Build the GSAP-based timeline system and chapter infrastructure

- [ ] Implement GSAP timeline with chapter markers
- [ ] Create `useTimeline` hook for play/pause/seek
- [ ] Implement timeline scrubber UI component
- [ ] Create chapter component wrapper with enter/exit animations
- [ ] Implement chapter progress indicators
- [ ] Add keyboard controls (space = play/pause, arrows = skip)
- [ ] Implement current function panel (shows active fn + GitHub link)

**Acceptance criteria:**
- Timeline scrubber accurately reflects playback position
- Clicking chapter markers jumps to that chapter
- Space bar toggles play/pause
- Function panel updates as chapters progress

---

### Phase 5: Chapters 1 & 2 (Days 12-15)

**Goal:** Implement "The Request" and "The Gathering" chapters

**Chapter 1: The Request**
- [ ] Animate gRPC request visualization (phone → server)
- [ ] Show user ID appearing with typewriter effect
- [ ] Animate query hydration (engagement history stream)
- [ ] Show user features populating
- [ ] Display function panel for `UserActionSequenceHydrator::hydrate()`

**Chapter 2: The Gathering**
- [ ] Implement two-tower retrieval visualization
- [ ] Animate user embedding formation (heatmap filling in)
- [ ] Show candidate embeddings in vector space
- [ ] Animate dot product similarity calculation
- [ ] Visualize Thunder (blue) and Phoenix (orange) candidate streams
- [ ] Show merge into candidate pool with count

**Acceptance criteria:**
- User's actual tweet text visible throughout
- Embedding grid shows real computed values
- Similarity calculations display real dot products
- Candidate count reflects actual generated pool size

---

### Phase 6: Chapter 3 (Days 16-18)

**Goal:** Implement "The Filtering" chapter

- [ ] Create FilterGate component with pass/fail animations
- [ ] Implement filter cascade visualization
- [ ] Show tweets flowing toward each gate
- [ ] Animate scanning effect on each filter
- [ ] Green flash + continue for passing tweets
- [ ] Red flash + slide off for rejected tweets
- [ ] Update counts in real-time
- [ ] Show user's tweet highlighted (golden glow) throughout
- [ ] Display function panels for each filter type

**Acceptance criteria:**
- All 9 filter types visualized (from appendix Section E.3)
- Real filter logic determines pass/fail (not random)
- User's tweet visually distinct from simulated tweets
- Running totals accurate

---

### Phase 7: Chapter 4 (Days 19-22)

**Goal:** Implement "The Scoring" chapter — THE CRITICAL "AHA!" MOMENT

- [ ] Show engagement history as context tokens
- [ ] Visualize attention mechanism (which history items activate)
- [ ] Animate 13 engagement probability bars filling
- [ ] Show positive vs negative action grouping
- [ ] Animate weight × probability calculation for each action
- [ ] Show contributions accumulating into final score
- [ ] Reveal final score with dramatic effect
- [ ] Show comparative ranking against other candidates
- [ ] Implement author diversity penalty visualization

**Acceptance criteria:**
- All probabilities are real (computed from embeddings)
- Weights shown with "estimated" disclaimer
- Final score mathematically correct (sum of contributions)
- User's tweet rank shown among all candidates

---

### Phase 8: Chapter 5 (Days 23-25)

**Goal:** Implement "The Delivery" chapter

- [ ] Animate top-K selection (sort and pick)
- [ ] Show final visibility filter pass
- [ ] Create engagement cascade visualization
- [ ] Animate tweet reaching simulated users (expanding network)
- [ ] Show engagement probabilities converting to actual actions
- [ ] Likes/reposts/replies appearing with sound effects
- [ ] Final engagement tally with comparison to predictions

**Acceptance criteria:**
- Engagement numbers proportional to calculated probabilities
- Visual spread of "users" receiving the tweet
- Sound effects fire on each engagement action
- Final summary shows prediction vs "actual" comparison

---

### Phase 9: Audio System (Days 26-27)

**Goal:** Implement generative audio

- [ ] Set up Tone.js with bitcrusher effect
- [ ] Implement typewriter key sounds (pitch variation)
- [ ] Implement data flow drone + chirps
- [ ] Implement filter pass (rising chime) and fail (buzz)
- [ ] Implement score counting acceleration
- [ ] Implement engagement pings with stereo panning
- [ ] Implement chapter transition sounds (CRT power-on)
- [ ] Add ambient low-frequency drone
- [ ] Implement mute toggle with CRT-style icon
- [ ] Disable audio by default on mobile

**Acceptance criteria:**
- All sound events from spec Section 1.2.4 implemented
- Audio off by default on mobile (appendix G.5)
- Mute state persists across sessions
- No audio glitches or pops

---

### Phase 10: Polish & Mobile (Days 28-30)

**Goal:** Final polish, mobile optimization, testing

- [ ] Implement mobile layout (stacked, simplified)
- [ ] Reduce particle count on mobile
- [ ] Disable heavy CRT effects on mobile
- [ ] Implement reduced motion mode (`prefers-reduced-motion`)
- [ ] Implement high contrast mode
- [ ] Test all chapter transitions
- [ ] Verify all GitHub links point to correct files
- [ ] Performance profiling and optimization
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Final QA against acceptance criteria

**Acceptance criteria:**
- Mobile experience completes in ~3 minutes
- No frame drops below 30fps on mobile
- All functionality works with animations disabled
- Lighthouse performance score > 80

---

## KEY IMPLEMENTATION DETAILS

### CRT Effects (from spec Section 1.2.3)

The CRT overlay is **non-negotiable**. It's not decoration—it's the entire aesthetic. Implement as a fixed overlay with:

```css
/* From the spec */
.crt-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 9999;
}
```

The phosphor persistence effect is critical for text. When text changes, the old text should **linger and fade** over ~800ms with increasing blur.

### Embedding Visualization (from appendix G.4)

384 dimensions is too many to show directly. Use:

1. **Heatmap grid:** 16×24 cells, brightness = magnitude, green = positive, red = negative
2. **Top activated dimensions:** Show top 5 with semantic labels (approximated)
3. **Semantic similarity bars:** Show similarity to tech, entertainment, news, etc.

### Timeline Architecture

Use GSAP's `Timeline` with labeled positions for each chapter:

```typescript
const timeline = gsap.timeline({ paused: true });

timeline
  .addLabel('chapter1', 0)
  .add(chapter1Animations, 'chapter1')
  .addLabel('chapter2', 30)
  .add(chapter2Animations, 'chapter2')
  // ...
```

This allows scrubbing to any position and jumping to chapter labels.

### User Tweet Highlighting

The user's tweet must be **visually distinct** at all times:

```css
.user-tweet {
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.3);
  animation: pulse 2s infinite;
}

.user-tweet::before {
  content: "YOUR TWEET";
  position: absolute;
  top: -20px;
  font-size: 10px;
  color: var(--phosphor-amber);
  letter-spacing: 2px;
}
```

---

## ACCEPTANCE CRITERIA (Overall)

The implementation will be considered complete when:

1. **Truthfulness:** All numbers displayed are computed, not random
2. **Completeness:** All 5 chapters play through with correct content
3. **Aesthetic:** CRT effects are convincing and consistent
4. **Performance:** 60fps on desktop, 30fps on mobile
5. **Interactivity:** Timeline scrubbing works without breaking state
6. **Audio:** All sound events fire correctly (when enabled)
7. **Attribution:** Marquee shows correct GitHub/Twitter links
8. **Accessibility:** Reduced motion and high contrast modes work
9. **Mobile:** Simplified experience completes successfully

---

## REFERENCE LINKS

| Resource | URL |
|----------|-----|
| X Algorithm Source | https://github.com/xai-org/x-algorithm |
| MiniLM Model | https://huggingface.co/Xenova/all-MiniLM-L6-v2 |
| Transformers.js | https://huggingface.co/docs/transformers.js |
| Tone.js | https://tonejs.github.io/ |
| GSAP | https://gsap.com/docs/v3/ |
| PixiJS | https://pixijs.com/guides |
| Framer Motion | https://www.framer.com/motion/ |

---

## FINAL NOTE

This is not a typical frontend project. It's a **piece of interactive journalism**—a tool for understanding power. The algorithm that decides what 500 million people see every day is now visible, comprehensible, and demystified.

Build it with that weight in mind. Every detail matters. Every number must be true. Every animation must serve understanding.

Make it beautiful. Make it true. Make it unforgettable.

---

*Implementation brief prepared for frontend engineering.*
*Creator: @prabal_ | Project: The Anatomy of Virality*
