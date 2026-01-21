# Work Review 1 Fixes Design

**Goal:** Address design review gaps in layout, navigation, branding, and affordances while preserving the CRT aesthetic and existing chapter visuals.

## Scope
- Branding polish: title + favicon.
- Arena layout: fill width/height, remove hidden scroll, tighten vertical rhythm.
- Navigation: mobile chapter access, control sizing, progress context.
- Function panel: clickable file path + GitHub icon link.
- Loadout polish: persona icons, consistent card heights, multi-column grid.
- CRT controls: relocate handle to reduce intrusion.
- Accessibility polish: CRT-green focus ring.
- Chapter 2: add minimal legend/labels for clarity.
- Verification: Playwright screenshots across viewports and zoom levels, plus tests.

## Non-Goals
- Rewriting chapter 3-5 visuals (already implemented).
- Changing the simulation logic or ML pipeline.
- Replacing the CRT overlay system.

## Layout Strategy
- Expand `appShell` width and reduce gaps to create a single, contiguous control surface.
- Make `chapterCanvas` flex-fill the remaining viewport height while allowing visible scroll when content exceeds available space.
- Remove center-only alignment in Chapter 0 to let the loadout panel span the arena width.

## Navigation Strategy
- Add a progress label and chapter tick markers to the progress bar.
- On mobile, convert navigation buttons to icon-first with 44px touch targets.
- Ensure chapter tabs scroll horizontally with a visible affordance.

## Loadout Enhancements
- Add a lightweight persona icon set (simple inline SVGs) and align icon + text layout.
- Enforce consistent card heights with subtitle clamping.
- Increase columns via wider container and smaller min column width.

## CRT Controls Placement
- Move the handle toward the upper control band (aligned with the timeline) so it reads as part of the control surface.

## Testing & Verification
- Update existing tests for FunctionPanel, Timeline, ConfigPanel if DOM changes.
- Capture Playwright screenshots at desktop, tablet, and mobile sizes, plus at least two zoom levels.

