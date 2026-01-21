import { describe, expect, it } from 'vitest';
import { getDefaultAudioState } from './audio';

describe('audio store', () => {
  it('defaults to muted on mobile', () => {
    const state = getDefaultAudioState(true);
    expect(state.enabled).toBe(false);
    expect(state.muted).toBe(true);
  });
});
