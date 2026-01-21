# RPG Experience Layer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add RPG framing with mode-aware panels, timeline labels, Mission Report with Reach/Resonance/Momentum stats, badge tiers, and replay prompt.

**Architecture:** Extend the existing Zustand config store with RPG stats computed from simulation results. Create mode-aware FunctionPanel that shows summaries by default with "Learn more" expansion. Add MissionReport component displayed after simulation. Timeline shows mode-aware chapter labels.

**Tech Stack:** React 18, TypeScript, Zustand, CSS Modules, Vitest + React Testing Library.

**Notes:** Follow @superpowers:test-driven-development for all production code. Use ASCII only.

---

### Task 1: Add RPG stats computation utilities

**Files:**
- Create: `src/utils/rpgStats.ts`
- Test: `src/utils/rpgStats.test.ts`

**Step 1: Write the failing test**

```ts
// src/utils/rpgStats.test.ts
import { describe, expect, it } from 'vitest';
import { computeRPGStats, badgeForPercentile } from './rpgStats';

describe('rpgStats', () => {
  describe('computeRPGStats', () => {
    it('computes reach from impressions', () => {
      const result = computeRPGStats({
        counts: { impressions: 847, likes: 234, reposts: 52, replies: 18, bookmarks: 30, clicks: 100 },
        rates: { likeRate: 0.28, repostRate: 0.06, replyRate: 0.02, bookmarkRate: 0.04, clickRate: 0.12 }
      });
      expect(result.reach).toBe(847);
    });

    it('computes resonance as weighted engagement rate', () => {
      const result = computeRPGStats({
        counts: { impressions: 1000, likes: 100, reposts: 20, replies: 10, bookmarks: 15, clicks: 50 },
        rates: { likeRate: 0.1, repostRate: 0.02, replyRate: 0.01, bookmarkRate: 0.015, clickRate: 0.05 }
      });
      // resonance = (likeRate * 1.0) + (repostRate * 2.0) + (replyRate * 1.5) + (bookmarkRate * 1.2) + (clickRate * 0.5)
      // = 0.1 * 1.0 + 0.02 * 2.0 + 0.01 * 1.5 + 0.015 * 1.2 + 0.05 * 0.5
      // = 0.1 + 0.04 + 0.015 + 0.018 + 0.025 = 0.198
      expect(result.resonance).toBeCloseTo(0.198, 3);
    });

    it('computes momentum as total engagements / impressions * 100', () => {
      const result = computeRPGStats({
        counts: { impressions: 1000, likes: 100, reposts: 20, replies: 10, bookmarks: 15, clicks: 50 },
        rates: { likeRate: 0.1, repostRate: 0.02, replyRate: 0.01, bookmarkRate: 0.015, clickRate: 0.05 }
      });
      // momentum = (100 + 20 + 10 + 15 + 50) / 1000 * 100 = 19.5
      expect(result.momentum).toBeCloseTo(19.5, 1);
    });

    it('computes percentile from resonance score', () => {
      const result = computeRPGStats({
        counts: { impressions: 1000, likes: 310, reposts: 70, replies: 30, bookmarks: 50, clicks: 100 },
        rates: { likeRate: 0.31, repostRate: 0.07, replyRate: 0.03, bookmarkRate: 0.05, clickRate: 0.1 }
      });
      // High engagement = low percentile (better)
      expect(result.percentile).toBeLessThan(0.5);
    });
  });

  describe('badgeForPercentile', () => {
    it('assigns Signal Adept for top 10%', () => {
      expect(badgeForPercentile(0.05)).toBe('Signal Adept');
      expect(badgeForPercentile(0.1)).toBe('Signal Adept');
    });

    it('assigns Vector Guide for top 30%', () => {
      expect(badgeForPercentile(0.15)).toBe('Vector Guide');
      expect(badgeForPercentile(0.3)).toBe('Vector Guide');
    });

    it('assigns Signal Scout for top 60%', () => {
      expect(badgeForPercentile(0.35)).toBe('Signal Scout');
      expect(badgeForPercentile(0.6)).toBe('Signal Scout');
    });

    it('assigns Signal Initiate for bottom 40%', () => {
      expect(badgeForPercentile(0.65)).toBe('Signal Initiate');
      expect(badgeForPercentile(0.9)).toBe('Signal Initiate');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/rpgStats.test.ts`
Expected: FAIL with "Cannot find module './rpgStats'"

**Step 3: Write minimal implementation**

```ts
// src/utils/rpgStats.ts
import type { SimulationResult } from '../simulation/simulate';

export type RPGStats = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
};

const ENGAGEMENT_WEIGHTS = {
  like: 1.0,
  repost: 2.0,
  reply: 1.5,
  bookmark: 1.2,
  click: 0.5
};

export function computeRPGStats(result: SimulationResult): RPGStats {
  const { counts, rates } = result;

  const reach = counts.impressions;

  const resonance =
    rates.likeRate * ENGAGEMENT_WEIGHTS.like +
    rates.repostRate * ENGAGEMENT_WEIGHTS.repost +
    rates.replyRate * ENGAGEMENT_WEIGHTS.reply +
    rates.bookmarkRate * ENGAGEMENT_WEIGHTS.bookmark +
    rates.clickRate * ENGAGEMENT_WEIGHTS.click;

  const totalEngagements =
    counts.likes + counts.reposts + counts.replies + counts.bookmarks + counts.clicks;
  const momentum = (totalEngagements / counts.impressions) * 100;

  // Percentile based on resonance (lower = better)
  // Typical resonance ranges from 0.05 (poor) to 0.5 (excellent)
  const normalizedResonance = Math.min(1, resonance / 0.5);
  const percentile = Math.max(0.01, 1 - normalizedResonance);

  return { reach, resonance, momentum, percentile };
}

export function badgeForPercentile(percentile: number): string {
  if (percentile <= 0.1) return 'Signal Adept';
  if (percentile <= 0.3) return 'Vector Guide';
  if (percentile <= 0.6) return 'Signal Scout';
  return 'Signal Initiate';
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/rpgStats.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/rpgStats.ts src/utils/rpgStats.test.ts
git commit -m "feat: add RPG stats computation utilities"
```

---

### Task 2: Add RPG stats to config store

**Files:**
- Modify: `src/stores/config.ts`
- Modify: `src/stores/config.test.ts`

**Step 1: Write the failing test**

```ts
// Add to src/stores/config.test.ts
import { describe, expect, it, beforeEach } from 'vitest';
import { useConfigStore } from './config';

describe('config store', () => {
  beforeEach(() => {
    useConfigStore.setState({
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null
    });
  });

  it('toggles expert mode', () => {
    const { setExpertMode, expertMode } = useConfigStore.getState();
    expect(expertMode).toBe(false);
    setExpertMode(true);
    expect(useConfigStore.getState().expertMode).toBe(true);
  });

  it('computes rpgStats when simulation begins', () => {
    const store = useConfigStore.getState();
    store.beginSimulation();
    const { rpgStats } = useConfigStore.getState();
    expect(rpgStats).not.toBeNull();
    expect(rpgStats?.reach).toBeGreaterThan(0);
    expect(rpgStats?.resonance).toBeGreaterThan(0);
    expect(rpgStats?.momentum).toBeGreaterThan(0);
    expect(rpgStats?.percentile).toBeGreaterThan(0);
  });

  it('clears rpgStats on reset', () => {
    const store = useConfigStore.getState();
    store.beginSimulation();
    expect(useConfigStore.getState().rpgStats).not.toBeNull();
    store.resetSimulation();
    expect(useConfigStore.getState().rpgStats).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/stores/config.test.ts`
Expected: FAIL with "rpgStats" property errors

**Step 3: Modify config store to include rpgStats**

```ts
// src/stores/config.ts - Add imports and types
import { computeRPGStats, type RPGStats } from '../utils/rpgStats';

// Add to ConfigState type:
//   rpgStats: RPGStats | null;

// Modify beginSimulation:
//   beginSimulation: () =>
//     set((state) => {
//       const simulationResult = simulateEngagement({
//         personaId: state.personaId,
//         tweetText: state.tweetText,
//         audienceMix: state.audienceMix
//       });
//       return {
//         simulationStarted: true,
//         simulationResult,
//         rpgStats: computeRPGStats(simulationResult)
//       };
//     }),

// Modify resetSimulation:
//   resetSimulation: () =>
//     set({ simulationStarted: false, simulationResult: null, rpgStats: null })

// Add initial state:
//   rpgStats: null,
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/stores/config.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/stores/config.ts src/stores/config.test.ts
git commit -m "feat: add RPG stats to config store"
```

---

### Task 3: Create MissionReport component

**Files:**
- Create: `src/components/visualization/MissionReport.tsx`
- Create: `src/components/visualization/MissionReport.test.tsx`
- Create: `src/styles/mission-report.module.css`

**Step 1: Write the failing test**

```tsx
// src/components/visualization/MissionReport.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MissionReport from './MissionReport';

describe('MissionReport', () => {
  const defaultProps = {
    reach: 847,
    resonance: 0.198,
    momentum: 19.5,
    percentile: 0.15,
    onReplay: vi.fn()
  };

  it('renders Mission Report title', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('Mission Report')).toBeInTheDocument();
  });

  it('displays reach value', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('847')).toBeInTheDocument();
    expect(screen.getByText('Reach')).toBeInTheDocument();
  });

  it('displays resonance value formatted', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('0.20')).toBeInTheDocument();
    expect(screen.getByText('Resonance')).toBeInTheDocument();
  });

  it('displays momentum value formatted', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('19.5%')).toBeInTheDocument();
    expect(screen.getByText('Momentum')).toBeInTheDocument();
  });

  it('displays badge based on percentile', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('Vector Guide')).toBeInTheDocument();
  });

  it('calls onReplay when replay button clicked', async () => {
    const onReplay = vi.fn();
    render(<MissionReport {...defaultProps} onReplay={onReplay} />);
    await userEvent.click(screen.getByText('Run Another Simulation'));
    expect(onReplay).toHaveBeenCalledOnce();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/visualization/MissionReport.test.tsx`
Expected: FAIL with "Cannot find module './MissionReport'"

**Step 3: Write implementation**

```tsx
// src/components/visualization/MissionReport.tsx
import { badgeForPercentile } from '../../utils/rpgStats';
import styles from '../../styles/mission-report.module.css';

type MissionReportProps = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
  onReplay: () => void;
};

export default function MissionReport({
  reach,
  resonance,
  momentum,
  percentile,
  onReplay
}: MissionReportProps) {
  const badge = badgeForPercentile(percentile);

  return (
    <section className={styles.report} data-testid="mission-report">
      <h2 className={styles.title}>Mission Report</h2>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{reach}</span>
          <span className={styles.statLabel}>Reach</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{resonance.toFixed(2)}</span>
          <span className={styles.statLabel}>Resonance</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{momentum.toFixed(1)}%</span>
          <span className={styles.statLabel}>Momentum</span>
        </div>
      </div>

      <div className={styles.badge}>
        <span className={styles.badgeLabel}>Rank Achieved</span>
        <span className={styles.badgeName}>{badge}</span>
      </div>

      <button className={styles.replayButton} onClick={onReplay} type="button">
        Run Another Simulation
      </button>
    </section>
  );
}
```

```css
/* src/styles/mission-report.module.css */
.report {
  display: grid;
  gap: 24px;
  padding: 24px;
  border: 1px solid rgba(51, 255, 51, 0.35);
  background: rgba(10, 10, 10, 0.92);
  box-shadow: inset 0 0 40px rgba(51, 255, 51, 0.08), 0 0 30px rgba(51, 255, 51, 0.2);
  text-align: center;
}

.title {
  font-size: 20px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--phosphor-amber);
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.statsGrid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid rgba(51, 255, 51, 0.25);
  background: rgba(0, 20, 0, 0.4);
}

.statValue {
  font-size: 28px;
  color: var(--phosphor-green);
  text-shadow: 0 0 12px rgba(51, 255, 51, 0.6);
}

.statLabel {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(51, 255, 51, 0.7);
}

.badge {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 2px solid var(--phosphor-amber);
  background: rgba(255, 176, 0, 0.08);
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.2);
}

.badgeLabel {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--phosphor-amber);
}

.badgeName {
  font-size: 24px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--phosphor-amber);
  text-shadow: 0 0 14px rgba(255, 176, 0, 0.6);
}

.replayButton {
  border: 1px solid var(--phosphor-green);
  background: rgba(0, 20, 0, 0.55);
  color: var(--phosphor-green);
  padding: 12px 20px;
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 18px rgba(51, 255, 51, 0.25);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.replayButton:hover {
  box-shadow: 0 0 28px rgba(51, 255, 51, 0.5);
  transform: translateY(-1px);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/visualization/MissionReport.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/visualization/MissionReport.tsx src/components/visualization/MissionReport.test.tsx src/styles/mission-report.module.css
git commit -m "feat: add MissionReport component with badge tiers"
```

---

### Task 4: Create mode-aware FunctionPanel

**Files:**
- Modify: `src/components/layout/FunctionPanel.tsx`
- Create: `src/components/layout/FunctionPanel.test.tsx`
- Create: `src/styles/function-panel.module.css`

**Step 1: Write the failing test**

```tsx
// src/components/layout/FunctionPanel.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import FunctionPanel from './FunctionPanel';
import { useConfigStore } from '../../stores/config';

describe('FunctionPanel', () => {
  beforeEach(() => {
    useConfigStore.setState({ expertMode: false });
  });

  it('shows summary by default for non-expert mode', () => {
    render(<FunctionPanel />);
    expect(screen.getByText(/Preparing your simulation/)).toBeInTheDocument();
  });

  it('shows Learn more button in non-expert mode', () => {
    render(<FunctionPanel />);
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('expands details when Learn more clicked', async () => {
    render(<FunctionPanel />);
    await userEvent.click(screen.getByText('Learn more'));
    expect(screen.getByText(/simulateEngagement/)).toBeInTheDocument();
  });

  it('shows details by default in expert mode', () => {
    useConfigStore.setState({ expertMode: true });
    render(<FunctionPanel />);
    expect(screen.getByText(/simulateEngagement/)).toBeInTheDocument();
    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
  });

  it('displays GitHub link', () => {
    useConfigStore.setState({ expertMode: true });
    render(<FunctionPanel />);
    expect(screen.getByRole('link', { name: /View source/ })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com')
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/FunctionPanel.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```tsx
// src/components/layout/FunctionPanel.tsx
import { useState } from 'react';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/function-panel.module.css';

type FunctionInfo = {
  name: string;
  file: string;
  summary: string;
  githubUrl: string;
};

const CURRENT_FUNCTION: FunctionInfo = {
  name: 'simulateEngagement()',
  file: 'src/simulation/simulate.ts',
  summary: 'Preparing your simulation based on persona and audience mix',
  githubUrl: 'https://github.com/xai-org/x-algorithm/blob/main/home-mixer/simulation.rs'
};

export default function FunctionPanel() {
  const expertMode = useConfigStore((state) => state.expertMode);
  const [expanded, setExpanded] = useState(false);
  const showDetails = expertMode || expanded;

  return (
    <div className={styles.panel} data-testid="function-panel">
      <h3 className={styles.title}>Current Operation</h3>

      {!showDetails && (
        <>
          <p className={styles.summary}>{CURRENT_FUNCTION.summary}</p>
          <button
            className={styles.learnMore}
            onClick={() => setExpanded(true)}
            type="button"
          >
            Learn more
          </button>
        </>
      )}

      {showDetails && (
        <div className={styles.details}>
          <code className={styles.functionName}>{CURRENT_FUNCTION.name}</code>
          <span className={styles.filePath}>{CURRENT_FUNCTION.file}</span>
          <a
            className={styles.githubLink}
            href={CURRENT_FUNCTION.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View source on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
```

```css
/* src/styles/function-panel.module.css */
.panel {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(51, 255, 51, 0.3);
  background: rgba(10, 10, 10, 0.85);
}

.title {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--phosphor-amber);
}

.summary {
  font-size: 14px;
  line-height: 1.5;
  color: var(--phosphor-green);
  margin: 0;
}

.learnMore {
  justify-self: start;
  border: 1px solid rgba(51, 255, 51, 0.4);
  background: transparent;
  color: var(--phosphor-green);
  padding: 6px 12px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
}

.learnMore:hover {
  background: rgba(51, 255, 51, 0.1);
}

.details {
  display: grid;
  gap: 8px;
}

.functionName {
  font-size: 14px;
  color: var(--phosphor-cyan, #00ffff);
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
}

.filePath {
  font-size: 12px;
  color: rgba(51, 255, 51, 0.7);
}

.githubLink {
  font-size: 12px;
  color: var(--phosphor-amber);
  text-decoration: none;
}

.githubLink:hover {
  text-decoration: underline;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/FunctionPanel.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/layout/FunctionPanel.tsx src/components/layout/FunctionPanel.test.tsx src/styles/function-panel.module.css
git commit -m "feat: add mode-aware FunctionPanel with Learn more gate"
```

---

### Task 5: Create mode-aware Timeline with chapter labels

**Files:**
- Modify: `src/components/layout/Timeline.tsx`
- Create: `src/components/layout/Timeline.test.tsx`
- Create: `src/styles/timeline.module.css`
- Create: `src/data/chapters.ts`

**Step 1: Write the failing test**

```tsx
// src/components/layout/Timeline.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import Timeline from './Timeline';
import { useConfigStore } from '../../stores/config';

describe('Timeline', () => {
  beforeEach(() => {
    useConfigStore.setState({ expertMode: false });
  });

  it('renders chapter markers', () => {
    render(<Timeline />);
    expect(screen.getByText('CH.1')).toBeInTheDocument();
    expect(screen.getByText('CH.5')).toBeInTheDocument();
  });

  it('shows simplified labels in non-expert mode', () => {
    render(<Timeline />);
    expect(screen.getByText('Request')).toBeInTheDocument();
    expect(screen.getByText('Deliver')).toBeInTheDocument();
  });

  it('shows technical labels in expert mode', () => {
    useConfigStore.setState({ expertMode: true });
    render(<Timeline />);
    expect(screen.getByText('gRPC Request')).toBeInTheDocument();
    expect(screen.getByText('Top-K Selection')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: FAIL

**Step 3: Write implementation**

```ts
// src/data/chapters.ts
export type Chapter = {
  id: string;
  number: number;
  labelSimple: string;
  labelTechnical: string;
};

export const CHAPTERS: Chapter[] = [
  { id: 'ch1', number: 1, labelSimple: 'Request', labelTechnical: 'gRPC Request' },
  { id: 'ch2', number: 2, labelSimple: 'Gather', labelTechnical: 'Thunder/Phoenix' },
  { id: 'ch3', number: 3, labelSimple: 'Filter', labelTechnical: 'Filter Cascade' },
  { id: 'ch4', number: 4, labelSimple: 'Score', labelTechnical: 'Heavy Ranker' },
  { id: 'ch5', number: 5, labelSimple: 'Deliver', labelTechnical: 'Top-K Selection' }
];
```

```tsx
// src/components/layout/Timeline.tsx
import { CHAPTERS } from '../../data/chapters';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/timeline.module.css';

export default function Timeline() {
  const expertMode = useConfigStore((state) => state.expertMode);

  return (
    <div className={styles.timeline} data-testid="timeline">
      {CHAPTERS.map((chapter) => (
        <button key={chapter.id} className={styles.marker} type="button">
          <span className={styles.chapterNumber}>CH.{chapter.number}</span>
          <span className={styles.chapterLabel}>
            {expertMode ? chapter.labelTechnical : chapter.labelSimple}
          </span>
        </button>
      ))}
    </div>
  );
}
```

```css
/* src/styles/timeline.module.css */
.timeline {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  border-top: 1px solid rgba(51, 255, 51, 0.3);
  background: rgba(10, 10, 10, 0.9);
  overflow-x: auto;
}

.marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: 1px solid rgba(51, 255, 51, 0.25);
  background: rgba(0, 20, 0, 0.4);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.marker:hover {
  border-color: var(--phosphor-green);
  box-shadow: 0 0 12px rgba(51, 255, 51, 0.3);
}

.chapterNumber {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--phosphor-amber);
}

.chapterLabel {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--phosphor-green);
  white-space: nowrap;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/layout/Timeline.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/data/chapters.ts src/components/layout/Timeline.tsx src/components/layout/Timeline.test.tsx src/styles/timeline.module.css
git commit -m "feat: add mode-aware Timeline with chapter labels"
```

---

### Task 6: Integrate MissionReport into App

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Step 1: Write the failing test**

```tsx
// Add to src/App.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';
import { useConfigStore } from './stores/config';

describe('App', () => {
  beforeEach(() => {
    useConfigStore.setState({
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null
    });
  });

  it('renders the shell container', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });

  it('shows ConfigPanel when simulation not started', () => {
    render(<App />);
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });

  it('shows MissionReport after simulation', () => {
    useConfigStore.setState({
      simulationStarted: true,
      simulationResult: {
        counts: { impressions: 847, likes: 234, reposts: 52, replies: 18, bookmarks: 30, clicks: 100 },
        rates: { likeRate: 0.28, repostRate: 0.06, replyRate: 0.02, bookmarkRate: 0.04, clickRate: 0.12 }
      },
      rpgStats: { reach: 847, resonance: 0.198, momentum: 19.5, percentile: 0.15 }
    });
    render(<App />);
    expect(screen.getByTestId('mission-report')).toBeInTheDocument();
  });

  it('resets simulation when replay clicked', async () => {
    useConfigStore.setState({
      simulationStarted: true,
      simulationResult: {
        counts: { impressions: 847, likes: 234, reposts: 52, replies: 18, bookmarks: 30, clicks: 100 },
        rates: { likeRate: 0.28, repostRate: 0.06, replyRate: 0.02, bookmarkRate: 0.04, clickRate: 0.12 }
      },
      rpgStats: { reach: 847, resonance: 0.198, momentum: 19.5, percentile: 0.15 }
    });
    render(<App />);
    await userEvent.click(screen.getByText('Run Another Simulation'));
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL

**Step 3: Modify App.tsx to show MissionReport conditionally**

```tsx
// src/App.tsx
import { useState } from 'react';
import CRTControls from './components/effects/CRTControls';
import { DEFAULT_CRT_CONFIG } from './components/effects/crtConfig';
import type { CRTConfig } from './components/effects/crtConfig';
import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import ConfigPanel from './components/layout/ConfigPanel';
import FunctionPanel from './components/layout/FunctionPanel';
import Marquee from './components/layout/Marquee';
import Timeline from './components/layout/Timeline';
import MissionReport from './components/visualization/MissionReport';
import { useConfigStore } from './stores/config';

function App() {
  const [crtConfig, setCrtConfig] = useState<CRTConfig>(DEFAULT_CRT_CONFIG);
  const simulationStarted = useConfigStore((state) => state.simulationStarted);
  const rpgStats = useConfigStore((state) => state.rpgStats);
  const resetSimulation = useConfigStore((state) => state.resetSimulation);

  return (
    <CRTOverlay config={crtConfig}>
      <div data-testid="app-shell">
        <ScreenFlicker />
        <Marquee />
        <main>
          <section>CANVAS PLACEHOLDER</section>
          <section>
            <FunctionPanel />
            {simulationStarted && rpgStats ? (
              <MissionReport
                reach={rpgStats.reach}
                resonance={rpgStats.resonance}
                momentum={rpgStats.momentum}
                percentile={rpgStats.percentile}
                onReplay={resetSimulation}
              />
            ) : (
              <ConfigPanel />
            )}
            <CRTControls config={crtConfig} onChange={setCrtConfig} />
          </section>
        </main>
        <Timeline />
      </div>
    </CRTOverlay>
  );
}

export default App;
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: integrate MissionReport with replay prompt"
```

---

### Task 7: Update TODO.md and run full test suite

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Run full test suite**

Run: `npm test -- --run`
Expected: All tests PASS

**Step 2: Take screenshot to verify UI**

Run: `npx playwright screenshot http://localhost:5173 /tmp/rpg-layer-complete.png`
Expected: Screenshot shows the app with proper layout

**Step 3: Update TODO.md**

Move Phase 2.5 items to Completed section:
- [x] Update UI copy to RPG framing (Mission Loadout, Mission Report).
- [x] Implement mode-aware FunctionPanel (summary + Learn more gate).
- [x] Add mode-aware labels for timeline and chapters.
- [x] Compute Reach, Resonance, Momentum from real pipeline outputs.
- [x] Add badge tier calculation and Mission Report display.
- [x] Add replay prompt after Mission Report.

**Step 4: Commit**

```bash
git add .codex/TODO.md
git commit -m "chore: mark Phase 2.5 RPG Experience Layer complete"
```

---

Plan complete and saved to `docs/plans/2026-01-21-rpg-experience-layer-implementation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
