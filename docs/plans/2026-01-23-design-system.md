# CRT Design System

## Overview

A higher-level design system to eliminate inconsistency across the UI. Provides reusable CSS primitives for typography, buttons, cards, and common UI patterns.

**Goals:**
- 95% coverage of UI needs with primitives
- Consistent color hierarchy (Amber = primary, Green = secondary, Cyan = data)
- Increased text sizes for readability (+2px base increase)
- Single source of truth in `system.css`

---

## Color Hierarchy

| Role | Color | Use Case |
|------|-------|----------|
| **Primary/Action** | Amber (`crt-amber`) | Primary buttons, selected states, CTAs, titles, important numbers |
| **Secondary/Content** | Green (`crt-ink`) | Body text, secondary buttons, unselected items, descriptions |
| **Data/Technical** | Cyan (`crt-cyan`) | Function names, code, data values, metrics |
| **Warning** | Red (`red-500`) | Alerts, important callouts |

---

## Typography Scale

### Headings

| Class | Mobile | Desktop (sm+) | Font | Tracking | Color | Use Case |
|-------|--------|---------------|------|----------|-------|----------|
| `crt-h1` | 24px | 32px | display | 0.1em | Amber + glow | Page titles |
| `crt-h2` | 18px | 22px | display | 0.12em | Green + glow | Chapter titles |
| `crt-h3` | 15px | 17px | mono | 0.08em | Green | Section headers |
| `crt-h4` | 13px | 15px | mono | 0.04em | Green | Card titles, sub-sections |

### Body Text

| Class | Mobile | Desktop (sm+) | Use Case |
|-------|--------|---------------|----------|
| `crt-body` | 14px | 16px | Primary content, descriptions |
| `crt-caption` | 12px | 13px | Labels, metadata, helper text |
| `crt-micro` | 11px | 11px | Extreme space constraints only |

### Rules
- `font-display` (Press Start 2P): H1, H2 only, always uppercase
- `font-mono` (VT323): Everything else
- All headings uppercase by default

---

## Components

### Buttons

| Class | Border | Text | Background | Hover | Use Case |
|-------|--------|------|------------|-------|----------|
| `crt-button-primary` | Amber | Amber | Panel/70% | Amber glow, slight scale | BEGIN, START, CONTINUE |
| `crt-button-secondary` | Green/30% | Green | Panel/50% | Green border, glow | SHUFFLE, BACK |
| `crt-button-ghost` | None | Green/70% | Transparent | Green/100% | Icon buttons, nav |

All buttons: uppercase, 0.1em tracking, min-height 44px, 12px padding.

### Cards (Selectable)

| State | Border | Background | Use Case |
|-------|--------|------------|----------|
| `crt-card` | Green/30% | Panel/40% | Default state |
| `crt-card:hover` | Green/60% | Panel/50% | Hover |
| `crt-card[data-selected="true"]` | Amber | Panel/60% + amber tint | Selected |

Used for: Persona cards, Audience cards.

### Dividers

| Class | Style |
|-------|-------|
| `crt-divider` | 1px solid green/20%, full width |
| `crt-divider-glow` | 1px + gradient fade at edges |

### Badges

| Class | Border | Text | Use Case |
|-------|--------|------|----------|
| `crt-badge` | Green/40% | Green | Step indicators "0A: Persona" |
| `crt-badge-amber` | Amber/60% | Amber | Active badges |

### Avatars (Initials)

| Class | Style | Use Case |
|-------|-------|----------|
| `crt-avatar` | Green border, mono text, 40x40 | "TF", "SE" initials |
| `crt-avatar[data-selected="true"]` | Amber border | Selected persona |

### Links

| State | Style |
|-------|-------|
| `crt-link` | Amber/70%, no underline |
| `crt-link:hover` | Amber/100% + glow |

### Metrics

| Class | Style | Use Case |
|-------|-------|----------|
| `crt-metric` | Large cyan number + caption below | Scores, percentages |
| `crt-metric-inline` | Inline format "99/280" | Character counts |

### Callouts

| Class | Style | Use Case |
|-------|-------|----------|
| `crt-callout` | Green border, green bg tint | Info notes |
| `crt-callout-warn` | Red border, pulsing | Warnings |

### Code

| Class | Style | Use Case |
|-------|-------|----------|
| `crt-code` | Cyan mono inline | `functionName()` |
| `crt-code-block` | Panel + cyan, padded | Code snippets |

### Progress

| Class | Style |
|-------|-------|
| `crt-progress` | Green fill, dark track |
| `crt-progress[data-complete="true"]` | Amber fill |

### Inputs

| State | Border | Background |
|-------|--------|------------|
| `crt-input` | Green/40% | Black/80% |
| `crt-input:focus` | Green + glow | Black/80% |

### Panels (existing, unchanged)

- `crt-panel` - standard container
- `crt-panel-strong` - emphasized sections
- `crt-panel-soft` - subtle backgrounds

---

## Migration Strategy

1. Add all primitives to `system.css`
2. Update components file-by-file, replacing raw Tailwind with design system classes
3. Priority order:
   - Typography (biggest visual impact)
   - Buttons (most inconsistent currently)
   - Cards (Persona, Audience)
   - Everything else

## Files to Update

High-impact files (update first):
- `src/styles/system.css` - add all primitives
- `src/components/visualization/BIOSIntro.tsx`
- `src/components/visualization/BIOSLoading.tsx`
- `src/components/chapters/Chapter0Scene.tsx` (config panel)
- `src/components/layout/Timeline.tsx`

Medium-impact:
- `src/components/chapters/Chapter1Scene.tsx` through `Chapter5Scene.tsx`
- `src/components/layout/MobileHeader.tsx`
- `src/components/layout/Marquee.tsx`

## Components to Leave Alone

Per requirements, these "special" components keep custom styling:
- Sub-chapter visualizations (tokenization flow, vector space, etc.)
- Navigation button icons (play/pause/skip)
- Progress bar internals
- CRT overlay effects

---

## Summary

**22 primitives** covering:
- Typography: 7 (h1-h4, body, caption, micro)
- Buttons: 3 (primary, secondary, ghost)
- Cards: 1 (with states)
- Dividers: 2
- Badges: 2
- Avatars: 1
- Links: 1
- Metrics: 2
- Callouts: 2
- Code: 2
- Progress: 1
- Inputs: 1
- Panels: 3 (existing)
