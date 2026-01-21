import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, vi } from 'vitest';
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
      expect(screen.getByText('gRPC Request')).toBeInTheDocument();
      expect(screen.getByText('Thunder/Phoenix')).toBeInTheDocument();
      expect(screen.getByText('Filter Cascade')).toBeInTheDocument();
      expect(screen.getByText('Heavy Ranker')).toBeInTheDocument();
      expect(screen.getByText('Top-K Selection')).toBeInTheDocument();
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
      // First function of first chapter
      expect(screen.getByText(/handleRequest/)).toBeInTheDocument();
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
  });
});
