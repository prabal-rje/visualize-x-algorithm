import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { SAMPLE_TWEETS } from '../data/tweets';
import { useConfigStore } from './config';

describe('config store', () => {
  it('toggles expert mode', () => {
    const { setExpertMode } = useConfigStore.getState();
    expect(useConfigStore.getState().expertMode).toBe(false);
    setExpertMode(true);
    expect(useConfigStore.getState().expertMode).toBe(true);
  });

  it('sets the active persona', () => {
    const { setPersonaId } = useConfigStore.getState();
    setPersonaId('tech-founder');
    expect(useConfigStore.getState().personaId).toBe('tech-founder');
  });

  it('initializes audience mix for all audiences', () => {
    const { audienceMix } = useConfigStore.getState();
    expect(Object.keys(audienceMix)).toHaveLength(AUDIENCES.length);
  });

  it('updates tweet text and sample selection', () => {
    const { setTweetText, selectSampleTweet } = useConfigStore.getState();
    setTweetText('hello');
    expect(useConfigStore.getState().tweetText).toBe('hello');
    selectSampleTweet(SAMPLE_TWEETS[0].id);
    expect(useConfigStore.getState().sampleTweetId).toBe(SAMPLE_TWEETS[0].id);
  });

  it('toggles simulation started', () => {
    const { beginSimulation, resetSimulation } = useConfigStore.getState();
    beginSimulation();
    expect(useConfigStore.getState().simulationStarted).toBe(true);
    resetSimulation();
    expect(useConfigStore.getState().simulationStarted).toBe(false);
  });

  it('computes a simulation result on begin', () => {
    useConfigStore.setState({
      personaId: 'tech-founder',
      tweetText: 'demo',
      simulationStarted: false,
      simulationResult: null
    });
    useConfigStore.getState().beginSimulation();
    const result = useConfigStore.getState().simulationResult;
    expect(result).not.toBeNull();
    expect(result?.rates.likeRate).toBeCloseTo(
      (result?.counts.likes ?? 0) / (result?.counts.impressions ?? 1)
    );
  });
});
