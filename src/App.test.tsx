import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { AUDIENCES } from './data/audiences';
import { SAMPLE_TWEETS } from './data/tweets';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';

describe('App', () => {
  const defaultAudienceMix = AUDIENCES.reduce<Record<string, number>>(
    (acc, audience) => {
      acc[audience.id] = 100 / AUDIENCES.length;
      return acc;
    },
    {}
  );

  beforeEach(() => {
    useConfigStore.persist?.clearStorage();
    useConfigStore.setState({
      expertMode: false,
      personaId: 'tech-founder',
      tweetText: SAMPLE_TWEETS[0]?.text ?? '',
      sampleTweetId: SAMPLE_TWEETS[0]?.id ?? null,
      audienceMix: defaultAudienceMix,
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null,
      setExpertMode: useConfigStore.getState().setExpertMode,
      setPersonaId: useConfigStore.getState().setPersonaId,
      setTweetText: useConfigStore.getState().setTweetText,
      selectSampleTweet: useConfigStore.getState().selectSampleTweet,
      shuffleSampleTweet: useConfigStore.getState().shuffleSampleTweet,
      setAudienceMixValue: useConfigStore.getState().setAudienceMixValue,
      beginSimulation: useConfigStore.getState().beginSimulation,
      resetSimulation: useConfigStore.getState().resetSimulation
    });
    useMLStore.getState().reset();
  });

  afterEach(() => {
    useConfigStore.persist?.clearStorage();
    useMLStore.getState().reset();
  });

  it('renders the shell container', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });

  it('marks app shell as design-system layout', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toHaveAttribute(
      'data-system',
      'shell'
    );
  });

  it('does not apply outer frame styling to the app shell', () => {
    render(<App />);
    const appShell = screen.getByTestId('app-shell');
    expect(appShell).not.toHaveClass('border');
    expect(appShell).not.toHaveClass('rounded-panel');
  });

  it('uses CRT void surfaces for the arena shell', () => {
    useMLStore.getState().setReady();
    render(<App />);
    expect(screen.getByTestId('app-shell')).toHaveClass('bg-crt-void');
    expect(screen.getByTestId('chapter-canvas')).toHaveClass('bg-crt-void/90');
  });

  it('renders timeline above the chapter canvas', () => {
    useMLStore.getState().setReady();
    render(<App />);
    const timeline = screen.getByTestId('timeline');
    const chapterCanvas = screen.getByTestId('chapter-canvas');
    const position = timeline.compareDocumentPosition(chapterCanvas);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('marks chapter canvas as fixed proportion', () => {
    useMLStore.getState().setReady();
    render(<App />);
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-proportion',
      'fixed'
    );
  });

  it('marks chapter canvas as viewport-fit', () => {
    useMLStore.getState().setReady();
    render(<App />);
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-viewport-fit',
      'true'
    );
  });

  it('marks chapter canvas as fill-height', () => {
    useMLStore.getState().setReady();
    render(<App />);
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-fill-height',
      'true'
    );
  });

  it('marks chapter canvas as compact for chapter 3+', () => {
    useMLStore.getState().setReady();
    render(<App />);
    fireEvent.click(screen.getByTestId('chapter-marker-3'));
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-compact',
      'true'
    );
  });

  it('shows loadout chapter when simulation not started', async () => {
    useMLStore.getState().setReady(); // Skip BIOS loading
    render(<App />);
    expect(await screen.findByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(await screen.findByTestId('config-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('mission-report')).not.toBeInTheDocument();
  });

  it('hides the side panel when simulation is idle', () => {
    useMLStore.getState().setReady(); // Skip BIOS loading
    render(<App />);
    expect(screen.queryByTestId('function-panel')).not.toBeInTheDocument();
  });

  it('does not render MissionReport when simulation started with rpgStats', async () => {
    useMLStore.getState().setReady(); // Skip BIOS loading
    useConfigStore.setState({
      simulationStarted: true,
      rpgStats: {
        reach: 1234,
        resonance: 0.85,
        momentum: 42,
        percentile: 75
      }
    });
    render(<App />);
    expect(screen.queryByTestId('mission-report')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mission report/i })).not.toBeInTheDocument();
    expect(await screen.findByTestId('chapter-1-scene')).toBeInTheDocument();
    expect(screen.queryByTestId('config-panel')).not.toBeInTheDocument();
  });

  it('shows BIOSLoading when ML status is loading', () => {
    useMLStore.getState().setLoading('Initializing embeddings...');
    render(<App />);
    expect(screen.getByTestId('bios-loading')).toBeInTheDocument();
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chapter-canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('crt-controls')).not.toBeInTheDocument();
    expect(screen.queryByTestId('config-panel')).not.toBeInTheDocument();
  });

  it('shows loadout chapter when ML status is ready', async () => {
    useMLStore.getState().setReady();
    render(<App />);
    expect(await screen.findByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(screen.queryByTestId('bios-loading')).not.toBeInTheDocument();
  });

  it('shows BIOSLoading when ML status is idle (not ready)', () => {
    // When not ready, show BIOS loading
    render(<App />);
    expect(screen.getByTestId('bios-loading')).toBeInTheDocument();
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chapter-canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('crt-controls')).not.toBeInTheDocument();
    expect(screen.queryByTestId('config-panel')).not.toBeInTheDocument();
  });
});
