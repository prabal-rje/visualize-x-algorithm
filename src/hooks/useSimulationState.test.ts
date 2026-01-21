import { describe, expect, it } from 'vitest';
import {
  simulationReducer,
  type SimulationState,
  type SimulationPosition,
  INITIAL_STATE
} from './useSimulationState';
import { CHAPTERS } from '../data/chapters';

describe('useSimulationState', () => {
  describe('simulationReducer', () => {
    describe('START action', () => {
      it('sets status to running and records startedAt timestamp', () => {
        const before = Date.now();
        const result = simulationReducer(INITIAL_STATE, { type: 'START' });
        const after = Date.now();

        expect(result.status).toBe('running');
        expect(result.startedAt).toBeGreaterThanOrEqual(before);
        expect(result.startedAt).toBeLessThanOrEqual(after);
      });

      it('resets position to start when starting from idle', () => {
        const stateWithPosition: SimulationState = {
          ...INITIAL_STATE,
          position: { chapterIndex: 2, subChapterIndex: 1, functionIndex: 0 }
        };
        const result = simulationReducer(stateWithPosition, { type: 'START' });
        expect(result.position).toEqual({
          chapterIndex: 0,
          subChapterIndex: 0,
          functionIndex: 0
        });
      });
    });

    describe('PAUSE action', () => {
      it('sets status to paused when running', () => {
        const runningState: SimulationState = {
          ...INITIAL_STATE,
          status: 'running',
          startedAt: Date.now()
        };
        const result = simulationReducer(runningState, { type: 'PAUSE' });
        expect(result.status).toBe('paused');
      });

      it('preserves position when pausing', () => {
        const runningState: SimulationState = {
          status: 'running',
          position: { chapterIndex: 1, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(runningState, { type: 'PAUSE' });
        expect(result.position).toEqual({
          chapterIndex: 1,
          subChapterIndex: 1,
          functionIndex: 0
        });
      });
    });

    describe('RESUME action', () => {
      it('sets status to running when paused', () => {
        const pausedState: SimulationState = {
          status: 'paused',
          position: { chapterIndex: 1, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(pausedState, { type: 'RESUME' });
        expect(result.status).toBe('running');
      });

      it('preserves position when resuming', () => {
        const pausedState: SimulationState = {
          status: 'paused',
          position: { chapterIndex: 2, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(pausedState, { type: 'RESUME' });
        expect(result.position).toEqual({
          chapterIndex: 2,
          subChapterIndex: 1,
          functionIndex: 0
        });
      });
    });

    describe('RESET action', () => {
      it('returns to initial state', () => {
        const someState: SimulationState = {
          status: 'running',
          position: { chapterIndex: 3, subChapterIndex: 1, functionIndex: 1 },
          startedAt: Date.now()
        };
        const result = simulationReducer(someState, { type: 'RESET' });
        expect(result).toEqual(INITIAL_STATE);
      });
    });

    describe('STEP_FORWARD action', () => {
      it('advances function index within same subchapter', () => {
        // ch4 has subchapter with 2 functions
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 3, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_FORWARD' });
        expect(result.position.functionIndex).toBe(1);
        expect(result.position.subChapterIndex).toBe(1);
        expect(result.position.chapterIndex).toBe(3);
      });

      it('advances to next subchapter when at end of functions', () => {
        // ch3 has 3 subchapters, start at end of first
        const ch3SubChapter1LastFunction =
          CHAPTERS[2].subChapters[0].functions.length - 1;
        const state: SimulationState = {
          status: 'running',
          position: {
            chapterIndex: 2,
            subChapterIndex: 0,
            functionIndex: ch3SubChapter1LastFunction
          },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_FORWARD' });
        expect(result.position.subChapterIndex).toBe(1);
        expect(result.position.functionIndex).toBe(0);
        expect(result.position.chapterIndex).toBe(2);
      });

      it('advances to next chapter when at end of subchapters', () => {
        // At end of ch1 (last subchapter, last function)
        const ch1LastSubChapter = CHAPTERS[0].subChapters.length - 1;
        const ch1LastFunction =
          CHAPTERS[0].subChapters[ch1LastSubChapter].functions.length - 1;
        const state: SimulationState = {
          status: 'running',
          position: {
            chapterIndex: 0,
            subChapterIndex: ch1LastSubChapter,
            functionIndex: ch1LastFunction
          },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_FORWARD' });
        expect(result.position.chapterIndex).toBe(1);
        expect(result.position.subChapterIndex).toBe(0);
        expect(result.position.functionIndex).toBe(0);
      });

      it('sets status to complete when at end of all chapters', () => {
        // At end of last chapter
        const lastChapterIndex = CHAPTERS.length - 1;
        const lastSubChapterIndex =
          CHAPTERS[lastChapterIndex].subChapters.length - 1;
        const lastFunctionIndex =
          CHAPTERS[lastChapterIndex].subChapters[lastSubChapterIndex].functions
            .length - 1;
        const state: SimulationState = {
          status: 'running',
          position: {
            chapterIndex: lastChapterIndex,
            subChapterIndex: lastSubChapterIndex,
            functionIndex: lastFunctionIndex
          },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_FORWARD' });
        expect(result.status).toBe('complete');
        // Position should stay at end
        expect(result.position.chapterIndex).toBe(lastChapterIndex);
      });
    });

    describe('STEP_BACK action', () => {
      it('decrements function index within same subchapter', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 3, subChapterIndex: 1, functionIndex: 1 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_BACK' });
        expect(result.position.functionIndex).toBe(0);
        expect(result.position.subChapterIndex).toBe(1);
        expect(result.position.chapterIndex).toBe(3);
      });

      it('moves to previous subchapter last function when at start of functions', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 2, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_BACK' });
        expect(result.position.subChapterIndex).toBe(0);
        const prevSubChapterFunctionCount =
          CHAPTERS[2].subChapters[0].functions.length;
        expect(result.position.functionIndex).toBe(
          prevSubChapterFunctionCount - 1
        );
        expect(result.position.chapterIndex).toBe(2);
      });

      it('moves to previous chapter last position when at start of chapter', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 1, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_BACK' });
        expect(result.position.chapterIndex).toBe(0);
        const prevChapterLastSubChapter = CHAPTERS[0].subChapters.length - 1;
        expect(result.position.subChapterIndex).toBe(prevChapterLastSubChapter);
        const prevSubChapterLastFunction =
          CHAPTERS[0].subChapters[prevChapterLastSubChapter].functions.length -
          1;
        expect(result.position.functionIndex).toBe(prevSubChapterLastFunction);
      });

      it('stays at start when already at beginning', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_BACK' });
        expect(result.position).toEqual({
          chapterIndex: 0,
          subChapterIndex: 0,
          functionIndex: 0
        });
      });

      it('changes status from complete to running when stepping back', () => {
        const state: SimulationState = {
          status: 'complete',
          position: { chapterIndex: 4, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'STEP_BACK' });
        expect(result.status).toBe('running');
      });
    });

    describe('JUMP_TO_CHAPTER action', () => {
      it('jumps to start of specified chapter', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, {
          type: 'JUMP_TO_CHAPTER',
          chapterIndex: 3
        });
        expect(result.position).toEqual({
          chapterIndex: 3,
          subChapterIndex: 0,
          functionIndex: 0
        });
      });

      it('clamps to valid chapter range', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, {
          type: 'JUMP_TO_CHAPTER',
          chapterIndex: 999
        });
        expect(result.position.chapterIndex).toBe(CHAPTERS.length - 1);
      });

      it('sets status to running if was idle', () => {
        const result = simulationReducer(INITIAL_STATE, {
          type: 'JUMP_TO_CHAPTER',
          chapterIndex: 2
        });
        expect(result.status).toBe('running');
        expect(result.startedAt).not.toBeNull();
      });
    });

    describe('JUMP_TO_POSITION action', () => {
      it('jumps to exact position', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 0, subChapterIndex: 0, functionIndex: 0 },
          startedAt: Date.now()
        };
        const newPosition: SimulationPosition = {
          chapterIndex: 2,
          subChapterIndex: 1,
          functionIndex: 0
        };
        const result = simulationReducer(state, {
          type: 'JUMP_TO_POSITION',
          position: newPosition
        });
        expect(result.position).toEqual(newPosition);
      });

      it('sets status to running if was complete', () => {
        const state: SimulationState = {
          status: 'complete',
          position: { chapterIndex: 4, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, {
          type: 'JUMP_TO_POSITION',
          position: { chapterIndex: 1, subChapterIndex: 0, functionIndex: 0 }
        });
        expect(result.status).toBe('running');
      });
    });

    describe('COMPLETE action', () => {
      it('sets status to complete', () => {
        const state: SimulationState = {
          status: 'running',
          position: { chapterIndex: 4, subChapterIndex: 1, functionIndex: 0 },
          startedAt: Date.now()
        };
        const result = simulationReducer(state, { type: 'COMPLETE' });
        expect(result.status).toBe('complete');
      });
    });
  });
});
