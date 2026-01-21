# X Algorithm Visualizer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the full CRT RPG experience with persona-driven complexity and real MiniLM computations, satisfying every checklist item in the brief/spec/appendix.

**Architecture:** A React + TypeScript single-page app with a CRT visual layer, a deterministic ML pipeline using MiniLM embeddings, and an RPG presentation layer that adapts verbosity by persona or Expert Mode. State lives in Zustand stores, timelines in GSAP, visuals in PixiJS and CSS modules.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind, CSS Modules, Zustand, Framer Motion, GSAP, PixiJS, Tone.js, @xenova/transformers, Vitest + React Testing Library.

**Notes:** Follow @superpowers:test-driven-development for all production code. Use ASCII only. Worktree requirement waived by user; operate in repo root.

---

### Task 1: Scaffold Vite + React + TypeScript in repo root

**Files:**
- Create: `package.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `vite.config.ts`, `tsconfig.json`

**Step 1: Generate the app scaffold**
Run: `npm create vite@latest . -- --template react-ts`
Expected: Vite scaffold created in repo root.

**Step 2: Install dependencies**
Run: `npm install zustand framer-motion gsap pixi.js tone @xenova/transformers`
Expected: `node_modules/` created, install completes without errors.

**Step 3: Smoke build**
Run: `npm run build`
Expected: build completes without errors.

**Step 4: Commit**
```bash
git add package.json src vite.config.ts tsconfig.json

git commit -m "chore: scaffold vite react ts app"
```

---

### Task 2: Add Tailwind + global CRT variables

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`
- Test: `src/index.test.ts`

**Step 1: Install Tailwind tooling**
Run: `npm install -D tailwindcss postcss autoprefixer`
Expected: dev dependencies installed.

**Step 2: Write failing test**
```typescript
// src/index.test.ts
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const css = fs.readFileSync('src/index.css', 'utf8');

describe('global css', () => {
  it('defines crt color variables', () => {
    expect(css).toContain('--phosphor-green');
    expect(css).toContain('--crt-black');
  });
});
```

**Step 3: Run test to verify it fails**
Run: `npx vitest run src/index.test.ts`
Expected: FAIL because variables are missing.

**Step 4: Implement Tailwind config and CSS variables**
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --phosphor-green: #33ff33;
  --phosphor-amber: #ffb000;
  --phosphor-cyan: #00ffff;
  --phosphor-magenta: #ff00ff;
  --phosphor-white: #ffffff;
  --crt-black: #0a0a0a;
  --crt-dark: #121212;
  --crt-glow: rgba(51, 255, 51, 0.1);
  --color-thunder: #00aaff;
  --color-phoenix: #ff6600;
  --color-rejected: #ff3333;
  --color-accepted: #33ff33;
  --color-scoring: #ffff00;
  --prob-like: #ff69b4;
  --prob-repost: #00ff7f;
  --prob-reply: #1e90ff;
  --prob-click: #ffd700;
}

body {
  background: var(--crt-black);
  color: var(--phosphor-green);
  font-family: 'IBM Plex Mono', monospace;
}
```

**Step 5: Run test to verify it passes**
Run: `npx vitest run src/index.test.ts`
Expected: PASS.

**Step 6: Commit**
```bash
git add tailwind.config.js postcss.config.js src/index.css src/index.test.ts

git commit -m "feat: add tailwind and crt variables"
```

---

### Task 3: Add Vitest + React Testing Library

**Files:**
- Modify: `package.json`, `vite.config.ts`
- Create: `src/setupTests.ts`, `src/App.test.tsx`

**Step 1: Install testing dependencies**
Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
Expected: dev dependencies installed.

**Step 2: Write failing test**
```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the shell container', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });
});
```

**Step 3: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/App.test.tsx`
Expected: FAIL because testing setup is missing.

**Step 4: Implement test setup**
```ts
// src/setupTests.ts
import '@testing-library/jest-dom';
```

```ts
// vite.config.ts (append)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  }
});
```

```json
// package.json (scripts)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

**Step 5: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/App.test.tsx`
Expected: PASS.

**Step 6: Commit**
```bash
git add package.json vite.config.ts src/setupTests.ts src/App.test.tsx

git commit -m "test: add vitest and rtl"
```

---

### Task 4: CRT effects components

**Files:**
- Create: `src/components/effects/CRTOverlay.tsx`, `src/components/effects/PhosphorText.tsx`, `src/components/effects/ScreenFlicker.tsx`
- Create: `src/styles/crt.module.css`
- Test: `src/components/effects/CRTOverlay.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/effects/CRTOverlay.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CRTOverlay from './CRTOverlay';

describe('CRTOverlay', () => {
  it('renders scanline layer', () => {
    render(<CRTOverlay />);
    expect(screen.getByTestId('crt-overlay')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/effects/CRTOverlay.test.tsx`
Expected: FAIL because component does not exist.

**Step 3: Implement components**
```tsx
// src/components/effects/CRTOverlay.tsx
import styles from '../../styles/crt.module.css';

export default function CRTOverlay() {
  return <div className={styles.crtOverlay} data-testid="crt-overlay" />;
}
```

```tsx
// src/components/effects/PhosphorText.tsx
import { PropsWithChildren } from 'react';
import styles from '../../styles/crt.module.css';

export default function PhosphorText({ children }: PropsWithChildren) {
  return <span className={styles.phosphorText}>{children}</span>;
}
```

```tsx
// src/components/effects/ScreenFlicker.tsx
import { useEffect } from 'react';

export default function ScreenFlicker() {
  useEffect(() => {
    let mounted = true;
    const flicker = () => {
      if (!mounted) return;
      const brightness = 0.95 + Math.random() * 0.1;
      document.body.style.filter = `brightness(${brightness})`;
      setTimeout(flicker, 50 + Math.random() * 150);
    };
    flicker();
    return () => {
      mounted = false;
      document.body.style.filter = '';
    };
  }, []);
  return null;
}
```

```css
/* src/styles/crt.module.css */
.crtOverlay::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 9999;
}

.crtOverlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.phosphorText {
  text-shadow: 0 0 6px var(--phosphor-green);
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/effects/CRTOverlay.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/effects src/styles/crt.module.css

git commit -m "feat: add crt overlay and phosphor effects"
```

---

### Task 5: Base layout shell

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/layout/Marquee.tsx`, `src/components/layout/Timeline.tsx`, `src/components/layout/FunctionPanel.tsx`, `src/components/layout/ConfigPanel.tsx`
- Test: `src/components/layout/LayoutShell.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/layout/LayoutShell.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../App';

describe('Layout shell', () => {
  it('renders marquee and panels', () => {
    render(<App />);
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/layout/LayoutShell.test.tsx`
Expected: FAIL.

**Step 3: Implement layout shell**
```tsx
// src/App.tsx
import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import Marquee from './components/layout/Marquee';
import Timeline from './components/layout/Timeline';
import FunctionPanel from './components/layout/FunctionPanel';
import ConfigPanel from './components/layout/ConfigPanel';

export default function App() {
  return (
    <div data-testid="app-shell">
      <ScreenFlicker />
      <CRTOverlay />
      <Marquee />
      <main>
        <section>CANVAS PLACEHOLDER</section>
        <section>
          <FunctionPanel />
          <ConfigPanel />
        </section>
      </main>
      <Timeline />
    </div>
  );
}
```

```tsx
// src/components/layout/Marquee.tsx
export default function Marquee() {
  return <div data-testid="marquee">MARQUEE</div>;
}
```

```tsx
// src/components/layout/Timeline.tsx
export default function Timeline() {
  return <div data-testid="timeline">TIMELINE</div>;
}
```

```tsx
// src/components/layout/FunctionPanel.tsx
export default function FunctionPanel() {
  return <div data-testid="function-panel">FUNCTION PANEL</div>;
}
```

```tsx
// src/components/layout/ConfigPanel.tsx
export default function ConfigPanel() {
  return <div data-testid="config-panel">CONFIG PANEL</div>;
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/layout/LayoutShell.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/App.tsx src/components/layout src/components/layout/LayoutShell.test.tsx

git commit -m "feat: add base layout shell"
```

---

### Task 6: Data fixtures from appendix

**Files:**
- Create: `src/data/personas.ts`, `src/data/audiences.ts`, `src/data/tweets.ts`, `src/data/attribution.ts`
- Test: `src/data/data.test.ts`

**Step 1: Write failing test**
```ts
// src/data/data.test.ts
import { describe, expect, it } from 'vitest';
import { PERSONAS } from './personas';
import { AUDIENCES } from './audiences';

describe('data fixtures', () => {
  it('includes 16 personas', () => {
    expect(PERSONAS).toHaveLength(16);
  });

  it('includes 8 audiences', () => {
    expect(AUDIENCES).toHaveLength(8);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/data/data.test.ts`
Expected: FAIL.

**Step 3: Implement data files**
```ts
// src/data/personas.ts
export const PERSONAS = [
  { id: 'tech-founder', name: 'Tech Founder', icon: 'rocket', technical: true },
  { id: 'software-engineer', name: 'Software Engineer', icon: 'laptop', technical: true },
  { id: 'ai-researcher', name: 'AI/ML Researcher', icon: 'brain', technical: true },
  { id: 'venture-capitalist', name: 'VC / Investor', icon: 'cash', technical: false },
  { id: 'cs-student', name: 'CS Student', icon: 'cap', technical: true },
  { id: 'tech-reporter', name: 'Tech Reporter', icon: 'news', technical: false },
  { id: 'product-manager', name: 'Product Manager', icon: 'chart', technical: false },
  { id: 'tech-executive', name: 'Tech Executive', icon: 'tie', technical: false },
  { id: 'content-creator', name: 'Content Creator', icon: 'film', technical: false },
  { id: 'indie-hacker', name: 'Indie Hacker', icon: 'tools', technical: true },
  { id: 'designer', name: 'Designer', icon: 'palette', technical: false },
  { id: 'data-scientist', name: 'Data Scientist', icon: 'chart-up', technical: true },
  { id: 'cybersecurity-pro', name: 'Security Pro', icon: 'lock', technical: true },
  { id: 'consultant', name: 'Consultant', icon: 'briefcase', technical: false },
  { id: 'marketer', name: 'Marketer', icon: 'megaphone', technical: false },
  { id: 'educator', name: 'Educator', icon: 'book', technical: false }
];
```

```ts
// src/data/audiences.ts
export const AUDIENCES = [
  { id: 'tech', label: 'Tech Enthusiasts' },
  { id: 'casual', label: 'Casual Users' },
  { id: 'news', label: 'News Followers' },
  { id: 'creators', label: 'Creators' },
  { id: 'investors', label: 'Investors' },
  { id: 'founders', label: 'Founders' },
  { id: 'students', label: 'Students' },
  { id: 'bots', label: 'Bots/Inactive' }
];
```

```ts
// src/data/tweets.ts
export const SAMPLE_TWEETS = [
  { id: 'sample-1', text: 'Sample tweet placeholder', persona: ['any'] }
];
```

```ts
// src/data/attribution.ts
export const ATTRIBUTION = {
  github: 'https://github.com/prabal_/x-algorithm-visualizer',
  twitter: 'https://twitter.com/prabal_',
  sourceRepo: 'https://github.com/xai-org/x-algorithm'
};
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/data/data.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/data

git commit -m "feat: add persona and audience data"
```

---

### Task 7: Config store with Expert Mode

**Files:**
- Create: `src/stores/config.ts`
- Test: `src/stores/config.test.ts`

**Step 1: Write failing test**
```ts
// src/stores/config.test.ts
import { describe, expect, it } from 'vitest';
import { useConfigStore } from './config';

describe('config store', () => {
  it('toggles expert mode', () => {
    const { setExpertMode, expertMode } = useConfigStore.getState();
    expect(expertMode).toBe(false);
    setExpertMode(true);
    expect(useConfigStore.getState().expertMode).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/stores/config.test.ts`
Expected: FAIL.

**Step 3: Implement config store**
```ts
// src/stores/config.ts
import { create } from 'zustand';

type ConfigState = {
  expertMode: boolean;
  setExpertMode: (value: boolean) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  expertMode: false,
  setExpertMode: (value) => set({ expertMode: value })
}));
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/stores/config.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/stores/config.ts src/stores/config.test.ts

git commit -m "feat: add config store with expert mode"
```

---

### Task 8: ConfigPanel UI with persona selection and Expert Mode toggle

**Files:**
- Modify: `src/components/layout/ConfigPanel.tsx`
- Test: `src/components/layout/ConfigPanel.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/layout/ConfigPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConfigPanel from './ConfigPanel';

describe('ConfigPanel', () => {
  it('renders expert mode toggle', () => {
    render(<ConfigPanel />);
    expect(screen.getByLabelText('Expert Mode')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/layout/ConfigPanel.test.tsx`
Expected: FAIL.

**Step 3: Implement ConfigPanel**
```tsx
// src/components/layout/ConfigPanel.tsx
import { useConfigStore } from '../../stores/config';
import { PERSONAS } from '../../data/personas';

export default function ConfigPanel() {
  const expertMode = useConfigStore((state) => state.expertMode);
  const setExpertMode = useConfigStore((state) => state.setExpertMode);

  return (
    <div data-testid="config-panel">
      <h2>Mission Loadout</h2>
      <label>
        <input
          type="checkbox"
          checked={expertMode}
          onChange={(event) => setExpertMode(event.target.checked)}
        />
        Expert Mode
      </label>
      <div>
        {PERSONAS.map((persona) => (
          <button key={persona.id} type="button">
            {persona.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/layout/ConfigPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/layout/ConfigPanel.tsx src/components/layout/ConfigPanel.test.tsx

git commit -m "feat: add config panel expert mode toggle"
```

---

### Task 9: FunctionPanel mode behavior (summary + Learn more)

**Files:**
- Modify: `src/components/layout/FunctionPanel.tsx`
- Test: `src/components/layout/FunctionPanel.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/layout/FunctionPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FunctionPanel from './FunctionPanel';

describe('FunctionPanel', () => {
  it('shows learn more gate by default', () => {
    render(<FunctionPanel />);
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/layout/FunctionPanel.test.tsx`
Expected: FAIL.

**Step 3: Implement FunctionPanel**
```tsx
// src/components/layout/FunctionPanel.tsx
import { useState } from 'react';
import { useConfigStore } from '../../stores/config';

export default function FunctionPanel() {
  const expertMode = useConfigStore((state) => state.expertMode);
  const [expanded, setExpanded] = useState(false);
  const showDetails = expertMode || expanded;

  return (
    <div data-testid="function-panel">
      <h3>Filtering</h3>
      {!showDetails && (
        <button type="button" onClick={() => setExpanded(true)}>
          Learn more
        </button>
      )}
      {showDetails && <pre>fn MutedKeywordFilter::filter()</pre>}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/layout/FunctionPanel.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/layout/FunctionPanel.tsx src/components/layout/FunctionPanel.test.tsx

git commit -m "feat: add function panel learn more gate"
```

---

### Task 10: MiniLM embedding pipeline scaffolding

**Files:**
- Create: `src/ml/embeddings.ts`
- Test: `src/ml/embeddings.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/embeddings.test.ts
import { describe, expect, it } from 'vitest';
import { getEmbedding, _clearCache } from './embeddings';

describe('embeddings cache', () => {
  it('caches embeddings by text', async () => {
    _clearCache();
    const first = await getEmbedding('hello');
    const second = await getEmbedding('hello');
    expect(second).toEqual(first);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/embeddings.test.ts`
Expected: FAIL.

**Step 3: Implement cache-first embedding helper**
```ts
// src/ml/embeddings.ts
const embeddingCache = new Map<string, number[]>();

export async function getEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  const fake = Array.from({ length: 8 }, (_, i) => i / 10);
  embeddingCache.set(text, fake);
  return fake;
}

export function _clearCache() {
  embeddingCache.clear();
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/embeddings.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/embeddings.ts src/ml/embeddings.test.ts

git commit -m "feat: add embedding cache helper"
```

---

### Task 11: Timeline scaffolding and chapter registry

**Files:**
- Create: `src/chapters/index.ts`, `src/hooks/useTimeline.ts`
- Modify: `src/components/layout/Timeline.tsx`
- Test: `src/hooks/useTimeline.test.ts`

**Step 1: Write failing test**
```ts
// src/hooks/useTimeline.test.ts
import { describe, expect, it } from 'vitest';
import { createTimelineState } from './useTimeline';

describe('timeline', () => {
  it('initializes at time 0', () => {
    const state = createTimelineState();
    expect(state.currentTime).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/hooks/useTimeline.test.ts`
Expected: FAIL.

**Step 3: Implement timeline helper**
```ts
// src/hooks/useTimeline.ts
export type TimelineState = {
  currentTime: number;
};

export function createTimelineState(): TimelineState {
  return { currentTime: 0 };
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/hooks/useTimeline.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useTimeline.ts src/hooks/useTimeline.test.ts src/components/layout/Timeline.tsx

git commit -m "feat: add timeline state scaffolding"
```

---

### Task 12: Mission Report stats and badge computation

**Files:**
- Create: `src/utils/score.ts`, `src/components/visualization/MissionReport.tsx`
- Test: `src/utils/score.test.ts`

**Step 1: Write failing test**
```ts
// src/utils/score.test.ts
import { describe, expect, it } from 'vitest';
import { badgeForPercentile } from './score';

describe('badge tiers', () => {
  it('assigns top tier at 10% or better', () => {
    expect(badgeForPercentile(0.1)).toBe('Signal Adept');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/utils/score.test.ts`
Expected: FAIL.

**Step 3: Implement badge helper and Mission Report**
```ts
// src/utils/score.ts
export function badgeForPercentile(value: number): string {
  if (value <= 0.1) return 'Signal Adept';
  if (value <= 0.3) return 'Vector Guide';
  if (value <= 0.6) return 'Signal Scout';
  return 'Signal Initiate';
}
```

```tsx
// src/components/visualization/MissionReport.tsx
import { badgeForPercentile } from '../../utils/score';

type MissionReportProps = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
};

export default function MissionReport({ reach, resonance, momentum, percentile }: MissionReportProps) {
  const badge = badgeForPercentile(percentile);
  return (
    <section>
      <h2>Mission Report</h2>
      <div>Reach: {reach}</div>
      <div>Resonance: {resonance.toFixed(2)}</div>
      <div>Momentum: {momentum.toFixed(2)}</div>
      <div>Badge: {badge}</div>
    </section>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/utils/score.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/utils/score.ts src/utils/score.test.ts src/components/visualization/MissionReport.tsx

git commit -m "feat: add mission report badge tiers"
```

---

### Task 13: QA checklist consolidation

**Files:**
- Create: `docs/QA-CHECKLIST.md`

**Step 1: Add QA checklist document**
```md
# QA Checklist

- [ ] All chapter animations play correctly in sequence
- [ ] Timeline scrubbing works without breaking animations
- [ ] Embedding computations complete without errors
- [ ] Audio plays on user interaction
- [ ] CRT effects don't cause performance issues
- [ ] Mobile layout is usable
- [ ] GitHub links point to correct files/lines
- [ ] Simulated engagement numbers are proportional to calculated probabilities
- [ ] High contrast mode works for accessibility
- [ ] Reduced motion mode disables animations
```

**Step 2: Commit**
```bash
git add docs/QA-CHECKLIST.md

git commit -m "docs: add qa checklist"
```

---

### Task 14: Real MiniLM loader and BIOS loading UI

**Files:**
- Modify: `src/ml/embeddings.ts`
- Create: `src/components/visualization/ModelLoading.tsx`
- Test: `src/ml/embeddings.integration.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/embeddings.integration.test.ts
import { describe, expect, it } from 'vitest';
import { getEmbedding, setEmbedderForTests, _clearCache } from './embeddings';

describe('embeddings loader', () => {
  it('uses injected embedder in tests', async () => {
    _clearCache();
    setEmbedderForTests(async () => ({ data: [0.1, 0.2] }));
    const result = await getEmbedding('test');
    expect(result).toEqual([0.1, 0.2]);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/embeddings.integration.test.ts`
Expected: FAIL.

**Step 3: Implement loader + BIOS component**
```ts
// src/ml/embeddings.ts
import { pipeline } from '@xenova/transformers';

type Embedder = (text: string, options?: { pooling: string; normalize: boolean }) => Promise<{ data: number[] }>;

let embedder: Embedder | null = null;
let isLoading = false;
let injectedEmbedder: Embedder | null = null;
const embeddingCache = new Map<string, number[]>();

export async function initializeEmbedder() {
  if (embedder || isLoading || injectedEmbedder) return;
  isLoading = true;
  embedder = (await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')) as Embedder;
  isLoading = false;
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  if (injectedEmbedder) {
    const result = await injectedEmbedder(text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(result.data);
    embeddingCache.set(text, embedding);
    return embedding;
  }
  await initializeEmbedder();
  const result = await embedder!(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(result.data);
  embeddingCache.set(text, embedding);
  return embedding;
}

export function setEmbedderForTests(value: Embedder) {
  injectedEmbedder = value;
}

export function _clearCache() {
  embeddingCache.clear();
}
```

```tsx
// src/components/visualization/ModelLoading.tsx
type ModelLoadingProps = {
  progress: number;
};

export default function ModelLoading({ progress }: ModelLoadingProps) {
  return (
    <section>
      <h2>MODEL LOADING</h2>
      <div>Loading semantic processor... {Math.round(progress * 100)}%</div>
    </section>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/embeddings.integration.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/embeddings.ts src/ml/embeddings.integration.test.ts src/components/visualization/ModelLoading.tsx

git commit -m "feat: add real embedder loader and bios ui"
```

---

### Task 15: Similarity + classification helpers

**Files:**
- Create: `src/ml/similarity.ts`
- Test: `src/ml/similarity.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/similarity.test.ts
import { describe, expect, it } from 'vitest';
import { dot, cosine } from './similarity';

describe('similarity helpers', () => {
  it('computes dot product', () => {
    expect(dot([1, 2], [3, 4])).toBe(11);
  });

  it('computes cosine similarity', () => {
    expect(cosine([1, 0], [1, 0])).toBe(1);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/similarity.test.ts`
Expected: FAIL.

**Step 3: Implement helpers**
```ts
// src/ml/similarity.ts
export function dot(a: number[], b: number[]) {
  return a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
}

export function magnitude(a: number[]) {
  return Math.sqrt(dot(a, a));
}

export function cosine(a: number[], b: number[]) {
  const denom = magnitude(a) * magnitude(b);
  if (!denom) return 0;
  return dot(a, b) / denom;
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/similarity.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/similarity.ts src/ml/similarity.test.ts

git commit -m "feat: add similarity helpers"
```

---

### Task 16: Engagement prediction + weighted score

**Files:**
- Create: `src/ml/engagement.ts`, `src/data/weights.ts`
- Test: `src/ml/engagement.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/engagement.test.ts
import { describe, expect, it } from 'vitest';
import { calculateWeightedScore } from './engagement';

describe('engagement', () => {
  it('calculates weighted score', () => {
    const score = calculateWeightedScore({ like: 0.5, repost: 0.2 });
    expect(score).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/engagement.test.ts`
Expected: FAIL.

**Step 3: Implement weights and score calculation**
```ts
// src/data/weights.ts
export const ACTION_WEIGHTS = {
  like: 1.0,
  repost: 0.5,
  reply: 0.3,
  click: 0.1
};
```

```ts
// src/ml/engagement.ts
import { ACTION_WEIGHTS } from '../data/weights';

type EngagementProbs = {
  like: number;
  repost: number;
  reply?: number;
  click?: number;
};

export function calculateWeightedScore(probs: EngagementProbs) {
  return (
    probs.like * ACTION_WEIGHTS.like +
    probs.repost * ACTION_WEIGHTS.repost +
    (probs.reply ?? 0) * ACTION_WEIGHTS.reply +
    (probs.click ?? 0) * ACTION_WEIGHTS.click
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/engagement.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/engagement.ts src/ml/engagement.test.ts src/data/weights.ts

git commit -m "feat: add engagement scoring helpers"
```

---

### Task 17: Muted keyword filter

**Files:**
- Create: `src/ml/filters.ts`
- Test: `src/ml/filters.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/filters.test.ts
import { describe, expect, it } from 'vitest';
import { applyMutedKeywordFilter } from './filters';

describe('filters', () => {
  it('filters muted keyword matches', async () => {
    const result = await applyMutedKeywordFilter(['hello world'], ['hello']);
    expect(result).toEqual([]);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/filters.test.ts`
Expected: FAIL.

**Step 3: Implement filter helper**
```ts
// src/ml/filters.ts
export async function applyMutedKeywordFilter(texts: string[], muted: string[]) {
  return texts.filter((text) => !muted.some((word) => text.toLowerCase().includes(word.toLowerCase())));
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/filters.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/filters.ts src/ml/filters.test.ts

git commit -m "feat: add muted keyword filter"
```

---

### Task 18: Simulated tweet pool generation

**Files:**
- Create: `src/ml/simulated.ts`
- Test: `src/ml/simulated.test.ts`

**Step 1: Write failing test**
```ts
// src/ml/simulated.test.ts
import { describe, expect, it } from 'vitest';
import { generateSimulatedTweets } from './simulated';

describe('simulated tweets', () => {
  it('generates the requested count', () => {
    const tweets = generateSimulatedTweets(5);
    expect(tweets).toHaveLength(5);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/ml/simulated.test.ts`
Expected: FAIL.

**Step 3: Implement generator**
```ts
// src/ml/simulated.ts
export function generateSimulatedTweets(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `sim-${index}`,
    text: `Simulated tweet ${index}`
  }));
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/ml/simulated.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/ml/simulated.ts src/ml/simulated.test.ts

git commit -m "feat: add simulated tweet generator"
```

---

### Task 19: GSAP timeline + markers

**Files:**
- Modify: `src/hooks/useTimeline.ts`, `src/components/layout/Timeline.tsx`
- Create: `src/data/chapters.ts`
- Test: `src/components/layout/Timeline.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/layout/Timeline.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Timeline from './Timeline';

describe('Timeline', () => {
  it('renders chapter markers', () => {
    render(<Timeline />);
    expect(screen.getByText('CH.1')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/layout/Timeline.test.tsx`
Expected: FAIL.

**Step 3: Implement chapter data + timeline UI**
```ts
// src/data/chapters.ts
export const CHAPTERS = [
  { id: 'ch1', label: 'CH.1', name: 'REQUEST' },
  { id: 'ch2', label: 'CH.2', name: 'GATHER' },
  { id: 'ch3', label: 'CH.3', name: 'FILTER' },
  { id: 'ch4', label: 'CH.4', name: 'SCORE' },
  { id: 'ch5', label: 'CH.5', name: 'DELIVER' }
];
```

```tsx
// src/components/layout/Timeline.tsx
import { CHAPTERS } from '../../data/chapters';

export default function Timeline() {
  return (
    <div data-testid="timeline">
      {CHAPTERS.map((chapter) => (
        <button key={chapter.id} type="button">
          {chapter.label}
        </button>
      ))}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/layout/Timeline.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/data/chapters.ts src/components/layout/Timeline.tsx src/components/layout/Timeline.test.tsx

git commit -m "feat: add timeline markers"
```

---

### Task 20: Chapter registry + wrapper

**Files:**
- Modify: `src/chapters/index.ts`
- Create: `src/components/chapters/ChapterWrapper.tsx`
- Test: `src/components/chapters/ChapterWrapper.test.tsx`

**Step 1: Write failing test**
```tsx
// src/components/chapters/ChapterWrapper.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChapterWrapper from './ChapterWrapper';

describe('ChapterWrapper', () => {
  it('renders chapter title', () => {
    render(<ChapterWrapper title="THE REQUEST" />);
    expect(screen.getByText('THE REQUEST')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/components/chapters/ChapterWrapper.test.tsx`
Expected: FAIL.

**Step 3: Implement wrapper**
```tsx
// src/components/chapters/ChapterWrapper.tsx
import { PropsWithChildren } from 'react';

type ChapterWrapperProps = PropsWithChildren<{
  title: string;
}>;

export default function ChapterWrapper({ title, children }: ChapterWrapperProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/components/chapters/ChapterWrapper.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/components/chapters/ChapterWrapper.tsx src/components/chapters/ChapterWrapper.test.tsx

git commit -m "feat: add chapter wrapper"
```

---

### Task 21: Chapter 1 - Request

**Files:**
- Create: `src/chapters/Chapter1_Request.tsx`
- Test: `src/chapters/Chapter1_Request.test.tsx`

**Step 1: Write failing test**
```tsx
// src/chapters/Chapter1_Request.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter1Request from './Chapter1_Request';

describe('Chapter 1', () => {
  it('shows user id', () => {
    render(<Chapter1Request userId="8392847293" />);
    expect(screen.getByText(/USER_ID/)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/chapters/Chapter1_Request.test.tsx`
Expected: FAIL.

**Step 3: Implement component**
```tsx
// src/chapters/Chapter1_Request.tsx
import ChapterWrapper from '../components/chapters/ChapterWrapper';

type Chapter1Props = {
  userId: string;
};

export default function Chapter1Request({ userId }: Chapter1Props) {
  return (
    <ChapterWrapper title="THE REQUEST">
      <div>USER_ID: {userId}</div>
      <div>gRPC REQUEST -> HOME-MIXER</div>
    </ChapterWrapper>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/chapters/Chapter1_Request.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/chapters/Chapter1_Request.tsx src/chapters/Chapter1_Request.test.tsx

git commit -m "feat: add chapter 1 request shell"
```

---

### Task 22: Chapter 2 - Gathering

**Files:**
- Create: `src/chapters/Chapter2_Gathering.tsx`, `src/components/visualization/EmbeddingGrid.tsx`
- Test: `src/chapters/Chapter2_Gathering.test.tsx`

**Step 1: Write failing test**
```tsx
// src/chapters/Chapter2_Gathering.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter2Gathering from './Chapter2_Gathering';

describe('Chapter 2', () => {
  it('renders thunder and phoenix labels', () => {
    render(<Chapter2Gathering />);
    expect(screen.getByText('THUNDER')).toBeInTheDocument();
    expect(screen.getByText('PHOENIX')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/chapters/Chapter2_Gathering.test.tsx`
Expected: FAIL.

**Step 3: Implement component**
```tsx
// src/components/visualization/EmbeddingGrid.tsx
type EmbeddingGridProps = {
  values: number[];
};

export default function EmbeddingGrid({ values }: EmbeddingGridProps) {
  return <div>Embedding cells: {values.length}</div>;
}
```

```tsx
// src/chapters/Chapter2_Gathering.tsx
import ChapterWrapper from '../components/chapters/ChapterWrapper';
import EmbeddingGrid from '../components/visualization/EmbeddingGrid';

export default function Chapter2Gathering() {
  return (
    <ChapterWrapper title="THE GATHERING">
      <div>THUNDER</div>
      <div>PHOENIX</div>
      <EmbeddingGrid values={new Array(384).fill(0)} />
    </ChapterWrapper>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/chapters/Chapter2_Gathering.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/chapters/Chapter2_Gathering.tsx src/chapters/Chapter2_Gathering.test.tsx src/components/visualization/EmbeddingGrid.tsx

git commit -m "feat: add chapter 2 gathering shell"
```

---

### Task 23: Chapter 3 - Filtering

**Files:**
- Create: `src/chapters/Chapter3_Filtering.tsx`, `src/components/visualization/FilterGate.tsx`
- Test: `src/chapters/Chapter3_Filtering.test.tsx`

**Step 1: Write failing test**
```tsx
// src/chapters/Chapter3_Filtering.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter3Filtering from './Chapter3_Filtering';

describe('Chapter 3', () => {
  it('renders filter gate', () => {
    render(<Chapter3Filtering />);
    expect(screen.getByText('FILTER GATE')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/chapters/Chapter3_Filtering.test.tsx`
Expected: FAIL.

**Step 3: Implement component**
```tsx
// src/components/visualization/FilterGate.tsx
export default function FilterGate() {
  return <div>FILTER GATE</div>;
}
```

```tsx
// src/chapters/Chapter3_Filtering.tsx
import ChapterWrapper from '../components/chapters/ChapterWrapper';
import FilterGate from '../components/visualization/FilterGate';

export default function Chapter3Filtering() {
  return (
    <ChapterWrapper title="THE FILTERING">
      <FilterGate />
    </ChapterWrapper>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/chapters/Chapter3_Filtering.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/chapters/Chapter3_Filtering.tsx src/chapters/Chapter3_Filtering.test.tsx src/components/visualization/FilterGate.tsx

git commit -m "feat: add chapter 3 filtering shell"
```

---

### Task 24: Chapter 4 - Scoring

**Files:**
- Create: `src/chapters/Chapter4_Scoring.tsx`, `src/components/visualization/ScoreReveal.tsx`
- Test: `src/chapters/Chapter4_Scoring.test.tsx`

**Step 1: Write failing test**
```tsx
// src/chapters/Chapter4_Scoring.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter4Scoring from './Chapter4_Scoring';

describe('Chapter 4', () => {
  it('renders score reveal', () => {
    render(<Chapter4Scoring />);
    expect(screen.getByText('SCORE REVEAL')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/chapters/Chapter4_Scoring.test.tsx`
Expected: FAIL.

**Step 3: Implement component**
```tsx
// src/components/visualization/ScoreReveal.tsx
export default function ScoreReveal() {
  return <div>SCORE REVEAL</div>;
}
```

```tsx
// src/chapters/Chapter4_Scoring.tsx
import ChapterWrapper from '../components/chapters/ChapterWrapper';
import ScoreReveal from '../components/visualization/ScoreReveal';

export default function Chapter4Scoring() {
  return (
    <ChapterWrapper title="THE SCORING">
      <ScoreReveal />
    </ChapterWrapper>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/chapters/Chapter4_Scoring.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/chapters/Chapter4_Scoring.tsx src/chapters/Chapter4_Scoring.test.tsx src/components/visualization/ScoreReveal.tsx

git commit -m "feat: add chapter 4 scoring shell"
```

---

### Task 25: Chapter 5 - Delivery + Mission Report

**Files:**
- Create: `src/chapters/Chapter5_Delivery.tsx`, `src/components/visualization/EngagementCascade.tsx`
- Modify: `src/components/visualization/MissionReport.tsx`
- Test: `src/chapters/Chapter5_Delivery.test.tsx`

**Step 1: Write failing test**
```tsx
// src/chapters/Chapter5_Delivery.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter5Delivery from './Chapter5_Delivery';

describe('Chapter 5', () => {
  it('renders mission report', () => {
    render(<Chapter5Delivery />);
    expect(screen.getByText('Mission Report')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/chapters/Chapter5_Delivery.test.tsx`
Expected: FAIL.

**Step 3: Implement component**
```tsx
// src/components/visualization/EngagementCascade.tsx
export default function EngagementCascade() {
  return <div>ENGAGEMENT CASCADE</div>;
}
```

```tsx
// src/chapters/Chapter5_Delivery.tsx
import ChapterWrapper from '../components/chapters/ChapterWrapper';
import EngagementCascade from '../components/visualization/EngagementCascade';
import MissionReport from '../components/visualization/MissionReport';

export default function Chapter5Delivery() {
  return (
    <ChapterWrapper title="THE DELIVERY">
      <EngagementCascade />
      <MissionReport reach={100} resonance={0.5} momentum={1.2} percentile={0.25} />
    </ChapterWrapper>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/chapters/Chapter5_Delivery.test.tsx`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/chapters/Chapter5_Delivery.tsx src/chapters/Chapter5_Delivery.test.tsx src/components/visualization/EngagementCascade.tsx

git commit -m "feat: add chapter 5 delivery shell"
```

---

### Task 26: Audio system + mute toggle

**Files:**
- Create: `src/audio/engine.ts`, `src/audio/sounds.ts`, `src/audio/sequences.ts`
- Modify: `src/stores/config.ts`
- Test: `src/audio/engine.test.ts`

**Step 1: Write failing test**
```ts
// src/audio/engine.test.ts
import { describe, expect, it } from 'vitest';
import { isAudioEnabled, setAudioEnabled } from './engine';

describe('audio engine', () => {
  it('toggles audio enabled', () => {
    setAudioEnabled(false);
    expect(isAudioEnabled()).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/audio/engine.test.ts`
Expected: FAIL.

**Step 3: Implement engine**
```ts
// src/audio/engine.ts
let audioEnabled = true;

export function setAudioEnabled(value: boolean) {
  audioEnabled = value;
}

export function isAudioEnabled() {
  return audioEnabled;
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/audio/engine.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/audio src/audio/engine.test.ts

git commit -m "feat: add audio engine toggle"
```

---

### Task 27: Mobile + accessibility modes

**Files:**
- Modify: `src/index.css`
- Create: `src/hooks/useResponsive.ts`
- Test: `src/hooks/useResponsive.test.ts`

**Step 1: Write failing test**
```ts
// src/hooks/useResponsive.test.ts
import { describe, expect, it } from 'vitest';
import { getResponsiveConfig } from './useResponsive';

describe('responsive config', () => {
  it('reduces particle count on mobile', () => {
    const config = getResponsiveConfig(true);
    expect(config.particleCount).toBeLessThan(1000);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- --runTestsByPath src/hooks/useResponsive.test.ts`
Expected: FAIL.

**Step 3: Implement responsive helper and CSS**
```ts
// src/hooks/useResponsive.ts
export function getResponsiveConfig(isMobile: boolean) {
  return {
    particleCount: isMobile ? 500 : 2000,
    crtEffects: isMobile ? ['scanlines'] : ['scanlines', 'flicker', 'chromatic']
  };
}
```

```css
/* src/index.css additions */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

body.high-contrast {
  --phosphor-green: #ffffff;
  --phosphor-amber: #ffff00;
  --crt-black: #000000;
}
```

**Step 4: Run test to verify it passes**
Run: `npm test -- --runTestsByPath src/hooks/useResponsive.test.ts`
Expected: PASS.

**Step 5: Commit**
```bash
git add src/hooks/useResponsive.ts src/hooks/useResponsive.test.ts src/index.css

git commit -m "feat: add responsive and accessibility modes"
```

---

### Task 28: Final QA and checklist sign-off

**Files:**
- Modify: `docs/QA-CHECKLIST.md`

**Step 1: Run test suite**
Run: `npm test`
Expected: PASS.

**Step 2: Manual verification**
Run: `npm run dev`
Expected: Pass all QA checklist items.

**Step 3: Mark QA checklist**
Update `docs/QA-CHECKLIST.md` to check off all items.

**Step 4: Commit**
```bash
git add docs/QA-CHECKLIST.md

git commit -m "docs: complete qa checklist"
```
