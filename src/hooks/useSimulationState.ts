import { useReducer } from 'react';
import { CHAPTERS } from '../data/chapters';

export type SimulationPosition = {
  chapterIndex: number;
  subChapterIndex: number;
  functionIndex: number;
};

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'complete';

export type SimulationState = {
  status: SimulationStatus;
  position: SimulationPosition;
  startedAt: number | null;
};

export type SimulationAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACK' }
  | { type: 'JUMP_TO_CHAPTER'; chapterIndex: number }
  | { type: 'JUMP_TO_POSITION'; position: SimulationPosition }
  | { type: 'COMPLETE' };

export const INITIAL_STATE: SimulationState = {
  status: 'idle',
  position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
  startedAt: null
};

// Helper to check if position is at the very end
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

// Helper to check if position is at the very start
function isAtStart(position: SimulationPosition): boolean {
  return (
    position.chapterIndex === 0 &&
    position.subChapterIndex === 0 &&
    position.functionIndex === 0
  );
}

// Step forward in the simulation
function stepForward(position: SimulationPosition): SimulationPosition {
  const chapter = CHAPTERS[position.chapterIndex];
  const subChapter = chapter.subChapters[position.subChapterIndex];

  // Try to advance within current subchapter
  if (position.functionIndex < subChapter.functions.length - 1) {
    return { ...position, functionIndex: position.functionIndex + 1 };
  }

  // Try to advance to next subchapter
  if (position.subChapterIndex < chapter.subChapters.length - 1) {
    return {
      ...position,
      subChapterIndex: position.subChapterIndex + 1,
      functionIndex: 0
    };
  }

  // Try to advance to next chapter
  if (position.chapterIndex < CHAPTERS.length - 1) {
    return {
      chapterIndex: position.chapterIndex + 1,
      subChapterIndex: 0,
      functionIndex: 0
    };
  }

  // Already at end, return same position
  return position;
}

// Step backward in the simulation
function stepBack(position: SimulationPosition): SimulationPosition {
  // Try to go back within current subchapter
  if (position.functionIndex > 0) {
    return { ...position, functionIndex: position.functionIndex - 1 };
  }

  // Try to go to previous subchapter
  if (position.subChapterIndex > 0) {
    const prevSubChapterIndex = position.subChapterIndex - 1;
    const prevSubChapter =
      CHAPTERS[position.chapterIndex].subChapters[prevSubChapterIndex];
    return {
      ...position,
      subChapterIndex: prevSubChapterIndex,
      functionIndex: prevSubChapter.functions.length - 1
    };
  }

  // Try to go to previous chapter
  if (position.chapterIndex > 0) {
    const prevChapterIndex = position.chapterIndex - 1;
    const prevChapter = CHAPTERS[prevChapterIndex];
    const prevSubChapterIndex = prevChapter.subChapters.length - 1;
    const prevSubChapter = prevChapter.subChapters[prevSubChapterIndex];
    return {
      chapterIndex: prevChapterIndex,
      subChapterIndex: prevSubChapterIndex,
      functionIndex: prevSubChapter.functions.length - 1
    };
  }

  // Already at start, return same position
  return position;
}

// Clamp chapter index to valid range
function clampChapterIndex(index: number): number {
  return Math.max(0, Math.min(index, CHAPTERS.length - 1));
}

export function simulationReducer(
  state: SimulationState,
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case 'START':
      return {
        status: 'running',
        position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
        startedAt: Date.now()
      };

    case 'PAUSE':
      return {
        ...state,
        status: 'paused'
      };

    case 'RESUME':
      return {
        ...state,
        status: 'running'
      };

    case 'RESET':
      return INITIAL_STATE;

    case 'STEP_FORWARD': {
      if (isAtEnd(state.position)) {
        return { ...state, status: 'complete' };
      }
      return {
        ...state,
        position: stepForward(state.position)
      };
    }

    case 'STEP_BACK': {
      if (isAtStart(state.position)) {
        return state;
      }
      return {
        ...state,
        status: state.status === 'complete' ? 'running' : state.status,
        position: stepBack(state.position)
      };
    }

    case 'JUMP_TO_CHAPTER': {
      const clampedIndex = clampChapterIndex(action.chapterIndex);
      return {
        ...state,
        status: state.status === 'idle' ? 'running' : state.status,
        startedAt: state.startedAt ?? Date.now(),
        position: {
          chapterIndex: clampedIndex,
          subChapterIndex: 0,
          functionIndex: 0
        }
      };
    }

    case 'JUMP_TO_POSITION':
      return {
        ...state,
        status:
          state.status === 'complete' || state.status === 'idle'
            ? 'running'
            : state.status,
        startedAt: state.startedAt ?? Date.now(),
        position: action.position
      };

    case 'COMPLETE':
      return {
        ...state,
        status: 'complete'
      };

    default:
      return state;
  }
}

export function useSimulationState() {
  return useReducer(simulationReducer, INITIAL_STATE);
}
