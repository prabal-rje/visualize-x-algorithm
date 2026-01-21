# RPG Experience and Complexity Modes Design

**Goal:** Add an RPG framing layer and persona-driven complexity modes (with Expert Mode override) without changing the truthfulness of the MiniLM-based computations.

## Non-Negotiables
- All numbers displayed are computed using the MiniLM pipeline.
- The RPG layer never alters the core math; it only changes presentation and narrative.
- CRT aesthetic remains consistent across all modes.

## MLE Assumptions
- Client-side MiniLM inference with caching is viable for the experience.
- Persona and audience selection shape candidate generation and scoring, but not core formulas.
- Performance adapts by reducing visual complexity, not by faking numbers.

## Persona Complexity Mapping (Explicit)
**Technical (default technical mode):**
- tech-founder
- software-engineer
- ai-researcher
- cs-student
- indie-hacker
- data-scientist
- cybersecurity-pro

**Non-Technical (default non-technical mode):**
- venture-capitalist
- tech-reporter
- product-manager
- tech-executive
- content-creator
- designer
- consultant
- marketer
- educator

## Expert Mode Toggle
- User-facing toggle in the config panel: "Expert Mode".
- Overrides persona defaults and forces technical presentation.
- Persisted locally (config store + local storage) to respect user preference.

## RPG Loop
1. **Mission Loadout:** Select persona (class), audience mix (faction alignment), and tweet (ability).
2. **Simulation Run:** Five chapters execute in order with visible progress.
3. **Mission Report:** Show Reach, Resonance, Momentum, and a rank badge.
4. **Replay Prompt:** Encourage a new persona or tweet to compare outcomes.

## Presentation Modes
**Technical Mode:**
- Function panels expanded by default with function names, file paths, code snippets, and GitHub links.
- Numeric readouts and equations visible in each chapter.
- Timeline labels include pipeline names (Thunder/Phoenix, filters, scorers).

**Non-Technical Mode:**
- Function panels collapsed by default into plain-language summaries and visual meters.
- "Learn more" gate expands panels to show code and links.
- Larger labels, fewer numeric annotations, more iconography.
- Simplified timeline labels (Collect, Clean, Score, Deliver).

## Data Flow and RPG Stats
Input -> embedding -> classification -> filtering -> engagement prediction -> weighted score -> top-K delivery.
- **Reach:** top-K delivery count.
- **Resonance:** mean similarity to target audience.
- **Momentum:** weighted engagement score.

## Component Impacts
- **ConfigPanel:** add Expert Mode toggle and complexity label.
- **FunctionPanel:** support collapsed summaries + "Learn more" gate.
- **Chapters:** switch labels and annotation density by mode.
- **Timeline:** mode-aware labels and tooltips.
- **Mission Report:** new summary panel after Chapter 5.

## Error Handling
- Model load failures show BIOS-style error with retry.
- If cached embeddings exist, allow resume with a "CACHE HIT" indicator.
- Never show computed values if the model has not run.

## Performance and Accessibility
- Reduce visual effects under low FPS; do not alter calculations.
- Mobile defaults to simplified visuals and no audio.
- Respect reduced motion and high contrast modes.

## Testing Focus
- Unit tests for pipeline math (similarity, scoring, filters).
- Integration tests for mode toggles and panel behavior.
- Checklist coverage: timeline scrub, accessibility modes, link correctness.

