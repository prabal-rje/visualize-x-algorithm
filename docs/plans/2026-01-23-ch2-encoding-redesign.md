# Chapter 2 Encoding Steps Redesign

## Goal

Redesign the tokenize/embedding/pooling visualization (steps 0-2) in Chapter 2 to be cleaner and more animated.

## Changes Summary

1. Remove the ugly vertical stage rail boxes (1, 2, 3)
2. Step 0: Clean token display with fade-out for overflow
3. Step 1: Animated token-by-token embedding transformation
4. Step 2: Multiple token matrices pooling into final embedding

---

## Step 0: Tokenize Tweet

**Remove:**
- `ENCODING_STAGES` sidebar with numbered boxes
- `stageRail` and `stageCard` components

**Show:**
- Step label "2A: Tokenize Tweet" (like other chapters)
- Tokens as inline chips, up to 20 visible
- Tokens beyond 20 fade to 30% opacity with "..." indicator
- Subtle token count: `TOKENS: 24`

**Layout:**
```
2A: Tokenize Tweet

[ ^Jus ] [ t ] [ _tri ] [ ed ] [ _the ] [ _new ] [ _Cla ] [ ude ]
[ _API ] [ _and ] [ _wow ] [ , ] [ _the ] [ _too ] [ l ] [ _use ]
[ _is ] [ _inc ] [ red ] [ ibl ] ...

TOKENS: 24
```

---

## Step 1: Token Embeddings

**Show:**
Single token cycling with "whoosh" transformation into small matrix.

**Layout:**
```
2B: Token Embeddings

   [ _API ]  ->  [████████]
                 [████████]
                 [████████]
                 [████████]
```

**Animation (~1s per token):**
1. Token slides in from left (0-200ms)
2. Matrix (8x4 = 32 cells) shimmers with random colors (200-700ms)
3. Token + matrix slide out right (700-1000ms)
4. Next token slides in, matrix colors shift to new random values
5. Loop forever through all tokens

**Matrix specs:**
- 8 columns x 4 rows (32 cells)
- Same color palette as EmbeddingHeatmap at 60% opacity
- Colors regenerate randomly for each token (the "whoosh")
- Subtle shimmer animation while visible

No progress indicator — just continuous cycling.

---

## Step 2: Pooling

**Show:**
Multiple small token matrices flowing into the final 128-dim embedding.

**Layout:**
```
2C: Pooling

   [ ^Jus ]  [████]
             [████]
                           ═══▶   [████████████████]
   [ _tri ]  [████]               [████████████████]
             [████]               [████████████████]
                    ═══▶          [████████████████]
   [ ed ]    [████]               [████████████████]
             [████]               [████████████████]
                                  [████████████████]
                                  [████████████████]

   TOKEN VECTORS              POOLED EMBEDDING (128-dim)
```

**Left side — Token vectors:**
- Show `min(tokenCount, 3)` token+matrix pairs
- Each matrix is 4x2 cells (8 total)
- Tokens cycle through positions independently (different phase offsets)
- Matrices shimmer with random colors per token

**Arrow:**
- Pulsing CRT glow arrow
- Amber/green glow, ~1.5s pulse cycle

**Right side — Final embedding:**
- Full 16x8 (128-dim) EmbeddingHeatmap
- Uses actual computed `userEmbedding`
- Label: "POOLED EMBEDDING (128-dim)"

---

## Files to Modify

- `src/components/chapters/Chapter2Scene.tsx` — Remove stageRail, update step renders
- `src/styles/chapter2-scene.module.css` — Remove stageRail styles, add new animation styles
- `src/components/visualization/TokenizationFlow.tsx` — Simplify or replace
- New: `src/components/visualization/TokenEmbeddingAnim.tsx` — Step 1 animation
- New: `src/components/visualization/PoolingViz.tsx` — Step 2 visualization

## Mobile Considerations

Apply same design principles but with tighter spacing:
- Step 0: Show fewer tokens (up to 12) before fade
- Step 1: Same animation, smaller matrix
- Step 2: Show 2 token matrices max, stacked vertically
