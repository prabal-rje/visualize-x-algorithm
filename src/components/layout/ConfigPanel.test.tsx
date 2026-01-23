import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUDIENCES } from '../../data/audiences';
import { SAMPLE_TWEETS } from '../../data/tweets';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/config-panel.module.css';
import ConfigPanel from './ConfigPanel';

describe('ConfigPanel', () => {
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
      personaId: 'tech-founder',
      tweetText: SAMPLE_TWEETS[0]?.text ?? '',
      sampleTweetId: SAMPLE_TWEETS[0]?.id ?? null,
      audienceMix: defaultAudienceMix,
      simulationStarted: false,
      simulationResult: null,
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
    vi.restoreAllMocks();
  });

  it('renders persona step when currentStep is 0', () => {
    render(<ConfigPanel currentStep={0} />);
    expect(screen.getByTestId('step-persona')).toBeInTheDocument();
    expect(screen.getByText('Tech Founder')).toBeInTheDocument();
    expect(
      screen.getByText('Building the future, one pivot at a time')
    ).toHaveClass(styles.personaSubtitleLarge);
    expect(screen.queryByTestId('step-audience')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-tweet')).not.toBeInTheDocument();
  });

  it('renders audience step when currentStep is 1', () => {
    render(<ConfigPanel currentStep={1} />);
    expect(screen.getByTestId('step-audience')).toBeInTheDocument();
    expect(screen.queryByTestId('step-persona')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-tweet')).not.toBeInTheDocument();
  });

  it('renders tweet step when currentStep is 2', () => {
    render(<ConfigPanel currentStep={2} />);
    expect(screen.getByTestId('step-tweet')).toBeInTheDocument();
    expect(screen.getByTestId('tweet-input')).toBeInTheDocument();
    expect(screen.getByTestId('tweet-input')).toHaveClass(
      styles.tweetInputLarge
    );
    expect(screen.getByTestId('tweet-counter')).toBeInTheDocument();
    expect(screen.getByTestId('sample-shuffle')).toBeInTheDocument();
    expect(screen.getByTestId('begin-simulation')).toBeInTheDocument();
    expect(screen.queryByTestId('step-persona')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-audience')).not.toBeInTheDocument();
  });

  it('calls onStepForward when continue button is clicked', () => {
    const onStepForward = vi.fn();
    render(<ConfigPanel currentStep={0} onStepForward={onStepForward} />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    expect(onStepForward).toHaveBeenCalledTimes(1);
  });

  it('calls onStepBack when back button is clicked', () => {
    const onStepBack = vi.fn();
    render(<ConfigPanel currentStep={1} onStepBack={onStepBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back to persona/i }));
    expect(onStepBack).toHaveBeenCalledTimes(1);
  });

  it('marks config panel as unframed', () => {
    render(<ConfigPanel currentStep={0} />);
    expect(screen.getByTestId('config-panel')).toHaveAttribute(
      'data-surface',
      'bare'
    );
  });

  it('preloads a tweet and shuffles samples', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    render(<ConfigPanel currentStep={2} />);
    expect(screen.getByTestId('tweet-input')).toHaveValue(
      SAMPLE_TWEETS[0].text
    );
    fireEvent.click(screen.getByTestId('sample-shuffle'));
    expect(screen.getByTestId('tweet-input')).toHaveValue(
      SAMPLE_TWEETS.at(-1)?.text
    );
  });

  it('toggles audience selections via multi-select chips on desktop', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    render(<ConfigPanel currentStep={1} />);
    const chip = screen.getByTestId('audience-chip-tech');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders persona icons on desktop', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    render(<ConfigPanel currentStep={0} />);
    expect(screen.getAllByTestId('persona-icon').length).toBeGreaterThan(0);
  });

  it('calls onBeginSimulation when begin button is clicked', () => {
    const onBeginSimulation = vi.fn();
    render(<ConfigPanel currentStep={2} onBeginSimulation={onBeginSimulation} />);
    fireEvent.click(screen.getByTestId('begin-simulation'));
    expect(onBeginSimulation).toHaveBeenCalledTimes(1);
  });

  it('does not render expert mode toggle', () => {
    render(<ConfigPanel currentStep={0} />);
    expect(screen.queryByTestId('expert-check')).not.toBeInTheDocument();
  });
});
