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
      expertMode: false,
      personaId: 'tech-founder',
      tweetText: SAMPLE_TWEETS[0]?.text ?? '',
      sampleTweetId: SAMPLE_TWEETS[0]?.id ?? null,
      audienceMix: defaultAudienceMix,
      simulationStarted: false,
      simulationResult: null,
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
    vi.restoreAllMocks();
  });

  it('steps from persona to audience to tweet in order', () => {
    render(<ConfigPanel />);
    expect(screen.getByLabelText('Expert Mode')).toBeInTheDocument();
    expect(screen.getByText('Tech Founder')).toBeInTheDocument();
    expect(
      screen.getByText('Building the future, one pivot at a time')
    ).toHaveClass(styles.personaSubtitleLarge);
    expect(screen.getByTestId('step-persona')).toBeInTheDocument();
    expect(screen.queryByTestId('step-audience')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-tweet')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    expect(screen.getByTestId('step-audience')).toBeInTheDocument();
    expect(screen.getByTestId('audience-slider-tech')).toBeInTheDocument();
    expect(screen.queryByTestId('step-persona')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue to tweet/i }));
    expect(screen.getByTestId('step-tweet')).toBeInTheDocument();
    expect(screen.getByTestId('tweet-input')).toBeInTheDocument();
    expect(screen.getByTestId('tweet-input')).toHaveClass(
      styles.tweetInputLarge
    );
    expect(screen.getByTestId('tweet-counter')).toBeInTheDocument();
    expect(screen.getByTestId('sample-shuffle')).toBeInTheDocument();
    const shufflePath = screen
      .getByTestId('sample-shuffle')
      .querySelector('path') as SVGPathElement;
    expect(shufflePath).toHaveAttribute(
      'd',
      'M3 5h4l2 2 2-2h6M15 3l2 2-2 2M3 15h4l2-2 2 2h6M15 13l2 2-2 2'
    );
    expect(screen.getByTestId('begin-simulation')).toBeInTheDocument();
    expect(screen.queryByTestId('sample-select')).not.toBeInTheDocument();
  });

  it('preloads a tweet and shuffles samples', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    render(<ConfigPanel />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue to tweet/i }));
    expect(screen.getByTestId('tweet-input')).toHaveValue(
      SAMPLE_TWEETS[0].text
    );
    fireEvent.click(screen.getByTestId('sample-shuffle'));
    expect(screen.getByTestId('tweet-input')).toHaveValue(
      SAMPLE_TWEETS.at(-1)?.text
    );
  });

  it('starts simulation on begin button', () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue to tweet/i }));
    fireEvent.click(screen.getByTestId('begin-simulation'));
    expect(useConfigStore.getState().simulationStarted).toBe(true);
  });

  it('shows a unicode checkmark for expert mode', () => {
    render(<ConfigPanel />);
    const checkmark = screen.getByTestId('expert-check');
    expect(checkmark).toHaveTextContent('☐');
    fireEvent.click(screen.getByLabelText('Expert Mode'));
    expect(checkmark).toHaveTextContent('☑');
  });
});
