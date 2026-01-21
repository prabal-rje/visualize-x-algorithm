# Simulation MLE Design

## Goals, constraints, and framing (Section 1)

We need a first-pass simulation layer that turns persona + audience mix + tweet text
into deterministic engagement counts and MLE rates. This is a scaffold for the later
ML pipeline; it should be small, transparent, and testable. The output should be
stable across runs (no randomness) so UI and tests have predictable numbers, but
still reflect the user's inputs in a believable way (longer tweets slightly increase
interest, bots reduce impressions, technical personas lean toward technical audiences).
We are not modeling the full pipeline or using embeddings yet, so the simulation
must be explicitly heuristic and must avoid claiming realism. The goal is to create
types and data flow that can be swapped later when the actual model work arrives.

Constraints: keep this in plain TypeScript, pure functions, and no side effects.
We should encode basic guardrails (clamps for percentages, non-negative counts,
impressions never below a minimum). The simulation should live under `src/simulation/`
to avoid tangling with UI. Config store should own the result state and compute it
when the user hits "BEGIN SIMULATION." All computations need unit tests, and the
MLE helper must be used to derive rates from counts. We will keep everything ASCII
and consistent with the existing functional style. No UI changes beyond hooking the
result into the store are required yet.

## Approach options and chosen direction (Section 2)

Approach A (chosen): deterministic heuristic function. Compute impressions from
tweet length and the active audience share (bots reduce reach). Apply a persona
affinity multiplier based on whether the persona is technical and how much of the
audience mix is technical vs non-technical. Derive engagement counts by multiplying
impressions by base rates, then use Bernoulli MLE (successes / trials) to produce
rates. Pros: stable tests, clean math, quick to iterate, deterministic demos. Cons:
the model is simplistic and not data-driven.

Approach B: seeded pseudo-random Monte Carlo. Sample engagement actions across
simulated users using a seeded PRNG so numbers differ slightly per run. Pros: more
organic feel. Cons: harder testing, harder to reason about, and introduces the
illusion of stochastic truth too early.

Approach C: table-driven mapping (persona x audience buckets x expected engagement).
Pros: explicit control, easy to tune. Cons: more data maintenance, less responsive
to tweet text length without additional mapping logic.

We choose Approach A. It gives a clean deterministic placeholder with a path to
future replacement by real model outputs. The function will return both counts and
rates, and config store will cache the result so downstream components can consume
it later without recomputation.
