# Visualize X Algorithm

An interactive, CRT-styled visualization of the X "For You" feed algorithm, authored by **Prabal** and **vibe-coded using Gemini, Claude, and Codex**. This project turns the real pipeline into a tactile, cinematic walkthrough so you can see how posts move from retrieval to ranking to final delivery.

> **Algorithm reference:** All algorithm details here are derived exclusively from the upstream reference in the [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm/blob/main/README.md). This README focuses on the visualization itself.

---

## Table of Contents

- [Overview](#overview)
- [What This App Shows](#what-this-app-shows)
- [Algorithm Reference](#algorithm-reference)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Credits](#credits)

---

## Overview

**Visualize X Algorithm** (titled **"The Anatomy of Virality"** in the UI) is a research-grade visualization that makes the X feed pipeline legible. It emphasizes clarity and feel: a BIOS-style intro, CRT panels, and animated instrumentation that lets you watch posts move through retrieval, scoring, filtering, and selection.

You can type your own text, pick a persona, and watch tokenization, embeddings, and scoring react in real time. The goal is not to recreate production systems, but to give you a faithful, inspectable model of the flow described by XAI.

---

## What This App Shows

- A BIOS-style boot sequence and guided simulation flow.
- Live tokenization, embedding, and attention visualizations as you type.
- In-network vs out-of-network candidate streams.
- Filter gates for eligibility, safety, and deduplication.
- Multi-action scoring, weighted aggregation, and diversity corrections.
- Top-K selection and final feed assembly.

---

## Algorithm Reference

This project visualizes the high-level flow described in the XAI reference. For full architecture and implementation details, read the upstream [xai-org/x-algorithm README](https://github.com/xai-org/x-algorithm/blob/main/README.md).

At a glance:

1. **Query hydration** (user history + features)
2. **Candidate sourcing** (Thunder for in-network, Phoenix retrieval for out-of-network)
3. **Candidate hydration** (post metadata, author info, media)
4. **Filtering** (eligibility, safety, dedupe)
5. **Scoring** (multi-action predictions, weighted scoring, author diversity)
6. **Selection + post-selection filtering**

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Animation:** GSAP
- **State:** Zustand
- **ML Runtime (in-browser):** `@xenova/transformers`
- **UI:** Tailwind CSS + custom CRT styling
- **Audio:** Tone.js
- **Testing:** Vitest + Testing Library

---

## Local Development

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run test
npm run lint
npm run preview
```

---

## Deployment

This project includes deployment-specific configuration in **`package.json`** and **`netlify.toml`**.

- **GitHub Pages:** `package.json` sets `homepage` and uses a `predeploy` script with `--base=/x-algorithm/` so assets resolve under the repo subpath. `npm run deploy` publishes via `gh-pages`.
- **Netlify:** `netlify.toml` builds with `npm run build -- --base=/`, publishes `dist`, pins `NODE_VERSION=20`, and adds a SPA redirect to `/index.html`.

If you change deployment targets or base paths, update both the `homepage` value and the `--base` flag so Vite emits correct asset URLs.

---

## Project Structure

```
src/
  components/          # UI components and visualization primitives
  data/                # Chapter data, constants, and configuration
  hooks/               # Timeline and animation hooks
  lib/                 # Utilities, ML helpers, and shared logic
  styles/              # Tailwind layers and CRT-specific styling
```

---

## Credits

- **Author:** Prabal
- **Vibe-coded using:** Gemini + Claude + Codex
- **Algorithm reference:** [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)

If you build on this, please preserve attribution and keep the algorithm reference intact.
