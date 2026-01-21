import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import Timeline from './Timeline';
import { useConfigStore } from '../../stores/config';
import { CHAPTERS } from '../../data/chapters';
import type { SimulationPosition } from '../../hooks/useSimulationState';

describe('Timeline', () => {
  const mockDispatch = vi.fn();
  const defaultPosition: SimulationPosition = {
    chapterIndex: 0,
    subChapterIndex: 0,
    functionIndex: 0
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    useConfigStore.setState({ expertMode: false });
  });

  describe('chapter markers', () => {
    it('renders all chapter markers', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByText('CH.0')).toBeInTheDocument();
      expect(screen.getByText('CH.1')).toBeInTheDocument();
      expect(screen.getByText('CH.2')).toBeInTheDocument();
      expect(screen.getByText('CH.3')).toBeInTheDocument();
      expect(screen.getByText('CH.4')).toBeInTheDocument();
      expect(screen.getByText('CH.5')).toBeInTheDocument();
    });

    it('shows simplified labels in non-expert mode', () => {
      useConfigStore.setState({ expertMode: false });
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByText('Loadout')).toBeInTheDocument();
      expect(screen.getByText('Request')).toBeInTheDocument();
      expect(screen.getByText('Gather')).toBeInTheDocument();
      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Score')).toBeInTheDocument();
      expect(screen.getByText('Deliver')).toBeInTheDocument();
    });

    it('shows technical labels in expert mode', () => {
      useConfigStore.setState({ expertMode: true });
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByText('Mission Prep')).toBeInTheDocument();
      expect(screen.getByText('gRPC Request')).toBeInTheDocument();
      expect(screen.getByText('Thunder/Phoenix')).toBeInTheDocument();
      expect(screen.getByText('Filter Cascade')).toBeInTheDocument();
      expect(screen.getByText('Heavy Ranker')).toBeInTheDocument();
      expect(screen.getByText('Delivery Report')).toBeInTheDocument();
    });
  });

  describe('current position indicator', () => {
    it('highlights current chapter', () => {
      render(
        <Timeline
          position={{ chapterIndex: 2, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      const timeline = screen.getByTestId('timeline');
      const ch3Marker = within(timeline).getByTestId('chapter-marker-2');
      expect(ch3Marker).toHaveAttribute('data-active', 'true');
    });

    it('shows completed chapters as visited', () => {
      render(
        <Timeline
          position={{ chapterIndex: 3, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      const timeline = screen.getByTestId('timeline');
      const ch1Marker = within(timeline).getByTestId('chapter-marker-0');
      const ch2Marker = within(timeline).getByTestId('chapter-marker-1');
      expect(ch1Marker).toHaveAttribute('data-visited', 'true');
      expect(ch2Marker).toHaveAttribute('data-visited', 'true');
    });
  });

  describe('navigation via clicking', () => {
    it('dispatches JUMP_TO_CHAPTER when clicking a chapter marker', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      const ch3Marker = screen.getByTestId('chapter-marker-2');
      await user.click(ch3Marker);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'JUMP_TO_CHAPTER',
        chapterIndex: 2
      });
    });
  });

  describe('navigation controls', () => {
    it('renders step forward button', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(
        screen.getByRole('button', { name: /step forward/i })
      ).toBeInTheDocument();
    });

    it('renders step back button', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(
        screen.getByRole('button', { name: /step back/i })
      ).toBeInTheDocument();
    });

    it('dispatches STEP_FORWARD when clicking forward button', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      await user.click(screen.getByRole('button', { name: /step forward/i }));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'STEP_FORWARD' });
    });

    it('dispatches STEP_BACK when clicking back button', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={{ chapterIndex: 1, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      await user.click(screen.getByRole('button', { name: /step back/i }));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'STEP_BACK' });
    });

    it('disables step back button when at start', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByRole('button', { name: /step back/i })).toBeDisabled();
    });

    it('disables step forward button when at end', () => {
      const lastChapter = CHAPTERS.length - 1;
      const lastSubChapter = CHAPTERS[lastChapter].subChapters.length - 1;
      const lastFunction =
        CHAPTERS[lastChapter].subChapters[lastSubChapter].functions.length - 1;
      render(
        <Timeline
          position={{
            chapterIndex: lastChapter,
            subChapterIndex: lastSubChapter,
            functionIndex: lastFunction
          }}
          status="complete"
          dispatch={mockDispatch}
        />
      );
      expect(
        screen.getByRole('button', { name: /step forward/i })
      ).toBeDisabled();
    });
  });

  describe('start over button', () => {
    it('renders start over button', () => {
      render(
        <Timeline
          position={{ chapterIndex: 2, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(
        screen.getByRole('button', { name: /start over/i })
      ).toBeInTheDocument();
    });

    it('dispatches RESET when clicking start over', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={{ chapterIndex: 2, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      await user.click(screen.getByRole('button', { name: /start over/i }));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' });
    });
  });

  describe('status display', () => {
    it('shows current function info', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      // First function of loadout chapter
      expect(screen.getByText(/MissionLoadout::select_persona/)).toBeInTheDocument();
    });

    it('shows current file path', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByText('client/mission_loadout.ts')).toBeInTheDocument();
    });

    it('shows progress indicator', () => {
      render(
        <Timeline
          position={{ chapterIndex: 2, subChapterIndex: 1, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      // Should show some kind of progress
      expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
    });

    it('shows progress label and tick markers', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByText(/Simulation Progress/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('progress-tick')).toHaveLength(
        CHAPTERS.length
      );
    });
  });

  describe('play/pause controls', () => {
    it('renders play button when paused', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="paused"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });

    it('renders pause button when running', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });

    it('dispatches PAUSE when clicking pause button', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      await user.click(screen.getByRole('button', { name: /pause/i }));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'PAUSE' });
    });

    it('dispatches RESUME when clicking play button', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={defaultPosition}
          status="paused"
          dispatch={mockDispatch}
        />
      );
      await user.click(screen.getByRole('button', { name: /play/i }));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESUME' });
    });
  });

  describe('keyboard controls', () => {
    it('toggles play/pause with space key', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      fireEvent.keyDown(document, { key: ' ', code: 'Space' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'PAUSE' });
    });

    it('steps forward with right arrow key', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'STEP_FORWARD' });
    });

    it('steps back with left arrow key', () => {
      render(
        <Timeline
          position={{ chapterIndex: 1, subChapterIndex: 0, functionIndex: 0 }}
          status="running"
          dispatch={mockDispatch}
        />
      );
      fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'STEP_BACK' });
    });

    it('does not step back at start position', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
      expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'STEP_BACK' });
    });
  });

  describe('interactive scrubber', () => {
    it('progress bar has role progressbar', () => {
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('clicking on progress bar dispatches JUMP_TO_POSITION', async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          position={defaultPosition}
          status="running"
          dispatch={mockDispatch}
        />
      );
      const progressContainer = screen.getByTestId('progress-indicator');
      // Simulate click at middle of progress bar
      await user.click(progressContainer);
      // Should dispatch some kind of navigation action
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
