import { describe, expect, it } from 'vitest';
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
});
