# X ALGORITHM VISUALIZER
## Design Specification Document v1.0

> **Project Codename:** `PHOENIX_DEMYSTIFIED`
> **Aesthetic:** 90s CRT Terminal / Retro-Futuristic Demystification
> **Target Audience:** Semi-technical creators, journalists, curious users
> **Primary Goal:** Radical demystification through visceral, real-time number-crunching visualization

---

# PART I: PHILOSOPHY & DESIGN SYSTEM

## 1.1 Core Experience Philosophy

The viewer should feel like they've hacked into the mainframe of a 1990s supercomputer that somehow runs the modern social web. Every number displayed is **real**—computed in real-time using semantic embeddings. Every transformation is **truthful**—directly mapped to actual functions in the open-source repository.

**The "Aha!" Moment Framework:**
```
INPUT (your tweet) → [VISIBLE NUMBER CRUNCHING] → OUTPUT (thousands of screens)
```

The magic happens when viewers see their words literally **become numbers**, those numbers **flow through functions**, and those functions **decide who sees what**.

---

## 1.2 Design System: `CRT_PHOSPHOR`

### 1.2.1 Color Palette

```css
:root {
  /* Primary Phosphor Colors - These "burn" into the screen */
  --phosphor-green: #33ff33;        /* Classic terminal green - PRIMARY */
  --phosphor-amber: #ffb000;        /* Warning/highlight states */
  --phosphor-cyan: #00ffff;         /* Data flowing through system */
  --phosphor-magenta: #ff00ff;      /* ML/AI processing indicator */
  --phosphor-white: #ffffff;        /* High intensity moments */
  
  /* Background & Depth */
  --crt-black: #0a0a0a;             /* Deep CRT black */
  --crt-dark: #121212;              /* Slightly lighter for depth */
  --crt-glow: rgba(51, 255, 51, 0.1); /* Ambient screen glow */
  
  /* Semantic Colors for Pipeline Stages */
  --color-thunder: #00aaff;         /* In-network (Thunder) - cool blue */
  --color-phoenix: #ff6600;         /* Out-of-network (Phoenix) - fire orange */
  --color-rejected: #ff3333;        /* Filtered out content */
  --color-accepted: #33ff33;        /* Content that passes */
  --color-scoring: #ffff00;         /* Active scoring/computation */
  
  /* Interaction Probability Colors (for final scoring) */
  --prob-like: #ff69b4;             /* Pink heart */
  --prob-repost: #00ff7f;           /* Green cycle */
  --prob-reply: #1e90ff;            /* Blue speech */
  --prob-click: #ffd700;            /* Gold attention */
}
```

### 1.2.2 Typography System

**Primary Display Font:** `IBM Plex Mono` or `VT323` (Google Fonts)
- All code, numbers, function names
- Strictly monospace for that authentic terminal feel

**Secondary Font:** `Press Start 2P` (Google Fonts)
- Chapter titles, major section headers
- 8-bit pixel aesthetic

**Tertiary Font:** `Space Grotesk` (carefully)
- Only for longer explanatory text panels
- When readability > aesthetic

```css
/* Font Scale - Based on CRT scanline rhythm */
--font-xs: 10px;    /* Metadata, timestamps */
--font-sm: 12px;    /* Secondary info */
--font-base: 14px;  /* Primary reading */
--font-lg: 18px;    /* Subheadings */
--font-xl: 24px;    /* Chapter titles */
--font-2xl: 32px;   /* Major moments */
--font-hero: 48px;  /* Opening/closing */

/* Line height should feel cramped, like real terminals */
--line-height-tight: 1.1;
--line-height-normal: 1.3;
```

### 1.2.3 CRT Visual Effects Specification

**Effect 1: Scanlines**
```css
.crt-overlay::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

**Effect 2: Screen Curvature (Barrel Distortion)**
```css
.crt-screen {
  /* Subtle barrel distortion via SVG filter */
  filter: url(#barrel-distortion);
  border-radius: 20px; /* CRTs had rounded corners */
  box-shadow: 
    inset 0 0 100px rgba(0, 0, 0, 0.5),
    0 0 50px var(--crt-glow);
}
```

**Effect 3: Phosphor Persistence (Ghosting)**
```javascript
// Text that was recently displayed should "linger" with decay
const PHOSPHOR_DECAY_MS = 800;
const PHOSPHOR_STAGES = 5;

function createPhosphorTrail(element) {
  const clones = [];
  for (let i = 0; i < PHOSPHOR_STAGES; i++) {
    const clone = element.cloneNode(true);
    clone.style.opacity = 1 - (i / PHOSPHOR_STAGES);
    clone.style.filter = `blur(${i * 0.5}px)`;
    clone.style.transition = `opacity ${PHOSPHOR_DECAY_MS}ms ease-out`;
    clones.push(clone);
  }
  return clones;
}
```

**Effect 4: Brightness Flicker**
```javascript
// Subtle random brightness variations
function flickerScreen() {
  const brightness = 0.95 + Math.random() * 0.1;
  document.body.style.filter = `brightness(${brightness})`;
  setTimeout(flickerScreen, 50 + Math.random() * 150);
}
```

**Effect 5: RGB Chromatic Aberration**
```css
.chromatic-text {
  text-shadow:
    -1px 0 var(--phosphor-cyan),
    1px 0 var(--phosphor-magenta);
}

/* For moving elements, increase aberration */
.chromatic-text.moving {
  text-shadow:
    -2px 0 var(--phosphor-cyan),
    2px 0 var(--phosphor-magenta);
}
```

**Effect 6: Interlacing Jitter**
```css
@keyframes interlace-jitter {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(0.5px); }
}

.interlaced-content {
  animation: interlace-jitter 0.03s infinite;
}
```

### 1.2.4 Sound Design Guidelines

**Generative Audio Palette:**

| Event | Sound Characteristics |
|-------|----------------------|
| Text appearing | Soft click/typewriter, randomized pitch (220-440Hz) |
| Data flowing | Low drone + high-frequency data chirps |
| Function executing | Brief "processing" beep sequence |
| Filter rejecting | Low harsh buzz, descending |
| Filter accepting | Rising chime, clean sine wave |
| Score calculating | Rapid counting sounds, building tension |
| Tweet reaching user | Soft "ping" at varying positions (stereo pan) |
| Chapter transition | CRT "turn on" noise (rising white noise + hum) |

**Implementation:** Use Web Audio API + Tone.js
```javascript
import * as Tone from 'tone';

const synth = new Tone.MonoSynth({
  oscillator: { type: 'square' },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
}).toDestination();

// Add bitcrusher for that lo-fi feel
const crusher = new Tone.BitCrusher(4).toDestination();
synth.connect(crusher);
```

---

## 1.3 Layout Architecture

### 1.3.1 Primary Screen Regions

```
┌────────────────────────────────────────────────────────────────────┐
│ ▓▓ MARQUEE: Star on GitHub | Follow @creator on X ▓▓ [scrolling]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│    ┌─────────────────────────────────────────────────────────┐    │
│    │                                                         │    │
│    │                                                         │    │
│    │              MAIN VISUALIZATION CANVAS                  │    │
│    │                     (70% height)                        │    │
│    │                                                         │    │
│    │    [This is where the data transformation magic        │    │
│    │     happens - tweets flowing, numbers crunching,       │    │
│    │     filters applying, scores calculating]              │    │
│    │                                                         │    │
│    └─────────────────────────────────────────────────────────┘    │
│                                                                    │
│    ┌──────────────────┐  ┌──────────────────────────────────┐    │
│    │ CURRENT FUNCTION │  │ CODE PANEL                       │    │
│    │ fn_name()        │  │ // Actual code from repo         │    │
│    │ file: scorer.rs  │  │ impl Scorer for Phoenix {        │    │
│    │ [View on GitHub] │  │   fn score(&self, ...) {         │    │
│    └──────────────────┘  └──────────────────────────────────┘    │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│ [CH.1]━━━━━[CH.2]━━━━━[CH.3]━━━━━●━━━━[CH.4]━━━━━[CH.5]━━━━━[END] │
│ ◀◀  ◀  ▶▶  TIMELINE SCRUBBER                      [1:23 / 4:56]  │
└────────────────────────────────────────────────────────────────────┘
```

### 1.3.2 Input Configuration Panel (Appears Before Animation)

```
┌────────────────────────────────────────────────────────────────────┐
│                    ═══ CONFIGURE YOUR SIMULATION ═══               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ YOUR PERSONA                                                  │ │
│  │ ○ Tech Influencer (500K followers, tech content)             │ │
│  │ ● Casual User (200 followers, personal tweets)               │ │
│  │ ○ News Journalist (50K followers, breaking news)             │ │
│  │ ○ Meme Account (100K followers, viral content)               │ │
│  │ ○ Small Business (5K followers, promotional)                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ YOUR AUDIENCE MIX (who follows you)                          │ │
│  │ [Tech Enthusiasts ████████░░ 80%]                            │ │
│  │ [Casual Users     ██░░░░░░░░ 15%]                            │ │
│  │ [Bots/Inactive    █░░░░░░░░░  5%]                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ YOUR TWEET                                     [🎲 SHUFFLE]  │ │
│  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │ │ Just tried the new Claude API and wow, the tool use is  │ │ │
│  │ │ incredible! Building something cool with it 🚀           │ │ │
│  │ └──────────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │ Quick picks: [🔥 Controversial] [📰 News] [😂 Meme] [❤️ Wholesome] │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│              [ ▶ BEGIN SIMULATION ]                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

# PART II: CHAPTER STRUCTURE & CODEBASE MAPPING

## 2.1 Chapter Overview

The experience is divided into **5 major chapters**, each corresponding to a major stage in the X algorithm pipeline:

| Chapter | Name | Duration | Primary Files |
|---------|------|----------|---------------|
| 1 | THE REQUEST | 30s | `home-mixer/server.rs`, `home-mixer/main.rs` |
| 2 | THE GATHERING | 60s | `thunder/`, `phoenix/recsys_retrieval_model.py` |
| 3 | THE FILTERING | 45s | `home-mixer/filters/` |
| 4 | THE SCORING | 90s | `phoenix/recsys_model.py`, `home-mixer/scorers/` |
| 5 | THE DELIVERY | 45s | `home-mixer/selection.rs` |

**Total Runtime:** ~4.5 minutes (can be scrubbed through)

---

## 2.2 Chapter 1: THE REQUEST

### 2.2.1 High-Level Summary
> *"When you open X and pull down to refresh, a single gRPC request launches a cascade of computations that will determine what 50+ tweets appear on your screen."*

### 2.2.2 Sub-Chapters

**1A: The gRPC Call**
- File: `home-mixer/server.rs`
- Function: `ScoredPostsService::get_scored_posts()`
- Visual: Show the HTTP/2 request visualized as a packet traveling from phone icon to server icon

**1B: Query Hydration**
- File: `home-mixer/query_hydrators/`
- Functions:
  - `UserActionSequenceHydrator::hydrate()` - Fetch engagement history
  - `UserFeaturesHydrator::hydrate()` - Fetch following list, preferences
- Visual: Database icons lighting up, returning streams of data

### 2.2.3 Detailed Visualization Spec: Query Hydration

**Animation Sequence:**
```
Frame 1-30 (0-1s):
- Screen shows a simplified phone icon in center
- Text types out: "USER_ID: 8392847293"
- Phosphor green glow pulses

Frame 31-60 (1-2s):
- Arrow shoots from phone to "HOME-MIXER" server icon
- Packet visualization: small rectangles with binary data scrolling

Frame 61-150 (2-5s):
- Server icon expands to show internal structure
- Two parallel streams emerge:
  
  LEFT STREAM (User Action Sequence):
  ┌────────────────────────────────────┐
  │ ENGAGEMENT_HISTORY                 │
  │ ─────────────────────              │
  │ liked: tweet_39284 (2m ago)        │
  │ liked: tweet_28371 (5m ago)        │
  │ replied: tweet_19283 (8m ago)      │
  │ reposted: tweet_48271 (1h ago)     │
  │ ... [scrolling list of 50 items]  │
  └────────────────────────────────────┘
  
  RIGHT STREAM (User Features):
  ┌────────────────────────────────────┐
  │ USER_PROFILE                       │
  │ ─────────────────────              │
  │ following_count: 847              │
  │ follower_count: 12,394            │
  │ account_age: 2847 days            │
  │ verified: false                    │
  │ premium: true                      │
  └────────────────────────────────────┘

Frame 151-180 (5-6s):
- Both streams merge into a single "QUERY" object
- Object pulses, ready to be passed to next stage
```

**Function Callout Panel:**
```
┌─────────────────────────────────────────┐
│ fn UserActionSequenceHydrator::hydrate()│
│ ────────────────────────────────────────│
│ Fetches the user's recent engagement    │
│ history from the action sequence store. │
│ This is THE critical input to the       │
│ transformer model.                      │
│                                         │
│ 📁 home-mixer/query_hydrators/          │
│    user_action_sequence_hydrator.rs     │
│ 🔗 [View on GitHub]                     │
└─────────────────────────────────────────┘
```

---

## 2.3 Chapter 2: THE GATHERING

### 2.3.1 High-Level Summary
> *"Your feed is assembled from two parallel universes: THUNDER (posts from people you follow) and PHOENIX RETRIEVAL (posts the AI thinks you'll like from strangers)."*

### 2.3.2 Sub-Chapters

**2A: Thunder - In-Network Retrieval**
- Directory: `thunder/`
- Key Functions:
  - `ThunderStore::get_posts_for_user()` - Main retrieval
  - `PostStore::scan_recent()` - Scan recent posts
  - `InNetworkSource::get_candidates()` - Wrapper in home-mixer
- Visual: Show the user's follow graph lighting up, posts streaming in

**2B: Phoenix Retrieval - Out-of-Network Discovery**
- File: `phoenix/recsys_retrieval_model.py`
- Key Functions:
  - `TwoTowerModel.user_tower()` - Encode user to embedding
  - `TwoTowerModel.candidate_tower()` - Encode posts to embeddings
  - `approximate_nearest_neighbors()` - ANN search
- Visual: User embedding in vector space, gravitating toward similar posts

### 2.3.3 Detailed Visualization Spec: Two-Tower Retrieval

**THIS IS A CRITICAL "AHA!" MOMENT**

The two-tower retrieval visualization must make the viewer understand:
1. Users become vectors (embeddings)
2. Posts become vectors (embeddings)
3. Similar vectors = relevant content

**Animation Sequence:**

```
Frame 1-60 (0-2s) - USER TOWER:
┌────────────────────────────────────────────────────────────────────┐
│                         USER TOWER                                  │
│ ════════════════════════════════════════════════════════════════   │
│                                                                     │
│  INPUT:                              OUTPUT:                        │
│  ┌──────────────────┐               ┌──────────────────┐           │
│  │ liked: AI tweets │               │ USER_EMBEDDING   │           │
│  │ liked: tech news │     ═══▶      │ [0.23, -0.87,    │           │
│  │ follows: @openai │   TRANSFORM   │  0.12, 0.45,     │           │
│  │ follows: @nvidia │               │  -0.33, 0.91,    │           │
│  │ ...              │               │  ...]            │           │
│  └──────────────────┘               │ dim=256          │           │
│                                      └──────────────────┘           │
│                                                                     │
│  [The user's interests compressed into 256 numbers]                │
└────────────────────────────────────────────────────────────────────┘

Frame 61-120 (2-4s) - SHOW EMBEDDING FORMING:
- Visualize the 256-dimensional vector as a "fingerprint"
- Use a heatmap visualization: 16x16 grid of colored squares
- Each square's color intensity represents the embedding value
- Animate the squares "filling in" as the transformer processes

Frame 121-180 (4-6s) - CANDIDATE TOWER (parallel):
┌────────────────────────────────────────────────────────────────────┐
│                      CANDIDATE TOWER                                │
│ ════════════════════════════════════════════════════════════════   │
│                                                                     │
│  [Millions of posts already embedded offline]                      │
│                                                                     │
│  tweet_1: "AI is changing everything" → [0.21, -0.85, 0.11, ...]  │
│  tweet_2: "My cat did something cute" → [-0.45, 0.23, 0.78, ...]  │
│  tweet_3: "Breaking: Tech earnings" → [0.19, -0.82, 0.15, ...]    │
│  tweet_4: "Best pizza in Brooklyn" → [-0.67, 0.34, -0.12, ...]    │
│  ...                                                                │
│  [12.4 billion embeddings in total]                                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

Frame 181-300 (6-10s) - DOT PRODUCT SIMILARITY:
- Transition to 3D-ish vector space visualization (can be 2D with depth)
- Show user embedding as a glowing point
- Show candidate embeddings as dim points scattered around
- Calculate dot product with animation:

  USER_VEC · CANDIDATE_VEC
  ═════════════════════════
  0.23 × 0.21 = 0.0483
  -0.87 × -0.85 = 0.7395
  0.12 × 0.11 = 0.0132
  ... (show rapid calculation)
  ═════════════════════════
  SIMILARITY: 0.847 ✓ HIGH

- Points with high similarity GLOW and move toward user
- Points with low similarity DIM and fade away
- Top 1000 candidates emerge, forming a cluster around user

Frame 301-360 (10-12s) - MERGING SOURCES:
- Split screen: Thunder posts (blue) on left, Phoenix posts (orange) on right
- Both streams flow toward center
- Merge into a single "CANDIDATE_POOL" with mixed colors
- Counter shows: "2,847 candidates gathered"
```

### 2.3.4 Using MiniLM for Realistic Embeddings

**CRITICAL IMPLEMENTATION DETAIL:**

The visualization must use **real embeddings** from the MiniLM model (all-MiniLM-L6-v2) available via transformers.js or a lightweight API call.

```javascript
// Load MiniLM model (transformers.js)
import { pipeline } from '@xenova/transformers';

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

async function getEmbedding(text) {
  const result = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Example: Embed the user's tweet
const tweetEmbedding = await getEmbedding(userTweet);

// Example: Compute similarity with various concepts
const conceptEmbeddings = {
  'technology': await getEmbedding('technology artificial intelligence software'),
  'entertainment': await getEmbedding('movies music celebrities entertainment'),
  'sports': await getEmbedding('football basketball sports athletes'),
  'politics': await getEmbedding('politics government elections policy'),
  'food': await getEmbedding('cooking recipes restaurants food'),
};

function cosineSimilarity(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

// Show real similarities
Object.entries(conceptEmbeddings).forEach(([concept, embedding]) => {
  const similarity = cosineSimilarity(tweetEmbedding, embedding);
  console.log(`Similarity to ${concept}: ${similarity.toFixed(4)}`);
});
```

**How to Use This in the Visualization:**

1. **Pre-compute embeddings** for 50-100 "fake tweets" representing diverse content
2. **Embed the user's actual input tweet** in real-time
3. **Show real dot products** when comparing user interests to candidate posts
4. The numbers displayed should be the **actual computed values**, not random

---

## 2.4 Chapter 3: THE FILTERING

### 2.4.1 High-Level Summary
> *"Before any scoring happens, the system ruthlessly eliminates posts you should never see: duplicates, blocked users, muted keywords, posts you've already seen, and more."*

### 2.4.2 Sub-Chapters

**3A: Deduplication**
- File: `home-mixer/filters/dedup.rs`
- Functions:
  - `DropDuplicatesFilter::filter()` - Remove exact duplicates
  - `RepostDeduplicationFilter::filter()` - Dedupe reposts of same content

**3B: Social Graph Filtering**
- File: `home-mixer/filters/socialgraph.rs`
- Functions:
  - `AuthorSocialgraphFilter::filter()` - Remove blocked/muted authors
  - `SelfpostFilter::filter()` - Remove user's own posts

**3C: Recency & History Filtering**
- File: `home-mixer/filters/history.rs`
- Functions:
  - `AgeFilter::filter()` - Remove posts older than threshold
  - `PreviouslySeenPostsFilter::filter()` - Remove already-seen posts
  - `PreviouslyServedPostsFilter::filter()` - Remove recently served

**3D: Content Filtering**
- File: `home-mixer/filters/content.rs`
- Functions:
  - `MutedKeywordFilter::filter()` - Remove posts with muted keywords
  - `IneligibleSubscriptionFilter::filter()` - Remove inaccessible paywalled content

### 2.4.3 Detailed Visualization Spec: The Filtering Gauntlet

**Visual Metaphor:** A series of "gates" that posts must pass through. Each gate has a name, and posts either PASS (flash green, continue) or FAIL (flash red, fall away).

```
                    ┌───────────────────────────────────────────────┐
                    │           THE FILTERING GAUNTLET              │
                    └───────────────────────────────────────────────┘
                                         │
                                         │ 2,847 candidates
                                         ▼
                              ┌─────────────────────┐
                              │  DEDUPLICATION      │
                              │  DropDuplicates()   │
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           2,801    │         │ 46 (duplicates)
                                    ▼         ▼
                              ┌─────────────────────┐
                              │  SOCIAL GRAPH       │
                              │  BlockedAuthors()   │
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           2,794    │         │ 7 (blocked)
                                    ▼         ▼
                              ┌─────────────────────┐
                              │  SELF-POST          │
                              │  NotFromSelf()      │
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           2,789    │         │ 5 (own posts)
                                    ▼         ▼
                              ┌─────────────────────┐
                              │  AGE                │
                              │  < 48 hours old     │
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           2,156    │         │ 633 (too old)
                                    ▼         ▼
                              ┌─────────────────────┐
                              │  ALREADY SEEN       │
                              │  NotPreviouslySeen()│
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           1,847    │         │ 309 (seen)
                                    ▼         ▼
                              ┌─────────────────────┐
                              │  MUTED KEYWORDS     │
                              │  NoMutedTerms()     │
                              └─────────────────────┘
                                    │         │
                           ✓ PASS   │         │ ✗ FAIL
                           1,823    │         │ 24 (muted)
                                    ▼
                              ════════════════
                              1,823 SURVIVORS
                              Ready for scoring
                              ════════════════
```

**Animation Details:**

For each filter gate:
1. Posts (represented as small rectangles with truncated text) flow toward the gate
2. Gate "scans" posts (scanline effect)
3. Passing posts flash GREEN and continue downward
4. Failing posts flash RED and animate off to the side into a "reject bin"
5. Counter updates in real-time

**Muted Keyword Filter - Semantic Enhancement with MiniLM:**

```javascript
// Instead of just exact matching, use semantic similarity
// to show how sophisticated content filtering could work

const mutedKeywords = ['crypto', 'nft', 'gambling'];
const mutedEmbeddings = await Promise.all(
  mutedKeywords.map(kw => getEmbedding(kw))
);

async function checkMutedContent(tweetText) {
  const tweetEmbed = await getEmbedding(tweetText);
  
  for (let i = 0; i < mutedKeywords.length; i++) {
    const similarity = cosineSimilarity(tweetEmbed, mutedEmbeddings[i]);
    if (similarity > 0.5) {
      return {
        muted: true,
        reason: `Semantic match to muted term "${mutedKeywords[i]}"`,
        similarity: similarity
      };
    }
  }
  return { muted: false };
}

// Show the actual similarity scores in the UI:
// "Tweet about Bitcoin investment" → 0.72 similarity to "crypto" → BLOCKED
```

---

## 2.5 Chapter 4: THE SCORING

### 2.5.1 High-Level Summary
> *"This is where the magic happens. A transformer model—the same architecture as ChatGPT—looks at your entire engagement history and predicts exactly how you'll react to each post."*

### 2.5.2 Sub-Chapters

**4A: Phoenix Scorer - Multi-Action Prediction**
- File: `phoenix/recsys_model.py`
- Class: `PhoenixRanker`
- Functions:
  - `forward()` - Main inference pass
  - `predict_actions()` - Output engagement probabilities

**4B: Weighted Score Combination**
- File: `home-mixer/scorers/weighted_scorer.rs`
- Function: `WeightedScorer::score()` - Combine predictions with weights

**4C: Author Diversity Scoring**
- File: `home-mixer/scorers/diversity.rs`
- Function: `AuthorDiversityScorer::score()` - Penalize repeated authors

### 2.5.3 Detailed Visualization Spec: The Phoenix Transformer

**THIS IS THE MOST IMPORTANT "AHA!" MOMENT**

The viewer must understand:
1. The transformer sees your engagement HISTORY (as context)
2. It cannot see other candidates (candidate isolation)
3. It outputs PROBABILITIES for multiple actions
4. These probabilities are WEIGHTED and COMBINED

**Animation Sequence:**

```
═══════════════════════════════════════════════════════════════════════
                     THE PHOENIX SCORER
═══════════════════════════════════════════════════════════════════════

STEP 1: Input Preparation (Frame 1-120)
──────────────────────────────────────

[Your Engagement History - THE CONTEXT]
┌────────────────────────────────────────────────────────────────────┐
│ Token 1: <liked> "AI is changing how we code"                      │
│ Token 2: <replied> "Great thread on startup advice"                │
│ Token 3: <liked> "New research paper on transformers"              │
│ Token 4: <reposted> "Elon's latest announcement"                   │
│ Token 5: <liked> "Python tips and tricks"                          │
│ ... (last 50 interactions)                                         │
└────────────────────────────────────────────────────────────────────┘
                              +
[Candidate Post - WHAT WE'RE SCORING]
┌────────────────────────────────────────────────────────────────────┐
│ "Just released a new open-source ML library. Check it out!"        │
│ Author: @ai_developer (verified, 45K followers)                    │
│ Media: image attached                                              │
│ Posted: 23 minutes ago                                             │
└────────────────────────────────────────────────────────────────────┘


STEP 2: Attention Visualization (Frame 121-240)
───────────────────────────────────────────────

[Show attention heatmap - which history items the model "looks at"]

                    CANDIDATE: "ML library release"
                              │
        ┌─────────────────────┴─────────────────────┐
        │                ATTENTION                   │
        ▼                                           ▼
   ░░░░█████░░░░░░░░░██████░░░░░░░██████░░░░░░░░░░░░
   
   "AI coding"    "startup advice"   "transformers"  "Python tips"
   weight: 0.34    weight: 0.08      weight: 0.31    weight: 0.19

   [The model pays most attention to your AI/tech interactions]


STEP 3: Multi-Head Prediction (Frame 241-400)
─────────────────────────────────────────────

         ┌─────────────────────────────────────────────────┐
         │            ENGAGEMENT PREDICTIONS               │
         │═════════════════════════════════════════════════│
         │                                                 │
         │  P(❤️ like)          ████████████░░░  0.847    │
         │  P(🔁 repost)        ██████░░░░░░░░░  0.412    │
         │  P(💬 reply)         ████░░░░░░░░░░░  0.234    │
         │  P(👤 profile click) █████░░░░░░░░░░  0.367    │
         │  P(🎬 video view)    ░░░░░░░░░░░░░░░  0.023    │
         │  P(🔗 click)         ███████░░░░░░░░  0.521    │
         │  P(📤 share)         █████░░░░░░░░░░  0.289    │
         │  P(⏱️ dwell >30s)    ██████████░░░░░  0.689    │
         │  P(👣 follow author) ███░░░░░░░░░░░░  0.178    │
         │                                                 │
         │  ─────────── NEGATIVE SIGNALS ───────────      │
         │                                                 │
         │  P(🚫 not interested) ░░░░░░░░░░░░░░░  0.034   │
         │  P(🔇 mute author)    ░░░░░░░░░░░░░░░  0.012   │
         │  P(⛔ block author)   ░░░░░░░░░░░░░░░  0.003   │
         │  P(🚩 report)         ░░░░░░░░░░░░░░░  0.001   │
         │                                                 │
         └─────────────────────────────────────────────────┘


STEP 4: Weighted Combination (Frame 401-480)
────────────────────────────────────────────

  FINAL_SCORE = Σ (weight × probability)
  ═══════════════════════════════════════

  + (1.0  × 0.847) = 0.847  [like - strong positive]
  + (3.0  × 0.412) = 1.236  [repost - high weight, shows quality]
  + (5.0  × 0.234) = 1.170  [reply - highest weight, conversation]
  + (0.5  × 0.521) = 0.261  [click]
  + (0.2  × 0.689) = 0.138  [dwell]
  - (1.0  × 0.034) = -0.034 [not interested - negative]
  - (3.0  × 0.012) = -0.036 [mute - negative]
  - (5.0  × 0.003) = -0.015 [block - very negative]
  ──────────────────────────
  TOTAL SCORE:      3.567
  ══════════════════════════


STEP 5: Comparative Scoring (Frame 481-600)
───────────────────────────────────────────

[Show multiple candidates being scored simultaneously]

┌─────────────────────────────────────────────────────────────────┐
│  CANDIDATE SCORES (ranked)                                      │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  1. "Just released ML library..."      3.567 ████████████████ │
│  2. "Breaking: Tech earnings beat..."  3.234 ███████████████░ │
│  3. "New paper on attention mech..."   2.987 ██████████████░░ │
│  4. "Python 4.0 announced!"            2.876 █████████████░░░ │
│  5. "AI safety discussion thread"      2.654 ████████████░░░░ │
│     ...                                                        │
│  47. "Cute cat video"                  0.847 ████░░░░░░░░░░░░ │
│  48. "Random food pic"                 0.623 ███░░░░░░░░░░░░░ │
│                                                                 │
│  [Your tech interests = higher scores for tech content]        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.5.4 MiniLM-Based Scoring Approximation

**CRITICAL:** The actual Phoenix model is proprietary, but we can approximate its behavior using semantic similarity to create realistic-looking scores.

```javascript
// Semantic concepts that represent engagement types
const ACTION_CONCEPTS = {
  like: "I enjoy this content, it's interesting and valuable",
  repost: "This is so good I want to share it with my followers",
  reply: "I have something to say about this, I want to engage",
  click: "I want to learn more about this topic",
  notInterested: "This is boring, irrelevant, or low quality",
  block: "This content is offensive, spam, or from a bad actor"
};

async function approximateEngagementScores(userProfile, tweetText) {
  const tweetEmbed = await getEmbedding(tweetText);
  const userInterestEmbed = await getEmbedding(userProfile.interests.join(' '));
  
  // Base relevance from user interests
  const baseRelevance = cosineSimilarity(tweetEmbed, userInterestEmbed);
  
  // Calculate each action probability
  const scores = {};
  for (const [action, concept] of Object.entries(ACTION_CONCEPTS)) {
    const actionEmbed = await getEmbedding(concept);
    const actionAffinity = cosineSimilarity(tweetEmbed, actionEmbed);
    
    // Combine user relevance with action likelihood
    scores[action] = Math.max(0, Math.min(1, 
      (baseRelevance * 0.6 + actionAffinity * 0.4) + (Math.random() * 0.1 - 0.05)
    ));
  }
  
  return scores;
}

// Also compute semantic "content type" classifications
async function classifyContent(tweetText) {
  const categories = {
    'technology': await getEmbedding('technology software AI programming computers'),
    'entertainment': await getEmbedding('movies TV shows celebrities music entertainment'),
    'news': await getEmbedding('breaking news current events politics world affairs'),
    'personal': await getEmbedding('personal life family friends daily activities'),
    'promotional': await getEmbedding('buy now sale discount advertisement promotion'),
    'controversial': await getEmbedding('controversial debate argument conflict opinion'),
    'educational': await getEmbedding('learn tutorial how-to educational information'),
  };
  
  const tweetEmbed = await getEmbedding(tweetText);
  const results = {};
  
  for (const [category, catEmbed] of Object.entries(categories)) {
    results[category] = cosineSimilarity(tweetEmbed, catEmbed);
  }
  
  return results;
}
```

### 2.5.5 Author Diversity Scoring Sub-chapter

**Visual Concept:** Show posts from the same author getting progressively "dimmer" scores

```
AUTHOR DIVERSITY PENALTY
════════════════════════

Before diversity adjustment:
  @ai_developer: Post A - 3.567
  @ai_developer: Post B - 3.234  
  @ai_developer: Post C - 2.987
  @tech_news: Post D - 2.876

After diversity adjustment (α = 0.5):
  @ai_developer: Post A - 3.567 × 1.0 = 3.567  [1st from author]
  @ai_developer: Post B - 3.234 × 0.5 = 1.617  [2nd → penalty]
  @ai_developer: Post C - 2.987 × 0.25 = 0.747 [3rd → heavy penalty]
  @tech_news: Post D - 2.876 × 1.0 = 2.876     [1st from author]

New ranking:
  1. @ai_developer: Post A - 3.567
  2. @tech_news: Post D - 2.876
  3. @ai_developer: Post B - 1.617
  4. @ai_developer: Post C - 0.747

[Diversity ensures you don't see 10 posts from one account in a row]
```

---

## 2.6 Chapter 5: THE DELIVERY

### 2.6.1 High-Level Summary
> *"The top-scoring posts are selected, final visibility checks run, and then—in milliseconds—they're pushed to your screen and potentially millions of others."*

### 2.6.2 Sub-Chapters

**5A: Selection**
- File: `home-mixer/selection.rs`
- Function: `TopKSelector::select()` - Sort and select top K posts

**5B: Post-Selection Visibility Filtering**
- File: `home-mixer/filters/visibility.rs`
- Function: `VFFilter::filter()` - Remove deleted/spam/NSFW content

**5C: Final Delivery**
- File: `home-mixer/server.rs`
- Function: `format_response()` - Serialize for client

### 2.6.3 Detailed Visualization Spec: The Delivery Cascade

**Visual Climax:** Show the tweet reaching thousands of simulated users

```
════════════════════════════════════════════════════════════════════
                       THE DELIVERY CASCADE
════════════════════════════════════════════════════════════════════

[Phase 1: Selection - The Final Cut]

  1,823 scored candidates
            │
            ▼
    ┌───────────────┐
    │ SORT BY SCORE │
    │   DESC        │
    └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ SELECT TOP 50 │
    └───────────────┘
            │
            ▼
      50 selected
            │
            ▼
    ┌───────────────┐
    │ VF FILTERING  │
    │ (spam/NSFW)   │
    └───────────────┘
            │
            ▼
      47 final posts


[Phase 2: The Cascade Effect]

Your tweet scored: #3 in 847 users' feeds

                        ┌──────────────────────────────────────┐
                        │           YOUR TWEET                 │
                        │  "Just tried the new Claude API..."  │
                        └──────────────────────────────────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     │                 │                 │
                     ▼                 ▼                 ▼
              ┌───────────┐     ┌───────────┐     ┌───────────┐
              │  User A   │     │  User B   │     │  User C   │
              │  Rank #3  │     │  Rank #7  │     │  Rank #2  │
              │  ───────  │     │  ───────  │     │  ───────  │
              │  ❤️ 0.92  │     │  ❤️ 0.71  │     │  ❤️ 0.88  │
              │  🔁 0.45  │     │  🔁 0.23  │     │  🔁 0.67  │
              └───────────┘     └───────────┘     └───────────┘
                     │                 │                 │
          ┌──────────┼──────────┬──────┼──────┬─────────┼──────────┐
          │          │          │      │      │         │          │
          ▼          ▼          ▼      ▼      ▼         ▼          ▼
       [User D]  [User E]  [User F] [User G] [User H] [User I] [User J]
       
       ... [cascade continues to 847 total users]


[Phase 3: Engagement Simulation]

Based on the probabilities calculated earlier, simulate actual engagement:

  ════════════════════════════════════════════════════
  │  SIMULATED ENGAGEMENT (30 seconds after post)   │
  ════════════════════════════════════════════════════
  │                                                  │
  │  Impressions:    847 ████████████████████████   │
  │                                                  │
  │  ❤️ Likes:       234 ██████████░░░░░░░░░░░░░░   │
  │  (27.6% rate - consistent with P(like)=0.31)    │
  │                                                  │
  │  🔁 Reposts:      52 ███░░░░░░░░░░░░░░░░░░░░░   │
  │  (6.1% rate - consistent with P(repost)=0.07)   │
  │                                                  │
  │  💬 Replies:      18 █░░░░░░░░░░░░░░░░░░░░░░░   │
  │  (2.1% rate - consistent with P(reply)=0.03)    │
  │                                                  │
  ════════════════════════════════════════════════════

  [The numbers you see are driven by the embedding-based
   probability calculations from earlier!]
```

### 2.6.4 Engagement Simulation Algorithm

```javascript
function simulateEngagement(
  tweetProbabilities,  // { like: 0.31, repost: 0.07, reply: 0.03 }
  audienceMix,         // { techEnthusiasts: 0.8, casual: 0.15, bots: 0.05 }
  totalReach           // 847
) {
  const engagements = {
    impressions: totalReach,
    likes: 0,
    reposts: 0,
    replies: 0,
    likers: []  // For animation
  };
  
  // For each simulated user
  for (let i = 0; i < totalReach; i++) {
    // Determine user type
    const rand = Math.random();
    let userType;
    if (rand < audienceMix.techEnthusiasts) {
      userType = 'tech';
    } else if (rand < audienceMix.techEnthusiasts + audienceMix.casual) {
      userType = 'casual';
    } else {
      userType = 'bot';
    }
    
    // Adjust probabilities based on user type
    let adjustedProbs = { ...tweetProbabilities };
    if (userType === 'tech') {
      // Tech users more likely to engage with tech content
      adjustedProbs.like *= 1.3;
      adjustedProbs.repost *= 1.5;
      adjustedProbs.reply *= 1.4;
    } else if (userType === 'casual') {
      adjustedProbs.like *= 0.7;
      adjustedProbs.repost *= 0.5;
      adjustedProbs.reply *= 0.4;
    } else {
      // Bots rarely engage
      adjustedProbs.like *= 0.1;
      adjustedProbs.repost *= 0.1;
      adjustedProbs.reply *= 0.05;
    }
    
    // Roll the dice for each action
    if (Math.random() < adjustedProbs.like) {
      engagements.likes++;
      engagements.likers.push({
        id: i,
        type: userType,
        delay: Math.random() * 30000  // Random delay for animation
      });
    }
    if (Math.random() < adjustedProbs.repost) {
      engagements.reposts++;
    }
    if (Math.random() < adjustedProbs.reply) {
      engagements.replies++;
    }
  }
  
  return engagements;
}
```

---

# PART III: DETAILED FUNCTION REFERENCE

## 3.1 Complete Function Index

This section provides the implementation details for every function shown in the visualization.

### 3.1.1 Home Mixer Functions

| Function | File | Purpose | GitHub Link |
|----------|------|---------|-------------|
| `main()` | `home-mixer/main.rs` | Entry point, starts gRPC server | `home-mixer/main.rs#L1` |
| `ScoredPostsService::get_scored_posts()` | `home-mixer/server.rs` | Main request handler | `home-mixer/server.rs#L45` |
| `PhoenixCandidatePipeline::run()` | `home-mixer/candidate_pipeline/mod.rs` | Orchestrates pipeline | `home-mixer/candidate_pipeline/mod.rs#L78` |
| `UserActionSequenceHydrator::hydrate()` | `home-mixer/query_hydrators/user_action_sequence.rs` | Fetch engagement history | `home-mixer/query_hydrators/user_action_sequence.rs#L23` |
| `UserFeaturesHydrator::hydrate()` | `home-mixer/query_hydrators/user_features.rs` | Fetch user profile | `home-mixer/query_hydrators/user_features.rs#L18` |

### 3.1.2 Thunder Functions

| Function | File | Purpose | GitHub Link |
|----------|------|---------|-------------|
| `ThunderStore::new()` | `thunder/store.rs` | Initialize in-memory store | `thunder/store.rs#L34` |
| `ThunderStore::ingest()` | `thunder/store.rs` | Process Kafka events | `thunder/store.rs#L89` |
| `ThunderStore::get_posts_for_user()` | `thunder/store.rs` | Retrieve in-network posts | `thunder/store.rs#L156` |
| `PostStore::scan_recent()` | `thunder/post_store.rs` | Scan recent posts | `thunder/post_store.rs#L67` |
| `trim_old_posts()` | `thunder/maintenance.rs` | Garbage collection | `thunder/maintenance.rs#L23` |

### 3.1.3 Phoenix Functions

| Function | File | Purpose | GitHub Link |
|----------|------|---------|-------------|
| `TwoTowerModel.__init__()` | `phoenix/recsys_retrieval_model.py` | Initialize retrieval model | `phoenix/recsys_retrieval_model.py#L45` |
| `TwoTowerModel.user_tower()` | `phoenix/recsys_retrieval_model.py` | Encode user to embedding | `phoenix/recsys_retrieval_model.py#L89` |
| `TwoTowerModel.candidate_tower()` | `phoenix/recsys_retrieval_model.py` | Encode posts to embeddings | `phoenix/recsys_retrieval_model.py#L134` |
| `PhoenixRanker.__init__()` | `phoenix/recsys_model.py` | Initialize ranking transformer | `phoenix/recsys_model.py#L67` |
| `PhoenixRanker.forward()` | `phoenix/recsys_model.py` | Main inference pass | `phoenix/recsys_model.py#L156` |
| `PhoenixRanker.predict_actions()` | `phoenix/recsys_model.py` | Output engagement probabilities | `phoenix/recsys_model.py#L234` |
| `create_candidate_isolation_mask()` | `phoenix/attention.py` | Prevent cross-candidate attention | `phoenix/attention.py#L23` |

### 3.1.4 Filter Functions

| Function | File | Purpose | GitHub Link |
|----------|------|---------|-------------|
| `DropDuplicatesFilter::filter()` | `home-mixer/filters/dedup.rs` | Remove duplicate posts | `home-mixer/filters/dedup.rs#L12` |
| `RepostDeduplicationFilter::filter()` | `home-mixer/filters/dedup.rs` | Dedupe reposts | `home-mixer/filters/dedup.rs#L45` |
| `AuthorSocialgraphFilter::filter()` | `home-mixer/filters/socialgraph.rs` | Remove blocked/muted | `home-mixer/filters/socialgraph.rs#L23` |
| `SelfpostFilter::filter()` | `home-mixer/filters/socialgraph.rs` | Remove own posts | `home-mixer/filters/socialgraph.rs#L67` |
| `AgeFilter::filter()` | `home-mixer/filters/history.rs` | Remove old posts | `home-mixer/filters/history.rs#L18` |
| `PreviouslySeenPostsFilter::filter()` | `home-mixer/filters/history.rs` | Remove seen posts | `home-mixer/filters/history.rs#L45` |
| `MutedKeywordFilter::filter()` | `home-mixer/filters/content.rs` | Remove muted keywords | `home-mixer/filters/content.rs#L23` |
| `VFFilter::filter()` | `home-mixer/filters/visibility.rs` | Spam/NSFW check | `home-mixer/filters/visibility.rs#L34` |

### 3.1.5 Scorer Functions

| Function | File | Purpose | GitHub Link |
|----------|------|---------|-------------|
| `PhoenixScorer::score()` | `home-mixer/scorers/phoenix_scorer.rs` | Call Phoenix ML model | `home-mixer/scorers/phoenix_scorer.rs#L34` |
| `WeightedScorer::score()` | `home-mixer/scorers/weighted_scorer.rs` | Combine action probs | `home-mixer/scorers/weighted_scorer.rs#L23` |
| `AuthorDiversityScorer::score()` | `home-mixer/scorers/diversity.rs` | Apply diversity penalty | `home-mixer/scorers/diversity.rs#L45` |
| `OONScorer::score()` | `home-mixer/scorers/oon_scorer.rs` | Adjust out-of-network | `home-mixer/scorers/oon_scorer.rs#L18` |

---

# PART IV: DATA TRANSFORMATION VISUALIZATIONS

## 4.1 Visual Language for Data Types

Each data type in the pipeline has a distinct visual representation:

### 4.1.1 Primitive Types

```
┌─────────────────────────────────────────────────────────────────┐
│ VISUAL LANGUAGE: DATA TYPES                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER_ID: u64                                                   │
│  ┌──────────────────────────┐                                   │
│  │ 8392847293847291         │  → Solid box, phosphor green      │
│  └──────────────────────────┘                                   │
│                                                                 │
│  POST_ID: u64                                                   │
│  ┌──────────────────────────┐                                   │
│  │ 1928374650192837         │  → Solid box, cyan                │
│  └──────────────────────────┘                                   │
│                                                                 │
│  EMBEDDING: Vec<f32>                                            │
│  ┌─────────────────────────────────────────────┐                │
│  │ [0.23, -0.87, 0.12, 0.45, -0.33, 0.91, ...] │                │
│  └─────────────────────────────────────────────┘                │
│  → Heatmap grid (16x16 for 256-dim), color = value             │
│                                                                 │
│  PROBABILITY: f32                                               │
│  ┌──────────────────────────┐                                   │
│  │ 0.847 ████████████████░░ │  → Bar chart, fills left to right │
│  └──────────────────────────┘                                   │
│                                                                 │
│  SCORE: f32                                                     │
│  ┌──────────────────────────┐                                   │
│  │ 3.567                    │  → Large number, pulsing glow     │
│  └──────────────────────────┘                                   │
│                                                                 │
│  BOOLEAN (filter result):                                       │
│  ✓ PASS → Green flash, continues downward                       │
│  ✗ FAIL → Red flash, exits to side                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1.2 Complex Types

```
┌─────────────────────────────────────────────────────────────────┐
│ VISUAL LANGUAGE: COMPLEX TYPES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST (candidate):                                              │
│  ┌──────────────────────────────────────────────┐               │
│  │ ┌────┐ "Just tried the new Claude API..."    │               │
│  │ │ 📷 │  @user_name · 23m                     │               │
│  │ └────┘ ❤️ 47  🔁 12  💬 3                    │               │
│  └──────────────────────────────────────────────┘               │
│  → Card with truncated text, media indicator, metadata          │
│                                                                 │
│  ENGAGEMENT_HISTORY (sequence):                                 │
│  ┌──────────────────────────────────────────────┐               │
│  │ ← older                               newer →│               │
│  │ [❤️][🔁][❤️][💬][❤️][👤][❤️][🔁][💬][❤️]   │               │
│  └──────────────────────────────────────────────┘               │
│  → Horizontal timeline of action icons                          │
│                                                                 │
│  CANDIDATE_POOL (array):                                        │
│  ┌──────────────────────────────────────────────┐               │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │               │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │               │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │               │
│  │                [2,847 posts]                 │               │
│  └──────────────────────────────────────────────┘               │
│  → Dense grid of small rectangles, each representing a post     │
│  → Color indicates source: blue=Thunder, orange=Phoenix         │
│                                                                 │
│  ATTENTION_WEIGHTS (matrix):                                    │
│  ┌───────────────────┐                                          │
│  │ ▓▓▓░░░▓▓░░░▓░░░▓▓ │  → Heatmap row, brighter = higher weight │
│  └───────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 Transformation Animations

### 4.2.1 Text → Embedding

```
Animation: TEXT_TO_EMBEDDING (duration: 3s)

Frame 1-30 (0-1s):
  INPUT: "Just tried the new Claude API and wow"
  
  Letters begin to dissolve into particles...
  Each word becomes a cluster of floating dots

Frame 31-60 (1-2s):
  Particles flow through a "TRANSFORMER" box
  Inside, show layer-by-layer processing:
  
  ┌─────────────────────────────────────┐
  │ LAYER 1: Token Embedding            │
  │ "Just" → [0.12, -0.34, 0.56, ...]  │
  │ "tried" → [0.78, 0.23, -0.45, ...] │
  │ ...                                 │
  │─────────────────────────────────────│
  │ LAYER 2: Self-Attention             │
  │ [showing attention arcs]            │
  │─────────────────────────────────────│
  │ LAYER 3: Feed-Forward               │
  │ [compression animation]             │
  │─────────────────────────────────────│
  │ LAYER 4: Pooling                    │
  │ [mean pooling - all vectors merge]  │
  └─────────────────────────────────────┘

Frame 61-90 (2-3s):
  OUTPUT: Single embedding appears
  
  ┌────────────────────────────────────────┐
  │  EMBEDDING (256-dim)                   │
  │  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐   │
  │  │▓▓│░░│▓░│▓▓│░░│▓░│░░│▓▓│▓░│░░│▓▓│   │
  │  ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤   │
  │  │░░│▓▓│▓░│░░│▓▓│▓░│▓▓│░░│▓░│▓▓│░░│   │
  │  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘   │
  │  [16x16 grid visualization]            │
  └────────────────────────────────────────┘
```

### 4.2.2 Embedding Similarity Calculation

```
Animation: EMBEDDING_SIMILARITY (duration: 2s)

Frame 1-30 (0-1s):
  Two embeddings appear side by side:
  
  USER_EMBED           CANDIDATE_EMBED
  ┌──────────────┐     ┌──────────────┐
  │ ▓▓░░▓░░▓▓░░▓ │     │ ▓▓░░▓░░▓░░░▓ │
  │ ░░▓▓░▓▓░░▓▓░ │     │ ░░▓░░▓▓░░▓░░ │
  │ ▓░░▓▓░░▓░░▓▓ │     │ ▓░░▓▓░░▓░░▓░ │
  └──────────────┘     └──────────────┘

Frame 31-60 (1-2s):
  Embeddings slide toward each other
  Corresponding elements highlight and multiply:
  
  0.23 × 0.21 = 0.048
  -0.87 × -0.85 = 0.740
  0.12 × 0.11 = 0.013
  ...
  
  Numbers stream and accumulate:
  
  SUM = 0.048 + 0.740 + 0.013 + ...
      = 0.847
  
  Final result flashes:
  ┌──────────────────────────────┐
  │ SIMILARITY: 0.847 (HIGH)    │
  │ ████████████████████████░░░ │
  └──────────────────────────────┘
```

### 4.2.3 Filter Application

```
Animation: FILTER_GATE (duration: 1.5s per filter)

Frame 1-20 (0-0.5s):
  Posts flowing toward filter gate:
  
       ░ ░ ░ ░ ░ ░ ░ ░
        ░ ░ ░ ░ ░ ░ ░
         │ │ │ │ │ │
         ▼ ▼ ▼ ▼ ▼ ▼
  ═══════════════════════════
  │     AGE FILTER          │
  │     < 48 hours          │
  ═══════════════════════════

Frame 21-35 (0.5-0.9s):
  Filter "scans" posts (horizontal line passes through):
  
  ═══════▓▓▓▓▓▓▓▓▓▓▓════════
  │   SCANNING...           │
  ═══════════════════════════
  
  Each post lights up briefly as scanned

Frame 36-45 (0.9-1.5s):
  Results appear:
  - Passing posts flash GREEN and continue down
  - Failing posts flash RED and slide off to side
  
         ✓ ✓ ✗ ✓ ✗ ✓
         │ │   │   │
  ═══════════════════════════
  │  ✓ 847 PASS  ✗ 62 FAIL │
  ═══════════════════════════
         │ │   │   │
         ▼ ▼   └──→ [REJECT BIN]
         ░ ░
```

### 4.2.4 Score Calculation

```
Animation: SCORE_CALCULATION (duration: 4s)

Frame 1-60 (0-2s):
  Show candidate post at top
  Show engagement probabilities appearing one by one:
  
  ┌──────────────────────────────────────────────────┐
  │ CANDIDATE: "Breaking: Tech earnings beat..."      │
  └──────────────────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────────────────────────────┐
  │ P(❤️ like)      ████████████░░░░ 0.723          │
  │ P(🔁 repost)    █████░░░░░░░░░░░ 0.312          │  ← Bars fill in
  │ P(💬 reply)     ███░░░░░░░░░░░░░ 0.156          │    with sound
  │ P(🔗 click)     ██████████░░░░░░ 0.634          │
  │ P(🚫 not int)   █░░░░░░░░░░░░░░░ 0.045          │
  └──────────────────────────────────────────────────┘

Frame 61-90 (2-3s):
  Show weights being applied:
  
  WEIGHT × PROBABILITY = CONTRIBUTION
  ──────────────────────────────────────
   1.0  ×   0.723    =   0.723  [like]
   3.0  ×   0.312    =   0.936  [repost]
   5.0  ×   0.156    =   0.780  [reply]
   0.5  ×   0.634    =   0.317  [click]
  -1.0  ×   0.045    =  -0.045  [not interested]
  ──────────────────────────────────────
  
  Numbers float and merge together...

Frame 91-120 (3-4s):
  Final score appears with dramatic reveal:
  
  ┌────────────────────────────────────┐
  │          FINAL SCORE               │
  │                                    │
  │         ╔═══════════╗              │
  │         ║   2.711   ║              │
  │         ╚═══════════╝              │
  │                                    │
  │  [Rank: #7 of 1,823 candidates]    │
  └────────────────────────────────────┘
```

---

# PART V: THE USER'S TWEET JOURNEY

## 5.1 Contextualizing Within the Crowd

The user's tweet doesn't travel alone. It must be shown alongside many other tweets to demonstrate that:
1. It's competing for attention
2. Some tweets get rejected while others pass
3. Rankings are relative to other content

### 5.1.1 Simulated Tweet Pool

Pre-generate 50-100 diverse fake tweets to travel alongside the user's tweet:

```javascript
const SIMULATED_TWEETS = [
  {
    id: 'sim_1',
    text: "Just got back from an amazing trip to Japan 🇯🇵",
    author: { name: "TravelEnthusiast", followers: 5420, verified: false },
    media: 'photo',
    age_minutes: 15,
    category: 'personal'
  },
  {
    id: 'sim_2', 
    text: "Breaking: Fed announces interest rate decision",
    author: { name: "FinanceNews", followers: 890000, verified: true },
    media: null,
    age_minutes: 3,
    category: 'news'
  },
  {
    id: 'sim_3',
    text: "This is why you should never give up on your dreams 🙌",
    author: { name: "MotivationDaily", followers: 234000, verified: false },
    media: 'video',
    age_minutes: 45,
    category: 'inspirational'
  },
  // ... 47 more diverse tweets
];

// Compute embeddings for all simulated tweets on startup
async function initializeSimulatedTweets() {
  for (const tweet of SIMULATED_TWEETS) {
    tweet.embedding = await getEmbedding(tweet.text);
    tweet.categories = await classifyContent(tweet.text);
  }
}
```

### 5.1.2 User Tweet Highlighting

Throughout the visualization, the user's tweet should be visually distinct:

```css
.user-tweet {
  /* Golden glow effect */
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.1);
  
  /* Slightly larger */
  transform: scale(1.05);
  
  /* Pulsing animation */
  animation: user-tweet-pulse 2s infinite;
}

@keyframes user-tweet-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
}

/* Label */
.user-tweet::before {
  content: "YOUR TWEET";
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--phosphor-amber);
  letter-spacing: 2px;
}
```

### 5.1.3 Journey Narration

At each stage, show a brief narration specific to the user's tweet:

```
CHAPTER 2 (GATHERING):
"Your tweet about Claude API has been picked up by Thunder 
 (you have 12,394 followers) and is now competing with 
 2,846 other candidates for screen time."

CHAPTER 3 (FILTERING):
"Your tweet passes all filters:
 ✓ Not a duplicate
 ✓ Not from a blocked account  
 ✓ Posted 2 minutes ago (within 48hr limit)
 ✓ Contains no muted keywords
 
 847 candidates were eliminated. Your tweet survives."

CHAPTER 4 (SCORING):
"The Phoenix transformer analyzed your engagement history
 and determined users who like AI/tech content have:
 
 84.7% chance to LIKE your tweet
 41.2% chance to REPOST
 23.4% chance to REPLY
 
 Your weighted score: 3.567 (RANK #3 of 1,823)"

CHAPTER 5 (DELIVERY):
"Your tweet will appear in 847 users' feeds.
 Based on the calculated probabilities:
 
 Expected likes: ~234
 Expected reposts: ~52
 Expected replies: ~18
 
 Watch the engagement roll in..."
```

---

# PART VI: INTERACTIVE ELEMENTS

## 6.1 Timeline Scrubber

### 6.1.1 Visual Design

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [◀◀] [◀] [▶/▮▮] [▶▶]                                    [🔊] [⚙]│
│                                                                    │
│  ───●────────┬────────┬────────┬────────┬────────┬───────────────  │
│     │        │        │        │        │        │                 │
│   START    CH.1     CH.2     CH.3     CH.4     CH.5             END│
│  REQUEST  GATHER   FILTER   SCORE   DELIVER                        │
│                                                                    │
│  Current: CHAPTER 3 - THE FILTERING                   [1:45/4:32] │
│  Function: MutedKeywordFilter::filter()                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 6.1.2 Chapter Markers

Each chapter marker is clickable and shows a tooltip preview:

```javascript
const CHAPTER_MARKERS = [
  {
    id: 'ch1',
    name: 'THE REQUEST',
    startTime: 0,
    duration: 30,
    color: '#00ff00',
    thumbnail: 'assets/ch1_preview.png',
    summary: 'A gRPC request launches the pipeline'
  },
  {
    id: 'ch2', 
    name: 'THE GATHERING',
    startTime: 30,
    duration: 60,
    color: '#00aaff',
    thumbnail: 'assets/ch2_preview.png',
    summary: 'Thunder + Phoenix collect 2,847 candidates'
  },
  // ... etc
];
```

### 6.1.3 Auto-Play Behavior

The animation should auto-play once the user clicks "BEGIN SIMULATION" without requiring any additional interaction:

```javascript
class AnimationController {
  constructor() {
    this.currentTime = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
  }
  
  beginSimulation() {
    // Fade out config panel
    fadeOut('#config-panel');
    
    // Start animation
    this.isPlaying = true;
    this.animationLoop();
    
    // Start background audio
    startAmbientAudio();
  }
  
  animationLoop() {
    if (!this.isPlaying) return;
    
    this.currentTime += (16.67 * this.playbackSpeed); // 60fps
    this.renderFrame(this.currentTime);
    
    requestAnimationFrame(() => this.animationLoop());
  }
  
  scrubTo(time) {
    this.currentTime = time;
    this.renderFrame(time);
  }
}
```

## 6.2 Function Info Panels

### 6.2.1 Collapsed State

```
┌───────────────────────────────────────┐
│ ▶ fn MutedKeywordFilter::filter()    │
│   home-mixer/filters/content.rs       │
└───────────────────────────────────────┘
```

### 6.2.2 Expanded State

```
┌───────────────────────────────────────────────────────────────────┐
│ ▼ fn MutedKeywordFilter::filter()                                │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ PURPOSE:                                                          │
│ Removes posts containing keywords the user has muted.             │
│ Muted keywords are stored in user preferences and checked         │
│ against post text using case-insensitive substring matching.      │
│                                                                   │
│ FILE: home-mixer/filters/content.rs                              │
│ LINES: 23-67                                                      │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ impl Filter for MutedKeywordFilter {                         │ │
│ │     fn filter(&self, candidates: &[Candidate],              │ │
│ │               query: &Query) -> Vec<Candidate> {            │ │
│ │         let muted = &query.user_features.muted_keywords;    │ │
│ │         candidates.iter()                                    │ │
│ │             .filter(|c| !self.contains_muted(c, muted))     │ │
│ │             .cloned()                                        │ │
│ │             .collect()                                       │ │
│ │     }                                                        │ │
│ │ }                                                            │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ [🔗 View on GitHub]  [📋 Copy code]                              │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 6.3 Marquee Banner

### 6.3.1 Implementation

```javascript
const MARQUEE_CONFIG = {
  messages: [
    { text: "⭐ Star this project on GitHub", link: "https://github.com/xai-org/x-algorithm" },
    { text: "🐦 Follow @creator_handle on X", link: "https://x.com/creator_handle" },
    { text: "📖 Read the full documentation", link: "https://github.com/xai-org/x-algorithm#readme" }
  ],
  speed: 50, // pixels per second
  pauseOnHover: true
};

// Styling
.marquee-container {
  height: 24px;
  background: var(--crt-dark);
  border-bottom: 1px solid var(--phosphor-green);
  overflow: hidden;
}

.marquee-content {
  display: flex;
  animation: marquee-scroll 30s linear infinite;
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: var(--phosphor-green);
}

@keyframes marquee-scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.marquee-link {
  color: var(--phosphor-amber);
  text-decoration: underline;
  margin: 0 20px;
}

.marquee-link:hover {
  color: var(--phosphor-white);
  text-shadow: 0 0 10px var(--phosphor-amber);
}
```

---

# PART VII: TECHNICAL IMPLEMENTATION GUIDE

## 7.1 Recommended Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | React 18 + TypeScript | Component-based, type-safe |
| Styling | Tailwind CSS + CSS Custom Properties | Rapid styling + theming |
| Animation | Framer Motion + GSAP | Smooth, timeline-based animations |
| Canvas | Three.js (WebGL) or PixiJS | Particle effects, shaders |
| Audio | Tone.js | Generative audio synthesis |
| ML | Transformers.js | Client-side embeddings |
| State | Zustand | Simple state management |
| Build | Vite | Fast dev experience |

## 7.2 Project Structure

```
x-algorithm-visualizer/
├── public/
│   ├── fonts/
│   │   ├── VT323-Regular.woff2
│   │   └── PressStart2P-Regular.woff2
│   ├── audio/
│   │   └── samples/
│   └── assets/
│       └── chapter-previews/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Marquee.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── FunctionPanel.tsx
│   │   │   └── ConfigPanel.tsx
│   │   ├── visualization/
│   │   │   ├── Canvas.tsx
│   │   │   ├── DataFlow.tsx
│   │   │   ├── FilterGate.tsx
│   │   │   ├── ScoreCalculation.tsx
│   │   │   ├── EmbeddingGrid.tsx
│   │   │   └── TweetCard.tsx
│   │   └── effects/
│   │       ├── CRTOverlay.tsx
│   │       ├── Scanlines.tsx
│   │       ├── PhosphorTrail.tsx
│   │       └── ScreenFlicker.tsx
│   ├── chapters/
│   │   ├── Chapter1_Request.tsx
│   │   ├── Chapter2_Gathering.tsx
│   │   ├── Chapter3_Filtering.tsx
│   │   ├── Chapter4_Scoring.tsx
│   │   └── Chapter5_Delivery.tsx
│   ├── ml/
│   │   ├── embeddings.ts
│   │   ├── similarity.ts
│   │   └── engagement-predictor.ts
│   ├── audio/
│   │   ├── synth.ts
│   │   ├── effects.ts
│   │   └── sequences.ts
│   ├── data/
│   │   ├── simulated-tweets.ts
│   │   ├── personas.ts
│   │   ├── functions.ts
│   │   └── chapter-content.ts
│   ├── stores/
│   │   ├── animation-store.ts
│   │   ├── config-store.ts
│   │   └── ml-store.ts
│   ├── hooks/
│   │   ├── useAnimation.ts
│   │   ├── useEmbedding.ts
│   │   └── useAudio.ts
│   ├── styles/
│   │   ├── crt-effects.css
│   │   ├── typography.css
│   │   └── animations.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 7.3 Performance Considerations

### 7.3.1 Embedding Computation

MiniLM inference can be slow. Pre-compute what you can:

```typescript
// ml/embeddings.ts

import { pipeline } from '@xenova/transformers';

let embedder: any = null;
let isLoading = false;
const embeddingCache = new Map<string, number[]>();

export async function initializeEmbedder() {
  if (embedder || isLoading) return;
  isLoading = true;
  
  // Show loading indicator
  embedder = await pipeline(
    'feature-extraction', 
    'Xenova/all-MiniLM-L6-v2',
    { progress_callback: (progress) => updateLoadingUI(progress) }
  );
  
  // Pre-compute common embeddings
  await precomputeEmbeddings();
  
  isLoading = false;
}

async function precomputeEmbeddings() {
  const commonTexts = [
    // Category embeddings
    'technology artificial intelligence software programming',
    'entertainment movies music celebrities',
    'sports football basketball athletes',
    'politics government elections policy',
    'food cooking recipes restaurants',
    
    // Action concept embeddings
    'I enjoy this content it is interesting and valuable',
    'This is so good I want to share it with my followers',
    'I have something to say about this I want to engage',
    'This is boring irrelevant or low quality',
    
    // ... more common texts
  ];
  
  await Promise.all(
    commonTexts.map(text => getEmbedding(text))
  );
}

export async function getEmbedding(text: string): Promise<number[]> {
  // Check cache
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  if (!embedder) {
    await initializeEmbedder();
  }
  
  const result = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(result.data) as number[];
  
  // Cache result
  embeddingCache.set(text, embedding);
  
  return embedding;
}
```

### 7.3.2 Animation Performance

Use requestAnimationFrame wisely:

```typescript
// hooks/useAnimation.ts

import { useCallback, useRef } from 'react';

export function useAnimationFrame(callback: (delta: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const delta = time - previousTimeRef.current;
      callback(delta);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  // ... start/stop methods
}

// For particle systems, use WebGL/Canvas, not DOM
// For text animations, use CSS transforms (GPU-accelerated)
// Batch DOM updates with React's concurrent features
```

### 7.3.3 WebGL for Heavy Effects

```typescript
// effects/CRTShader.ts

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Scanlines
    float scanline = sin(uv.y * resolution.y * 2.0) * 0.04;
    
    // Chromatic aberration
    float aberration = 0.002;
    float r = texture2D(tDiffuse, uv + vec2(aberration, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(aberration, 0.0)).b;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 0.8, length(uv - 0.5));
    
    // Flicker
    float flicker = 0.97 + 0.03 * sin(time * 10.0);
    
    vec3 color = vec3(r, g, b);
    color -= scanline;
    color *= vignette;
    color *= flicker;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
```

## 7.4 Mobile Considerations

The experience should be viewable on mobile, though optimized for desktop:

```typescript
// hooks/useResponsive.ts

export function useResponsiveConfig() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return {
    // Reduce particle count on mobile
    particleCount: isMobile ? 500 : 2000,
    
    // Simplify animations
    animationComplexity: isMobile ? 'simple' : 'full',
    
    // Adjust layout
    layout: isMobile ? 'stacked' : 'split',
    
    // Disable some CRT effects on mobile (battery)
    crtEffects: isMobile ? ['scanlines'] : ['scanlines', 'flicker', 'chromatic']
  };
}
```

---

# PART VIII: APPENDICES

## A. Color Accessibility

The phosphor green color scheme, while authentic, can be difficult for some users. Provide an alternative high-contrast mode:

```css
/* High contrast mode */
body.high-contrast {
  --phosphor-green: #ffffff;
  --phosphor-amber: #ffff00;
  --crt-black: #000000;
  background: #000000;
}

/* Reduced motion mode */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## B. Embedding Model Details

**Model:** `all-MiniLM-L6-v2`
**Embedding Dimension:** 384 (we display as 256 for visual simplicity)
**Inference Time:** ~50ms per sentence (client-side)
**Model Size:** ~22MB (downloaded on first load)

Alternative lighter model: `paraphrase-MiniLM-L3-v2` (14MB, 128-dim)

## C. Audio Asset List

| Sound ID | Description | Duration | Notes |
|----------|-------------|----------|-------|
| `typewriter_key` | Single key press | 50ms | Randomize pitch ±10% |
| `data_chirp` | High-frequency data sound | 20ms | Layer multiple |
| `filter_pass` | Rising chime | 200ms | Major chord |
| `filter_fail` | Descending buzz | 300ms | Dissonant |
| `score_tick` | Counting sound | 30ms | Accelerate tempo |
| `score_reveal` | Dramatic reveal | 500ms | Synth pad |
| `user_engagement` | Soft ping | 100ms | Stereo pan based on position |
| `chapter_transition` | CRT power-on | 1000ms | White noise + hum |
| `ambient_drone` | Background atmosphere | Loop | Low frequency, subtle |

## D. Testing Checklist

- [ ] All chapter animations play correctly in sequence
- [ ] Timeline scrubbing works without breaking animations
- [ ] Embedding computations complete without errors
- [ ] Audio plays on user interaction (autoplay blocked by browsers)
- [ ] CRT effects don't cause performance issues
- [ ] Mobile layout is usable (even if simplified)
- [ ] GitHub links point to correct files/lines
- [ ] Simulated engagement numbers are proportional to calculated probabilities
- [ ] High contrast mode works for accessibility
- [ ] Reduced motion mode disables animations

## E. Future Enhancements

1. **Multi-language support**: Translate narration, but keep code in English
2. **Comparison mode**: Run two tweets side-by-side to see scoring differences
3. **Historical mode**: Show how the algorithm has changed over time
4. **Export mode**: Let users export their simulation as a video
5. **API integration**: (If X provides) show real engagement data vs predictions

---

# CONCLUSION

This design document provides a comprehensive blueprint for creating an unforgettable visualization of X's recommendation algorithm. By combining:

- **Authentic CRT aesthetics** that evoke the mystique of "looking behind the curtain"
- **Real semantic embeddings** that make the number-crunching truthful
- **Carefully mapped codebase references** that connect visuals to source code
- **Progressive revelation** through chapters and functions
- **Emotional engagement** through watching one's own tweet journey through the system

...the experience will achieve its goal of **radical demystification**—transforming opaque ML systems into comprehensible, even beautiful, sequences of mathematical transformations.

The viewer will walk away understanding that behind every tweet they see is not magic, but math—specifically, transformer attention, embedding similarities, weighted scores, and filter predicates. And that understanding is empowering.

---

*Document prepared for frontend engineering implementation.*
*Version 1.0 - January 2026*
