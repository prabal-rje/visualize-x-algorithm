# TODO STACK - UI/UX POLISH SPRINT

Instructions:
1. This file is a stack; the top-most unchecked item is done first.
2. Keep items ordered by priority; insert new tasks in place (do not just append).
3. Use headings for hierarchy; keep child tasks under the relevant parent.
4. When a task is done, mark it [x] and move it to the Completed section.

## Stack (Top = next)

### POLISH (When Time Permits)
- [ ] **Animation Timing**
  - [ ] Reduce button transitions 200ms → 150ms
  - [ ] Reduce title glow animation 2s → 1.2s
- [ ] **Chapter Active States**
  - [ ] Increase active marker glow/border
  - [ ] Add scale transform on active stage cards
- [ ] **Accessibility**
  - [ ] Add ARIA labels to avatar grid
  - [ ] Ensure cursor: pointer on all clickables
- [ ] **Tailwind Migration**
  - [ ] Migrate layout primitives (flex, grid, gap) to Tailwind utilities
  - [ ] Migrate spacing (padding, margin) to Tailwind
  - [ ] Migrate responsive breakpoints to Tailwind prefixes
  - [ ] Keep CRT effects in CSS modules

---

## COMPLETED

### CRITICAL
- [x] **Touch Targets < 44px**
  - [x] `timeline.module.css` - Control buttons padding 8px → 12px, add min-height: 44px
  - [x] `marquee.module.css` - Container height 24px → 44px, link padding
- [x] **Narration Text Truncation**
  - [x] `chapter0-scene.module.css` - Remove line-clamp on mobile
  - [x] `chapter1-scene.module.css` - Remove line-clamp on mobile
  - [x] `chapter2-scene.module.css` - Remove line-clamp on mobile
  - [x] `chapter3-scene.module.css` - Remove line-clamp on mobile
  - [x] `chapter4-scene.module.css` - Remove line-clamp on mobile
  - [x] `chapter5-scene.module.css` - Remove line-clamp on mobile
- [x] Add overflow-x: hidden to body (mobile horizontal scroll fix)

### HIGH-IMPACT
- [x] **Visual Hierarchy**
  - [x] `config-panel.module.css` - Persona icons amber → green (reserve amber for selection)
  - [x] `config-panel.module.css` - Add hover states (transform + glow)
- [x] **Color Contrast**
  - [x] `chapter3-scene.module.css` - Bump opacity 0.6 → 0.75
  - [x] `chapter4-scene.module.css` - Bump opacity 0.6 → 0.75
  - [x] `chapter5-scene.module.css` - Bump opacity 0.6 → 0.75
  - [x] `filter-gate.module.css` - Bump opacity 0.6 → 0.75
- [x] **Mobile Navigation**
  - [x] `timeline.module.css` - Chapter tabs scroll indicator earlier (900px)
  - [x] `config-panel.module.css` - Tablet 2-column persona grid (600-960px)
- [x] **Marquee Usability**
  - [x] `marquee.module.css` - Animation pause on hover (already existed)

---
STARTED: 2026-01-21
CRITICAL COMPLETE: 2026-01-21
HIGH-IMPACT COMPLETE: 2026-01-21
