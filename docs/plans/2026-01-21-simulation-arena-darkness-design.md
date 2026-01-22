# Simulation Arena Darkness and Responsiveness Design

**Goal**: Restore the darker CRT arena background from the pre-Tailwind UI and ensure the layout remains readable across extreme viewport sizes (short, narrow, wide, and mobile orientations) using Tailwind-first primitives.

**Approach**: Introduce a new CRT "void" surface token that acts as the base canvas behind the simulation arena, and a deeper panel token for chapter wrappers. Apply these tokens directly in Tailwind class lists on the app shell, main arena container, and chapter wrapper to enforce a consistent dark foundation. Layer subtle gradients and a low-contrast grid pattern to match the legacy CRT aesthetic while keeping contrast readable. Avoid global overrides so the rest of the system remains stable; only the arena surfaces get the deeper background.

**Components**: Update `App` to set a darker arena shell surface and ensure the chapter canvas uses the new void surface. Update `ChapterWrapper` to align with the old chapter background and border intensity. Adjust `Marquee` and `Timeline` backgrounds where needed to preserve the dark banding across the top controls. Extend Tailwind config with new colors and background images rather than adding bespoke CSS modules.

**Responsiveness**: Use CSS variables to scale `--shell-gutter`, `--shell-gap`, and panel padding based on width and height. Add a height-based adjustment (short viewports) to compress vertical spacing without compromising legibility. Keep the layout single-column at `lg` and below, and ensure scroll remains contained within the chapter canvas for short screens.

**Testing & Verification**: Add a targeted test in `App.test.tsx` to assert the arena uses the new dark surface class. Update any relevant snapshot or class expectations. Capture Chrome MCP screenshots at desktop, tablet, mobile portrait, mobile landscape, and short-height desktop sizes to verify parity with `.trash` reference screenshots.
