import { useEffect, useCallback } from 'react';
import { ExternalLink, FileCode } from 'lucide-react';
import { CHAPTERS, getFunctionAtPosition } from '../../data/chapters';
import type { SimulationPosition, SimulationAction, SimulationStatus } from '../../hooks/useSimulationState';
import { useConfigStore } from '../../stores/config';
import { useViewport } from '../../hooks/useViewport';

type TimelineProps = {
  position: SimulationPosition;
  status: SimulationStatus;
  dispatch: React.Dispatch<SimulationAction>;
};

// Check if we are at the very start
function isAtStart(position: SimulationPosition): boolean {
  return (
    position.chapterIndex === 0 &&
    position.subChapterIndex === 0 &&
    position.functionIndex === 0
  );
}

// Check if we are at the very end
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

// Calculate total step count
function getTotalSteps(): number {
  let total = 0;
  for (const chapter of CHAPTERS) {
    for (const subChapter of chapter.subChapters) {
      total += subChapter.functions.length;
    }
  }
  return total;
}

// Calculate linear progress (0-100)
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

// Convert a progress percentage (0-100) to a SimulationPosition
function progressToPosition(progressPercent: number): SimulationPosition {
  const totalSteps = getTotalSteps();
  const targetStep = Math.round((progressPercent / 100) * totalSteps);

  let stepCount = 0;
  for (let ci = 0; ci < CHAPTERS.length; ci++) {
    const chapter = CHAPTERS[ci];
    for (let si = 0; si < chapter.subChapters.length; si++) {
      const subChapter = chapter.subChapters[si];
      for (let fi = 0; fi < subChapter.functions.length; fi++) {
        if (stepCount >= targetStep) {
          return { chapterIndex: ci, subChapterIndex: si, functionIndex: fi };
        }
        stepCount++;
      }
    }
  }

  // Return last position if we reach here
  const lastChapterIdx = CHAPTERS.length - 1;
  const lastSubChapterIdx = CHAPTERS[lastChapterIdx].subChapters.length - 1;
  const lastFunctionIdx = CHAPTERS[lastChapterIdx].subChapters[lastSubChapterIdx].functions.length - 1;
  return { chapterIndex: lastChapterIdx, subChapterIndex: lastSubChapterIdx, functionIndex: lastFunctionIdx };
}

export default function Timeline({ position, status, dispatch }: TimelineProps) {
  const expertMode = useConfigStore((state) => state.expertMode);
  const { isMobile } = useViewport();
  const sourceBaseUrl = 'https://github.com/xai-org/x-algorithm/blob/main/';
  const currentFunction = getFunctionAtPosition(
    position.chapterIndex,
    position.subChapterIndex,
    position.functionIndex
  );
  const currentChapter = CHAPTERS[position.chapterIndex];
  const currentSubChapter = currentChapter?.subChapters[position.subChapterIndex];
  const functionStack = currentSubChapter?.functions ?? [];
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
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleChapterClick = useCallback((chapterIndex: number) => {
    dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex });
  }, [dispatch]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else {
      dispatch({ type: 'RESUME' });
    }
  }, [dispatch, isPlaying]);


  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentClicked = (clickX / rect.width) * 100;
    const newPosition = progressToPosition(percentClicked);
    dispatch({ type: 'JUMP_TO_POSITION', position: newPosition });
  }, [dispatch]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if focus is on an input element
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleStepBack();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStepForward, handleStepBack]);

  // Navigation buttons component for reuse - square buttons
  const NavButtons = ({ className = '' }: { className?: string }) => (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        className="crt-button !h-10 !w-10 !min-w-0 shrink-0 text-lg sm:!h-11 sm:!w-11 sm:text-xl"
        onClick={handleStartOver}
        aria-label="Start over"
      >
        ↺
      </button>
      <button
        type="button"
        className="crt-button !h-10 !w-10 !min-w-0 shrink-0 text-lg sm:!h-11 sm:!w-11 sm:text-xl"
        onClick={handleStepBack}
        disabled={atStart}
        aria-label="Step back"
      >
        ⏮
      </button>
      <button
        type="button"
        className="crt-button !h-10 !w-10 !min-w-0 shrink-0 text-lg sm:!h-11 sm:!w-11 sm:text-xl"
        onClick={handlePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button
        type="button"
        className="crt-button !h-10 !w-10 !min-w-0 shrink-0 text-lg sm:!h-11 sm:!w-11 sm:text-xl"
        onClick={handleStepForward}
        disabled={atEnd}
        aria-label="Step forward"
      >
        ⏭
      </button>
    </div>
  );

  return (
    <div
      className="grid gap-3 border-t border-crt-line/35 bg-crt-void/70 p-panel max-sm:border-t-0 max-sm:px-3"
      data-testid="timeline"
      data-system="timeline"
    >
      {isMobile ? (
        <div className="flex flex-col gap-3">
          {currentFunction && (
            <a
              className="inline-flex items-center justify-center gap-2 text-xs text-crt-ink transition hover:text-crt-amber"
              href={`${sourceBaseUrl}${currentFunction.file}`}
              rel="noreferrer"
              target="_blank"
              data-testid="function-file-link"
            >
              <span className="font-mono">{currentFunction.name}</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
          <NavButtons className="justify-center" />
        </div>
      ) : (
        <div className="flex items-center gap-4" data-testid="function-stack">
          <NavButtons className="shrink-0 self-center" />

          {functionStack.length > 0 && currentFunction && (
            <div
              className="flex min-w-0 flex-1 items-center gap-4 border-l border-crt-line/25 pl-4"
              data-testid="function-stack-track"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 font-mono text-sm text-crt-cyan text-glow-cyan">
                    {currentFunction.name}
                  </span>
                  {functionStack.length > 1 && (
                    <span className="shrink-0 text-xs text-crt-ink/50">
                      {position.functionIndex + 1} of {functionStack.length}
                    </span>
                  )}
                  <a
                    className="ml-auto shrink-0 inline-flex items-center gap-1.5 text-xs text-crt-amber/70 transition hover:text-crt-amber"
                    href={`${sourceBaseUrl}${currentFunction.file}`}
                    rel="noreferrer"
                    target="_blank"
                    data-testid="function-file-link"
                  >
                    <FileCode size={14} aria-hidden="true" />
                    <span>{currentFunction.file}</span>
                  </a>
                </div>
                <div className="mt-1 truncate text-xs text-crt-ink/60">
                  {currentFunction.summary}
                </div>
                <div className="mt-2 flex h-1.5 gap-1.5">
                  {functionStack.length > 1 &&
                    functionStack.map((fn, idx) => (
                      <span
                        key={fn.id}
                        className="h-1.5 w-1.5 rounded-full transition-colors data-[active=true]:bg-crt-cyan data-[active=false]:bg-crt-ink/30"
                        data-active={idx === position.functionIndex}
                        title={fn.name}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chapter Markers - hidden on mobile, use progress bar instead */}
      <div className="relative max-sm:hidden max-lg:before:absolute max-lg:before:inset-y-0 max-lg:before:left-0 max-lg:before:w-8 max-lg:before:bg-[linear-gradient(90deg,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0)_100%)] max-lg:before:pointer-events-none max-lg:after:absolute max-lg:after:inset-y-0 max-lg:after:right-0 max-lg:after:w-8 max-lg:after:bg-[linear-gradient(270deg,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0)_100%)] max-lg:after:pointer-events-none">
        <div className="flex gap-1 overflow-x-auto snap-x snap-mandatory">
          {CHAPTERS.map((chapter, index) => {
            const isActive = index === position.chapterIndex;
            const isVisited = index < position.chapterIndex;

            return (
              <button
                key={chapter.id}
                type="button"
                className="flex min-w-[80px] flex-1 snap-center cursor-pointer flex-col items-center gap-1 border border-crt-line/25 bg-crt-panel-strong/40 px-3 py-2 transition hover:border-crt-ink hover:shadow-crt data-[active=true]:border-crt-amber data-[active=true]:bg-[rgba(255,176,0,0.1)] data-[active=true]:shadow-amber data-[visited=true]:border-crt-line/50 data-[visited=true]:bg-crt-ink/10 max-xs:min-w-[60px] max-xs:px-2 max-xs:py-2"
                data-testid={`chapter-marker-${index}`}
                data-active={isActive}
                data-visited={isVisited}
                onClick={() => handleChapterClick(index)}
              >
                <span className="text-[10px] tracking-[0.15em] text-crt-amber max-xs:text-[9px] max-xs:tracking-[0.08em]">
                  CH.{chapter.number}
                </span>
                <span className="max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] uppercase tracking-[0.08em] text-crt-ink max-sm:max-w-[90px] max-xs:max-w-[70px] max-xs:text-[9px] max-xs:tracking-[0.04em]">
                  {expertMode ? chapter.labelTechnical : chapter.labelSimple}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-baseline justify-between gap-3 uppercase max-xs:gap-2">
        <span className="text-[10px] tracking-[0.16em] text-crt-ink/80 max-xs:text-[9px] max-xs:tracking-[0.1em]">
          Simulation Progress
        </span>
        <span className="text-[10px] tracking-[0.14em] text-crt-amber/90 max-xs:text-[9px]">
          {progress}%
        </span>
      </div>
      <div
        className="relative h-5 overflow-hidden rounded-[2px] border border-crt-line/30 bg-crt-panel-strong/60 max-xs:h-4"
        data-testid="progress-indicator"
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Simulation progress"
        style={
          {
            cursor: 'pointer',
            '--tick-count': CHAPTERS.length
          } as React.CSSProperties
        }
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-crt-ink/30 to-crt-ink/50 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(var(--tick-count),1fr)]" aria-hidden="true">
          {CHAPTERS.map((chapter) => (
            <span
              key={chapter.id}
              className="w-px justify-self-start bg-crt-line/20 shadow-[0_0_6px_rgba(51,255,51,0.2)] last:justify-self-end"
              data-testid="progress-tick"
            />
          ))}
        </div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] tracking-[0.1em] text-crt-ink drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] max-xs:text-[9px]">
          {progress}%
        </span>
      </div>

    </div>
  );
}
