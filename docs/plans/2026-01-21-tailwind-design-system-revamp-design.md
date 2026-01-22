# Tailwind Design System Revamp Design

## Context
The UI already communicates a CRT terminal aesthetic with bespoke CSS modules. The request is to create a Tailwind-heavy design system focused on sizing, layout, grids, responsiveness, colors, containers, and alignments, then refactor the codebase to use it and simplify styling.

## Goals
- Codify CRT visual tokens (colors, glow, borders) into Tailwind theme tokens.
- Standardize spacing, layout grids, and container sizing with reusable utilities.
- Replace key layout CSS modules with Tailwind classes and component utilities.
- Keep the CRT aesthetic intact while reducing duplicated CSS values.
- Preserve DOM structure and behavior to minimize regressions.

## Constraints
- React + TS functional components, existing tests, and CRT effects must remain stable.
- CSS modules remain for complex visualizations; focus on layout and shell components first.
- No worktrees; operate in project root only.

## Approaches Considered
1. **Full Tailwind rewrite**: Convert every CSS module to Tailwind. This maximizes uniformity but is risky and time-heavy given the visualization density.
2. **Hybrid system (recommended)**: Build a Tailwind design system for layout + surfaces, refactor the global shell, and keep complex scene CSS modules for now. This yields major simplification without destabilizing specialized visuals.
3. **Token-only**: Add Tailwind tokens but keep CSS modules largely unchanged. Low risk, but fails the "tailwind heavy" requirement.

## Chosen Approach
Adopt the hybrid system. Build a Tailwind design system with CRT tokens, spacing, grids, and container utilities; refactor layout-oriented components (App shell, Timeline, Marquee, BIOSLoading, MissionReport, ChapterWrapper) to Tailwind classes; remove their CSS modules. Leave the visualization-specific CSS modules as-is, but align them to new tokens via shared CSS variables.

## Design System Structure
- **Theme tokens**: CRT colors mapped to `rgb(var(--token) / <alpha>)` values; custom shadows; font families; spacing variables for gutters and panel padding.
- **Layout utilities**: `max-w-shell`, `px-gutter`, `gap-shell`, grid templates, and a set of CRT surface helpers.
- **Component helpers**: `crt-panel`, `crt-panel-strong`, `crt-button`, `crt-label`, `crt-title` via `@layer components` and `@apply` for shared styling.
- **Responsive**: Create standardized breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) tuned to the existing UI's 400–900px patterns.

## Refactor Scope
- **App shell**: Replace app-shell CSS module with Tailwind layout classes.
- **Timeline**: Convert layout + chrome to Tailwind utilities and custom keyframes for marquee/stack scroll.
- **Marquee**: Tailwind classes + keyframes in config.
- **BIOSLoading / MissionReport / ChapterWrapper**: Tailwind classes and tokenized colors.

## Risks and Mitigations
- **Visual drift**: Use Chrome MCP screenshots to compare before/after at multiple viewports.
- **Keyframe loss**: Move keyframes into Tailwind config and reference via `animate-*` classes.
- **Class verbosity**: Use `@layer components` for repeated CRT panel/button styles.

## Success Criteria
- Major layout components use Tailwind classes and system helpers.
- Duplicate CRT color/spacing values reduced via shared tokens.
- No test regressions; UI remains consistent across desktop/tablet/mobile.
