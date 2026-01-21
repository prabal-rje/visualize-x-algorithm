# FEEDBACK_TODO.md - Actionable Items from Review 2

## Priority: CRITICAL (Breaks core experience)

- [x] **Ch0: Add defaults warning dialog** - When user clicks NEXT without explicit choices, show timed toast: "Using defaults: AI/ML Researcher persona, balanced audience mix"

- [x] **Ch2: Fix embedding hover tooltip** - Currently semi-transparent and unreadable. Increase opacity, add backdrop blur, ensure tooltip is above other dots

- [x] **Ch4: Fix "Hover to inspect"** - Attention weights hover does nothing useful. Should show: original tweet text, attention score explanation, which tokens contributed

- [x] **Ch5: Show user's tweet in ranking** - The user's tweet must appear in Top-K selection, highlighted. Currently shows generic "Candidate A/B/C" labels

- [x] **All: Fix MOMENTUM decimal places** - "13.528678304239403%" should be "13.5%" - round to 1 decimal place max

---

## Priority: HIGH (Major UX improvements)

### Chapter 0: Mission Prep
- [x] **Remove "MISSION LOADOUT" header redundancy** - It appears on every sub-step. Show once at top, not repeated
- [x] **Remove EXPERT MODE checkbox** - Confusing, unclear what it does. Nix it entirely per user request
- [x] **Replace audience sliders with multi-select boxes** - Pre-select relevant audiences based on chosen persona. Allow click to toggle, hover reveals "resize" tip

### Chapter 1: The Request
- [x] **Consolidate function references** - Pick ONE location (suggest: top bar only). Remove bottom FUNCTION: line
- [x] **Add floating emoji visualization for ENGAGEMENT_HISTORY** - Golden faded like/retweet/reply icons "fluttering" into the box
- [x] **Add simple avatar/icon for USER_PROFILE** - Not just a text list
- [x] **Merge pages with same visualization** - If only function changes, show function stack in top bar instead of new page

### Chapter 2: The Gathering
- [x] **Fix tokenization visibility** - Show all tokens, scrollable if needed
- [x] **Animate tokenization flow progressively**: 1) Tokenize 2) Per-token embedding 3) Pooling 4) Final embedding
- [x] **Fix function bar mismatch** - 2A shows encoding but function bar shows retrieval
- [x] **Add dot brightness/size variation by similarity** - High similarity = brighter, closer to center
- [x] **Hover on user's tweet should show tweet text**
- [x] **Add animation for tweet placement** - Show tweets arriving and being placed based on similarity

### Chapter 3: The Filtering
- [x] **Consolidate filter pages** - Show 2-3 filters per page with function stack
- [x] **Add animation for filtering** - Show posts being visually "removed" when filtered

### Chapter 4: The Scoring
- [x] **Animate attention weight bars** - Progressive fill animation
- [x] **Merge "combining scores" and "author penalty" pages** - Same visualization
- [x] **Add dynamic score calculation visualization** - Show P(like), P(retweet) being weighted and summed

### Chapter 5: The Delivery
- [x] **Replace "Candidate A/B/C" with actual tweet previews** - Show tweet text snippets
- [x] **Add fake human avatars library** - Use a JS library (e.g., Boring Avatars, DiceBear) for simulated users
- [x] **Animate engagement cascade** - Like/retweet/comment emojis fizzing around avatars at random intervals
- [x] **Progressive stat reveal** - Don't dump all delivery stats at once

---

## Priority: MEDIUM (Polish & Enhancement)

### Global
- [x] **Reconsider sidebar** - "Mission Report" takes ~30% width. Either make interactive or collapse to icon
- [x] **Use Web Worker for embeddings** - Async computation, don't block main thread
- [x] **Use Matryoshka N=30 for similarity** - Full 128-D not needed for display purposes
- [x] **Function stack in header** - Horizontal marquee on desktop, vertical on mobile for tight space
- [x] **Clarify CRT CTRL button** - Add tooltip or label explaining what it does

### Chapter 0
- [x] **Strengthen RPG framing** - "You are about to test YOUR tweet against the algorithm. Choose your identity..."
- [x] **Pre-select audiences based on persona** - AI/ML Researcher → auto-select Tech Enthusiasts, Researchers, Founders

### Chapter 1
- [x] **Show gRPC call animation** - Data flowing between client and HOME-MIXER

### Chapter 2
- [x] **Separate page for similarity placement animation** - BEFORE showing the final "map" of all tweets

---

## Priority: LOW (Nice to have)

- [x] **Add sound effects** - Terminal beeps, data transmission sounds (optional, user-togglable)
- [x] **Add scanline intensity control to CRT CTRL** - If not already there
- [x] **Chapter titles more prominent** - THE GATHERING should feel like entering a new dungeon

---

## Mobile-Specific (375px) - CRITICAL FAILURES FOUND

### Layout Breaks
- [x] **Fix title truncation** - "MISSION PREP" → "MISSION PRE", "MISSION LOADOUT" → "MISSION LOADO"
- [x] **Fix chapter tab overflow** - Only CH.0-2 visible, CH.3-5 hidden off-screen. Use hamburger menu or horizontal scroll with indicators
- [x] **Fix navigation buttons** - "START OVER" shows as "RST", "BACK" shows as "<<". Make full-width or use icons with tooltips
- [x] **Fix persona grid** - 2-column layout broken. Right column shows only abbreviations (SE, VI, TR). Stack to single column on mobile
- [x] **Fix CTA button positioning** - "Continue to Audience" at x=356 is nearly off 375px screen! Center all CTAs

### Usability
- [x] **Larger touch targets** - Buttons and interactive elements need min 44px tap target
- [x] **Full-width primary buttons** - CTAs should span viewport width on mobile
- [x] **Increase slider size** - Audience mix sliders too small for finger manipulation
- [x] **Remove or collapse sidebar** - No room for Mission Report panel on mobile
- [x] **Hide CRT CTRL on mobile** - Wastes vertical space, move to settings

### Text Overflow
- [x] **Truncate with ellipsis** - All text that overflows should show "..." not just clip
- [x] **Reduce narration text on mobile** - Shorten or use expandable "Read more"

## Tablet-Specific (768px) - MOSTLY OK

### Minor Issues
- [x] **Full-text nav buttons** - At 768px there's room for "START OVER" and "BACK" instead of "RST" and "<"
- [x] **Collapsible sidebar option** - Consider slide-out panel for Mission Report stats
- [x] **Increase touch target padding** - Persona cards could use slightly more padding for finger taps
- [x] **CRT CTRL positioning** - Move to corner icon or collapse to save space

---

## Technical Debt
- [x] Move embedding computation to Web Worker
- [x] Use intersection observer for animation triggers
- [x] Lazy-load chapter components
- [x] Consider skeleton states while computing
