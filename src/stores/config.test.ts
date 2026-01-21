import { describe, expect, it } from 'vitest';
import { AUDIENCES } from '../data/audiences';
import { SAMPLE_TWEETS } from '../data/tweets';
import { estimateBernoulliMLE } from '../simulation/mle';
import { computeRPGStats } from '../utils/rpgStats';
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
    expect(useConfigStore.getState().simulationResult).not.toBeNull();
    resetSimulation();
    expect(useConfigStore.getState().simulationStarted).toBe(false);
    expect(useConfigStore.getState().simulationResult).toBeNull();
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
      estimateBernoulliMLE(
        result?.counts.likes ?? 0,
        result?.counts.impressions ?? 0
      ),
      6
    );
  });

  it('computes rpgStats when simulation begins', () => {
    useConfigStore.setState({
      personaId: 'tech-founder',
      tweetText: 'demo',
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null
    });
    useConfigStore.getState().beginSimulation();
    const { simulationResult, rpgStats } = useConfigStore.getState();
    expect(rpgStats).not.toBeNull();
    expect(simulationResult).not.toBeNull();
    // Verify rpgStats matches what computeRPGStats would produce
    const expectedStats = computeRPGStats(simulationResult!);
    expect(rpgStats?.reach).toBe(expectedStats.reach);
    expect(rpgStats?.resonance).toBeCloseTo(expectedStats.resonance, 6);
    expect(rpgStats?.momentum).toBeCloseTo(expectedStats.momentum, 6);
    expect(rpgStats?.percentile).toBeCloseTo(expectedStats.percentile, 6);
  });

  it('clears rpgStats on reset', () => {
    useConfigStore.setState({
      personaId: 'tech-founder',
      tweetText: 'demo',
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null
    });
    useConfigStore.getState().beginSimulation();
    expect(useConfigStore.getState().rpgStats).not.toBeNull();
    useConfigStore.getState().resetSimulation();
    expect(useConfigStore.getState().rpgStats).toBeNull();
  });
});
