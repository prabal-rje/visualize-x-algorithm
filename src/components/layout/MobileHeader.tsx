import { useCallback } from 'react';
import { ExternalLink, Github, Twitter, Linkedin, Home } from 'lucide-react';
import { CHAPTERS, getFunctionAtPosition } from '../../data/chapters';
import { ATTRIBUTION } from '../../data/attribution';
import { useConfigStore } from '../../stores/config';
import type { SimulationPosition, SimulationAction, SimulationStatus } from '../../hooks/useSimulationState';

type MobileHeaderProps = {
  position: SimulationPosition;
  status: SimulationStatus;
  dispatch: React.Dispatch<SimulationAction>;
};

function isAtStart(position: SimulationPosition): boolean {
  return (
    position.chapterIndex === 0 &&
    position.subChapterIndex === 0 &&
    position.functionIndex === 0
  );
}

function isAtEnd(position: SimulationPosition): boolean {
  const lastChapterIndex = CHAPTERS.length - 1;
  const lastChapter = CHAPTERS[lastChapterIndex];
  const lastSubChapterIndex = lastChapter.subChapters.length - 1;
  const lastSubChapter = lastChapter.subChapters[lastSubChapterIndex];
  const lastFunctionIndex = lastSubChapter.functions.length - 1;

  return (
    position.chapterIndex === lastChapterIndex &&
    position.subChapterIndex === lastSubChapterIndex &&
    position.functionIndex === lastFunctionIndex
  );
}

function getTotalSteps(): number {
  let total = 0;
  for (const chapter of CHAPTERS) {
    for (const subChapter of chapter.subChapters) {
      total += subChapter.functions.length;
    }
  }
  return total;
}

function calculateProgress(position: SimulationPosition): number {
  let currentStep = 0;
  const totalSteps = getTotalSteps();

  for (let ci = 0; ci < CHAPTERS.length; ci++) {
    const chapter = CHAPTERS[ci];
    for (let si = 0; si < chapter.subChapters.length; si++) {
      const subChapter = chapter.subChapters[si];
      for (let fi = 0; fi < subChapter.functions.length; fi++) {
        if (
          ci < position.chapterIndex ||
          (ci === position.chapterIndex && si < position.subChapterIndex) ||
          (ci === position.chapterIndex &&
            si === position.subChapterIndex &&
            fi <= position.functionIndex)
        ) {
          currentStep++;
        }
      }
    }
  }

  return totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
}

export default function MobileHeader({ position, status, dispatch }: MobileHeaderProps) {
  const resetSimulation = useConfigStore((state) => state.resetSimulation);
  // Use githubUrl from chapter data (empty for simulation-only functions)
  const currentFunction = getFunctionAtPosition(
    position.chapterIndex,
    position.subChapterIndex,
    position.functionIndex
  );
  const atStart = isAtStart(position);
  const atEnd = isAtEnd(position) || status === 'complete';
  const progress = calculateProgress(position);
  const isPlaying = status === 'running';

  const handleStepBack = useCallback(() => {
    if (!atStart) {
      dispatch({ type: 'STEP_BACK' });
    }
  }, [dispatch, atStart]);

  const handleStepForward = useCallback(() => {
    if (!atEnd) {
      dispatch({ type: 'STEP_FORWARD' });
    }
  }, [dispatch, atEnd]);

  const handleStartOver = useCallback(() => {
    resetSimulation(); // Reset config store's simulationStarted flag
    dispatch({ type: 'RESET' });
  }, [dispatch, resetSimulation]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else {
      dispatch({ type: 'RESUME' });
    }
  }, [dispatch, isPlaying]);

  return (
    <header
      className="sticky top-0 z-20 grid gap-0 bg-[rgba(8,12,8,0.98)]"
      data-testid="mobile-header"
    >
      {/* 1. Author links */}
      <nav className="flex items-center justify-center gap-4 py-2 text-[10px]" aria-label="Social links">
        <a
          className="inline-flex items-center gap-1 text-crt-amber"
          href={ATTRIBUTION.links.github}
          rel="noreferrer"
          target="_blank"
        >
          <Github size={11} />
          <span>GitHub</span>
        </a>
        <a
          className="inline-flex items-center gap-1 text-crt-amber"
          href={ATTRIBUTION.links.twitter}
          rel="noreferrer"
          target="_blank"
        >
          <Twitter size={11} />
          <span>@prabal_</span>
        </a>
        <a className="text-crt-amber" href={ATTRIBUTION.links.linkedin} rel="noreferrer" target="_blank">
          <Linkedin size={11} />
        </a>
        <a className="text-crt-amber" href={ATTRIBUTION.links.home} rel="noreferrer" target="_blank">
          <Home size={11} />
        </a>
      </nav>

      {/* 2. Navigation buttons - full width grid */}
      <div className="grid grid-cols-4 border-y border-crt-line/40">
        <button
          type="button"
          className="flex h-10 appearance-none items-center justify-center border-0 bg-transparent text-lg text-crt-ink shadow-none outline-none disabled:opacity-40"
          onClick={handleStartOver}
        >
          ↺
        </button>
        <button
          type="button"
          className="flex h-10 appearance-none items-center justify-center border-0 border-l border-l-crt-line/40 bg-transparent text-lg text-crt-ink shadow-none outline-none disabled:opacity-40"
          onClick={handleStepBack}
          disabled={atStart}
        >
          ⏮
        </button>
        <button
          type="button"
          className="flex h-10 appearance-none items-center justify-center border-0 border-l border-l-crt-line/40 bg-transparent text-lg text-crt-ink shadow-none outline-none disabled:opacity-40"
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className="flex h-10 appearance-none items-center justify-center border-0 border-l border-l-crt-line/40 bg-transparent text-lg text-crt-ink shadow-none outline-none disabled:opacity-40"
          onClick={handleStepForward}
          disabled={atEnd}
        >
          ⏭
        </button>
      </div>

      {/* 3. Progress bar - not clickable, no percentage text */}
      <div
        className="relative h-1.5"
        style={{ backgroundColor: 'rgba(60, 60, 60, 0.7)' }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 bg-crt-ink/70 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 4. Function name + link */}
      {currentFunction && (
        currentFunction.githubUrl ? (
          <a
            className="flex items-center justify-center gap-1 border-b border-crt-line/30 py-1.5 text-[10px] text-crt-cyan"
            href={currentFunction.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <span className="font-mono truncate">{currentFunction.name}</span>
            <ExternalLink size={9} />
          </a>
        ) : (
          <span className="flex items-center justify-center gap-1 border-b border-crt-line/30 py-1.5 text-[10px] text-crt-ink/60">
            <span className="font-mono truncate">{currentFunction.name}</span>
          </span>
        )
      )}
    </header>
  );
}
