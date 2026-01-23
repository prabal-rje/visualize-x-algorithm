import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { AUDIENCES } from './data/audiences';
import { SAMPLE_TWEETS } from './data/tweets';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';

// Helper to set ML ready and dismiss intro screen
async function renderAppWithIntro() {
  // Set ML to ready state before rendering (setReady only, no reset)
  act(() => {
    useMLStore.getState().setReady();
  });
  const { unmount } = render(<App />);
  // Wait for and dismiss the intro screen by clicking START SIMULATION
  const startButton = await screen.findByText('START SIMULATION');
  fireEvent.click(startButton);
  return { unmount };
}

describe('App', () => {
  const defaultAudienceMix = AUDIENCES.reduce<Record<string, number>>(
    (acc, audience) => {
      acc[audience.id] = 100 / AUDIENCES.length;
      return acc;
    },
    {}
  );

  beforeEach(() => {
    // Reset ML store first
    useMLStore.getState().reset();
    // Reset config store
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
  });

  afterEach(() => {
    useConfigStore.persist?.clearStorage();
    useMLStore.getState().reset();
  });

  it('renders the shell container', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });

  it('renders intro screen when ML is ready', async () => {
    act(() => {
      useMLStore.getState().setReady();
    });
    render(<App />);
    // App shell should still exist
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
    // Should show intro, not loading
    expect(screen.queryByTestId('bios-loading')).not.toBeInTheDocument();
    expect(await screen.findByTestId('bios-intro')).toBeInTheDocument();
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

  it('uses CRT void surfaces for the arena shell', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(screen.getByTestId('app-shell')).toHaveClass('bg-crt-void');
    expect(screen.getByTestId('chapter-canvas')).toHaveClass('bg-crt-void/90');
  });

  it('renders timeline above the chapter canvas', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    const timeline = screen.getByTestId('timeline');
    const chapterCanvas = screen.getByTestId('chapter-canvas');
    const position = timeline.compareDocumentPosition(chapterCanvas);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('marks chapter canvas as fixed proportion', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-proportion',
      'fixed'
    );
  });

  it('marks chapter canvas as viewport-fit', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-viewport-fit',
      'true'
    );
  });

  it('marks chapter canvas as fill-height', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-fill-height',
      'true'
    );
  });

  it('marks chapter canvas as compact for chapter 3+', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    fireEvent.click(screen.getByTestId('chapter-marker-3'));
    expect(screen.getByTestId('chapter-canvas')).toHaveAttribute(
      'data-compact',
      'true'
    );
  });

  it('shows loadout chapter when simulation not started', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(await screen.findByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(await screen.findByTestId('config-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('mission-report')).not.toBeInTheDocument();
  });

  it('hides the side panel when simulation is idle', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    expect(screen.queryByTestId('function-panel')).not.toBeInTheDocument();
  });

  it('shows chapter 0 with config panel when model ready and simulation not started', async () => {
    act(() => { useMLStore.getState().setReady(); });
    render(<App />);
    fireEvent.click(await screen.findByText('START SIMULATION'));
    // Should show chapter 0 (Mission Prep) with config panel
    expect(await screen.findByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
    // MissionReport is not used in App, should never appear
    expect(screen.queryByTestId('mission-report')).not.toBeInTheDocument();
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

  it('shows intro screen when ML status is ready, then chapter-0 after dismissing', async () => {
    useMLStore.getState().setReady();
    render(<App />);
    // First, intro screen should be visible
    expect(screen.getByTestId('bios-intro')).toBeInTheDocument();
    expect(screen.queryByTestId('bios-loading')).not.toBeInTheDocument();
    // Dismiss intro
    fireEvent.click(screen.getByText('START SIMULATION'));
    // Now chapter-0 should be visible
    expect(await screen.findByTestId('chapter-0-scene')).toBeInTheDocument();
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
