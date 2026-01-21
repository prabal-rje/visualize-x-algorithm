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

  it('steps from persona to audience to tweet in order', () => {
    render(<ConfigPanel />);
    expect(screen.queryByLabelText('Expert Mode')).not.toBeInTheDocument();
    expect(screen.getByText('Tech Founder')).toBeInTheDocument();
    expect(
      screen.getByText('Building the future, one pivot at a time')
    ).toHaveClass(styles.personaSubtitleLarge);
    expect(screen.getByTestId('step-persona')).toBeInTheDocument();
    expect(screen.queryByTestId('step-audience')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-tweet')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    expect(screen.getByTestId('step-audience')).toBeInTheDocument();
    expect(screen.getByTestId('audience-chip-tech')).toBeInTheDocument();
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

  it('shows defaults toast when advancing without explicit choices', () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    expect(
      screen.getByText(/Using defaults: AI\/ML Researcher persona/i)
    ).toBeInTheDocument();
  });

  it('toggles audience selections via multi-select chips', () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    const chip = screen.getByTestId('audience-chip-tech');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks persona grid as mobile layout when viewport is small', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width: 900px'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    render(<ConfigPanel />);
    expect(screen.getByTestId('persona-grid')).toHaveAttribute(
      'data-layout',
      'mobile'
    );

    window.matchMedia = originalMatchMedia;
  });

  it('renders persona icons', () => {
    render(<ConfigPanel />);
    expect(screen.getAllByTestId('persona-icon').length).toBeGreaterThan(0);
  });

  it('starts simulation on begin button', () => {
    render(<ConfigPanel />);
    fireEvent.click(screen.getByRole('button', { name: /continue to audience/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue to tweet/i }));
    fireEvent.click(screen.getByTestId('begin-simulation'));
    expect(useConfigStore.getState().simulationStarted).toBe(true);
  });

  it('does not render expert mode toggle', () => {
    render(<ConfigPanel />);
    expect(screen.queryByTestId('expert-check')).not.toBeInTheDocument();
  });
});
