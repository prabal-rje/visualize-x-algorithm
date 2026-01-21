import { useEffect, useCallback } from 'react';
import { CHAPTERS, getFunctionAtPosition } from '../../data/chapters';
import type { SimulationPosition, SimulationAction, SimulationStatus } from '../../hooks/useSimulationState';
import { useConfigStore } from '../../stores/config';
import { useViewport } from '../../hooks/useViewport';
import styles from '../../styles/timeline.module.css';

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
  const stackVariant = isMobile ? 'stack' : 'marquee';

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

  const playLabel = isPlaying ? 'PAUSE' : 'PLAY';
  const playIcon = isPlaying ? '||' : '>';

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

  const renderStackItems = (keyPrefix: string) =>
    functionStack.map((fn, index) => (
      <span
        key={`${keyPrefix}-${fn.id}`}
        className={styles.functionStackItem}
        data-active={index === position.functionIndex}
      >
        {fn.name}
      </span>
    ));

  return (
    <div className={styles.timeline} data-testid="timeline">
      {functionStack.length > 0 && (
        <div
          className={styles.functionStack}
          data-testid="function-stack"
          data-mode={stackVariant}
        >
          <div className={styles.functionStackHeader}>
            <span className={styles.functionStackLabel}>FUNCTION STACK</span>
            {currentFunction && (
              <span className={styles.functionStackFile}>
                {currentFunction.file}
              </span>
            )}
          </div>
          <div className={styles.functionStackTrack} data-mode={stackVariant}>
            <div className={styles.functionStackScroller} data-mode={stackVariant}>
              <div className={styles.functionStackRow}>
                {renderStackItems('primary')}
              </div>
              {!isMobile && (
                <div
                  className={styles.functionStackRow}
                  aria-hidden="true"
                >
                  {renderStackItems('clone')}
                </div>
              )}
            </div>
          </div>
          {currentFunction && (
            <div className={styles.functionStackSummary}>
              {currentFunction.summary}
            </div>
          )}
        </div>
      )}

      {/* Navigation Controls */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStartOver}
          aria-label="Start over"
        >
          <span className={styles.controlIcon} aria-hidden="true">
            RST
          </span>
          <span className={styles.controlLabel}>START OVER</span>
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStepBack}
          disabled={atStart}
          aria-label="Step back"
        >
          <span className={styles.controlIcon} aria-hidden="true">
            &lt;&lt;
          </span>
          <span className={styles.controlLabel}>&lt;&lt; BACK</span>
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className={styles.controlIcon} aria-hidden="true">
            {playIcon}
          </span>
          <span className={styles.controlLabel}>{playLabel}</span>
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStepForward}
          disabled={atEnd}
          aria-label="Step forward"
        >
          <span className={styles.controlIcon} aria-hidden="true">
            &gt;&gt;
          </span>
          <span className={styles.controlLabel}>NEXT &gt;&gt;</span>
        </button>
      </div>

      {/* Chapter Markers */}
      <div className={styles.chaptersWrap}>
        <div className={styles.chapters}>
          {CHAPTERS.map((chapter, index) => {
            const isActive = index === position.chapterIndex;
            const isVisited = index < position.chapterIndex;

            return (
              <button
                key={chapter.id}
                type="button"
                className={styles.marker}
                data-testid={`chapter-marker-${index}`}
                data-active={isActive}
                data-visited={isVisited}
                onClick={() => handleChapterClick(index)}
              >
                <span className={styles.chapterNumber}>CH.{chapter.number}</span>
                <span className={styles.chapterLabel}>
                  {expertMode ? chapter.labelTechnical : chapter.labelSimple}
                </span>
              </button>
            );
          })}
        </div>
        <span className={styles.scrollHint} aria-hidden="true">
          Swipe for more →
        </span>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Simulation Progress</span>
        <span className={styles.progressValue}>{progress}%</span>
      </div>
      <div
        className={styles.progressContainer}
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
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <div className={styles.progressTicks} aria-hidden="true">
          {CHAPTERS.map((chapter) => (
            <span
              key={chapter.id}
              className={styles.progressTick}
              data-testid="progress-tick"
            />
          ))}
        </div>
        <span className={styles.progressText}>{progress}%</span>
      </div>

    </div>
  );
}
