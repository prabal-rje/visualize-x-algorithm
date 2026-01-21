import { CHAPTERS, getFunctionAtPosition } from '../../data/chapters';
import type { SimulationPosition, SimulationAction, SimulationStatus } from '../../hooks/useSimulationState';
import { useConfigStore } from '../../stores/config';
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

// Calculate linear progress (0-100)
function calculateProgress(position: SimulationPosition): number {
  let currentStep = 0;
  let totalSteps = 0;

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
        totalSteps++;
      }
    }
  }

  return totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
}

export default function Timeline({ position, status, dispatch }: TimelineProps) {
  const expertMode = useConfigStore((state) => state.expertMode);
  const currentFunction = getFunctionAtPosition(
    position.chapterIndex,
    position.subChapterIndex,
    position.functionIndex
  );
  const atStart = isAtStart(position);
  const atEnd = isAtEnd(position) || status === 'complete';
  const progress = calculateProgress(position);

  const handleStepBack = () => {
    dispatch({ type: 'STEP_BACK' });
  };

  const handleStepForward = () => {
    dispatch({ type: 'STEP_FORWARD' });
  };

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
  };

  const handleChapterClick = (chapterIndex: number) => {
    dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex });
  };

  return (
    <div className={styles.timeline} data-testid="timeline">
      {/* Navigation Controls */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStartOver}
          aria-label="Start over"
        >
          START OVER
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStepBack}
          disabled={atStart}
          aria-label="Step back"
        >
          &lt;&lt; BACK
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handleStepForward}
          disabled={atEnd}
          aria-label="Step forward"
        >
          NEXT &gt;&gt;
        </button>
      </div>

      {/* Chapter Markers */}
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

      {/* Progress Indicator */}
      <div className={styles.progressContainer} data-testid="progress-indicator">
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        <span className={styles.progressText}>{progress}%</span>
      </div>

      {/* Current Function Info */}
      {currentFunction && (
        <div className={styles.functionInfo}>
          <code className={styles.functionName}>{currentFunction.name}</code>
          <span className={styles.functionSummary}>{currentFunction.summary}</span>
        </div>
      )}
    </div>
  );
}
