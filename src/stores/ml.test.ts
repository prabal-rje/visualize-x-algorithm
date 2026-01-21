import { describe, expect, it, beforeEach } from 'vitest';
import { useMLStore } from './ml';

describe('ML store', () => {
  beforeEach(() => {
    useMLStore.getState().reset();
  });

  it('starts in idle state', () => {
    const state = useMLStore.getState();
    expect(state.status).toBe('idle');
    expect(state.progress).toBe(0);
    expect(state.currentStep).toBeNull();
    expect(state.error).toBeNull();
  });

  it('setLoading transitions to loading with currentStep', () => {
    const { setLoading } = useMLStore.getState();
    setLoading('Initializing model');
    const state = useMLStore.getState();
    expect(state.status).toBe('loading');
    expect(state.currentStep).toBe('Initializing model');
  });

  it('setProgress updates progress value', () => {
    const { setLoading, setProgress } = useMLStore.getState();
    setLoading('Loading weights');
    setProgress(0.5);
    expect(useMLStore.getState().progress).toBe(0.5);
  });

  it('setProgress clamps value to 0-1 range', () => {
    const { setLoading, setProgress } = useMLStore.getState();
    setLoading('Loading');

    setProgress(-0.5);
    expect(useMLStore.getState().progress).toBe(0);

    setProgress(1.5);
    expect(useMLStore.getState().progress).toBe(1);
  });

  it('setReady sets status to ready and progress to 1', () => {
    const { setLoading, setProgress, setReady } = useMLStore.getState();
    setLoading('Loading');
    setProgress(0.8);
    setReady();
    const state = useMLStore.getState();
    expect(state.status).toBe('ready');
    expect(state.progress).toBe(1);
  });

  it('setError sets status to error with message', () => {
    const { setLoading, setError } = useMLStore.getState();
    setLoading('Loading');
    setError('Failed to load model');
    const state = useMLStore.getState();
    expect(state.status).toBe('error');
    expect(state.error).toBe('Failed to load model');
  });

  it('reset returns to initial state', () => {
    const { setLoading, setProgress, setError, reset } = useMLStore.getState();
    setLoading('Loading');
    setProgress(0.5);
    setError('Some error');

    reset();

    const state = useMLStore.getState();
    expect(state.status).toBe('idle');
    expect(state.progress).toBe(0);
    expect(state.currentStep).toBeNull();
    expect(state.error).toBeNull();
  });
});
