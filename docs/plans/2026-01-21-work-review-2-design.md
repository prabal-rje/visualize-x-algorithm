# Work Review 2 Design Notes

**Goal:** Address UX feedback for desktop/tablet/mobile by reducing redundancy, improving progressive animations, making the user's tweet the protagonist, and fixing mobile layout failures.

## Constraints + Assumptions
- No clarifying questions; proceed with reasonable defaults based on review feedback.
- No worktrees; operate in project root.
- Chrome MCP used for screenshots at multiple viewports/zoom levels.
- Keep existing chapter data/flow unless consolidation is required by review.

## Experience Principles
- Emphasize RPG framing: the user's tweet is the protagonist at every stage.
- Reduce cognitive overload: consolidate redundant pages and use progressive reveal.
- Make mobile usable: single-column persona grid, full-width CTAs, visible chapter navigation.

## Structural Changes
- **Chapter 0:** Remove Expert Mode checkbox and redundant Mission Loadout heading in sub-steps. Replace audience sliders with multi-select cards; defaults derived from persona. Add a defaults toast when advancing without explicit choices.
- **Chapter 1:** Keep function references in the top bar only. Add an emoji flow into ENGAGEMENT_HISTORY and a compact avatar/badge visualization for USER_PROFILE. Merge redundant request steps and show a function stack in header.
- **Chapter 2:** Make token list scrollable. Animate sequence: tokenize -> per-token embedding -> pooling -> final 128-D vector. Fix function bar to match encoding step. Improve vector space: similarity-based dot size/brightness, user hover shows tweet text, tooltip opaque with blur; animate tweet placement.
- **Chapter 3:** Consolidate filters into fewer steps with a function stack; animate tweets being removed.
- **Chapter 4:** Animate attention weight bars, merge similar pages, and show progressive score calculation.
- **Chapter 5:** Show actual tweet previews in Top-K with the user highlighted; use avatar library for engagement cascade; stagger stat reveal.

## Responsiveness
- Mobile: single-column personas, full-width CTAs, tap targets >= 44px, chapter nav scroll/menu with indicators, ellipsis on overflow text, hide CRT CTRL and sidebar.
- Tablet: restore full-text navigation buttons, increase persona padding; keep CRT CTRL compact.

## Performance
- Move embedding computation into a Web Worker and use Matryoshka N=30 for similarity; keep 128-D for final display.

## Testing + Verification
- TDD for each UI behavior change.
- Targeted tests per component; update snapshots/aria/labels as needed.
- Chrome MCP screenshots at desktop/tablet/mobile with zoom 90/110 and any critical interaction states.
