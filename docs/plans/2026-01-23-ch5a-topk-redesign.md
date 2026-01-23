# Chapter 5A: Top-K Selection Redesign

## Problem

4E (Where You Rank) and 5A (Top-K Selector) show similar information but feel disconnected. 5A shows different candidates with @handles and full tweet text, which adds clutter without teaching anything new.

## Solution

Make 5A a direct visual continuation of 4E. Show the same 4 candidates, then animate the selection process with pass/fail feedback.

## Pass Criteria

A tweet passes if BOTH conditions are met:
- Score >= 0.4 (absolute floor)
- Rank in top 3 of 5 candidates (competitive threshold)

## Animation Sequence

### Phase 1: Inherited (0-1s)
- Panel shows same 4 candidates from 4E
- Header: "TOP 3 SELECTION" with "EVALUATING..."
- All rows visible, neutral state

### Phase 2: Selecting (1-2s)
- Top 3 rows get green border/glow
- Bottom row(s) begin fading (opacity 0.3)
- Header subtitle: "SELECTING..."

### Phase 3: Filtering (2-3s)
- Failed rows slide down and fade out
- If user score < 0.4, their row fades even if in top 3
- Header subtitle: "FILTERING..."

### Phase 4: Result (3s+)
- Only passing tweets remain visible
- VISIBILITY FILTER shows verdict:
  - PASS (green): user in top 3 AND score >= 0.4
  - FAIL (red): user not in top 3 OR score < 0.4
- If failed, user row reappears dimmed with "FILTERED OUT" badge

## Component Changes

### Chapter4Scene.tsx
- Rankings computation stays as-is
- No export needed (compute identically in Ch5)

### Chapter5Scene.tsx
- Remove current TopKSelector with @handles
- Replace with animated selector using same candidate format as 4E
- Add animationPhase state progressing through 4 phases

### TopKSelector.tsx (rewrite)
- Accept `phase` prop for animation state
- Accept `minScore` (0.4) and `topK` (3) as props
- Compute: `userPassed = userRank <= topK && userScore >= minScore`
- Animate rows based on phase
- Show VISIBILITY FILTER verdict

## What Gets Removed
- @handles (@latentlabs, @founderlog, etc.)
- Full tweet preview text in 5A
- "Unmasked" candidate aesthetic

## What Stays
- Simple labels (Candidate A, B, C, Your Tweet)
- Scores
- VISIBILITY FILTER verdict (now dynamic)
