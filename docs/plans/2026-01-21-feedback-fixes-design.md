# Feedback Fixes Design

## Goals
Restore the intended single-frame arena hierarchy, remove unnecessary section framing in Chapter 0, correct the marquee behavior, stop function stack duplication, add a clear external source link, and remove the Mission Report panel entirely. These changes should reduce visual clutter while keeping the CRT aesthetic intact and preserving user flow through the simulation chapters.

## Approach Options
1) **Minimal structural change (recommended)**: Remove extra borders at the shell and arena wrapper layers, keep the chapter canvas as the primary frame, and simplify inner panels by removing ConfigPanel’s border/background. Replace marquee duplication with a single track using a simple looping animation. Remove the duplicate function stack row and keep a single scrollable list. Add a link icon + anchor to the function file name and remove Mission Report rendering at the app shell level.
2) **Aggressive layout refactor**: Rebuild Chapter 0 layout in Tailwind, collapsing CSS modules to consolidate structure and remove panel borders. Rebuild marquee and function stack as new components with entirely new CSS.
3) **Visual-only patch**: Keep structure intact but hide extra borders via CSS overrides and mask the duplicated marquee items with gradients.

The recommended path is option 1: it resolves each complaint with minimal disruption to core flow and keeps the CRT styling coherent. Option 2 is heavier and risks introducing regressions. Option 3 hides symptoms rather than removing redundant structure.

## Design Details
- **Arena framing**: Remove `border`/`rounded` styling from the app shell and the arena grid container, leaving a single primary frame around the chapter canvas. This restores the “one frame around the arena” look and avoids nested borders that read as extra boxes.
- **Chapter 0 panels**: Remove ConfigPanel border/background so the Persona/Audience/Tweet steps sit directly in the chapter container. Keep spacing and typography intact; the chapter wrapper already provides the CRT boundary.
- **Marquee**: Use a single track with a continuous loop animation. Avoid double-rendering the content; instead, animate one track and accept a brief gap or use a longer animation duration to minimize visible resets.
- **Function stack**: Render only one sequence of function names. Add a link icon next to the filename and anchor it to `https://github.com/xai-org/x-algorithm/blob/main/<path>`.
- **Mission Report**: Remove the side panel entirely; the end-game summary already covers the stats.

## Testing & Verification
- Update component tests to reflect single marquee track, single function stack track, presence of the source link, and absence of mission report rendering.
- Verify visually with Chrome MCP screenshots (top bar, function stack, Chapter 0 layout) after changes.
