# Chapter 5 B/C/D Redesign

## Problem Statement

Two issues with current Chapter 5 sub-sections:

1. **Language breaks the illusion** — Uses "simulation", "estimated", "predicted vs actual" language when it should describe what X's algorithm does
2. **Mobile is lifeless** — Desktop has animated avatars and particles; mobile is static text rows

## Design Decisions

### Language Reframing (All Platforms)

| Location | Current | New |
|----------|---------|-----|
| 5B narration | "Reach forecasts split impressions across the audience mix..." | "Your tweet enters the feed of users who match your content..." |
| 5B note | "Estimated from embedding similarity + audience mix." | "Distribution based on interest overlap and follow graph." |
| 5C narration | "Engagement bursts simulate the first wave of reactions..." | "The first wave of users see your tweet and react..." |
| 5C note (desktop) | "Burst timing estimated from embedding similarity + persona fit." | "Reaction timing based on user activity patterns." |
| 5C note (mobile) | "Predicted vs actual burst counts." | "Early engagement signals." |
| 5D narration | "Delivery report summarizes performance against expectations..." | "Your tweet's performance after the first delivery cycle..." |

### Mobile 5B: Reach Forecast

**Additions:**
- Count-up animation on total impressions number (0 → final over ~1s)
- Mini inline progress bars for each audience segment that fill from 0% to final %

**Why:** Total impressions is the headline—animating it draws attention. Progress bars filling shows "distribution happening" which matches the reach narrative.

### Mobile 5C: Reaction Burst

**Current:** Three static rows showing "Likes: X / Y" format

**New layout (top to bottom):**
1. Header: "AUDIENCE REACTIONS"
2. Mini avatar row: 5 small avatars (24px) horizontal strip
3. Stats area with floating micro-particles behind
4. Footer note: "Early engagement signals."

**Mini Avatar Row:**
- 5 avatars using `boring-avatars` (same library as desktop)
- Each gets a reaction icon (♥, 💬, ↻) that pops in sequence
- Staggered 0.2s apart
- Icons ~12-14px

**Floating Micro-Particles:**
- 6-8 tiny emoji (♥, 💬, ↻) at ~10px
- Drift upward slowly behind stats
- Low opacity (0.3-0.4)
- Randomized positions and timing
- Continuous gentle loop

**Stats:**
- Show just the actual counts (not "X / Y" format)
- Count-up animation from 0 to final value

### Mobile 5D: Delivery Report

**Additions:**
- Staggered reveal: rows fade in one by one (Reach → Alignment → Tier)
- ~0.3s delay between each row
- Performance tier badge pulses/glows when revealed

**Why:** This is the finale. Staggered reveal builds anticipation. Tier badge pulse emphasizes the verdict moment.

## Files to Modify

1. `src/components/chapters/Chapter5Scene.tsx` — Narration text, mobile layouts, add animations
2. `src/styles/chapter5-scene.module.css` — Animation keyframes, mobile styles

## Implementation Notes

- Reuse `boring-avatars` and `AVATAR_COLORS` already in the file
- Count-up can use CSS counter or a simple React state + useEffect
- Micro-particles can be absolutely positioned spans with CSS animation
- Progress bar fill can use CSS transition on width
