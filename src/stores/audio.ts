import { create } from 'zustand';

type AudioState = {
  enabled: boolean;
  muted: boolean;
  setEnabled: (enabled: boolean) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
};

export function getDefaultAudioState(isMobile: boolean): Pick<AudioState, 'enabled' | 'muted'> {
  return {
    enabled: !isMobile,
    muted: true
  };
}

function detectMobile(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(max-width: 900px)').matches;
}

const defaults = getDefaultAudioState(detectMobile());

export const useAudioStore = create<AudioState>((set) => ({
  enabled: defaults.enabled,
  muted: defaults.muted,
  setEnabled: (enabled) => set({ enabled, muted: !enabled }),
  setMuted: (muted) =>
    set((state) => ({
      muted,
      enabled: state.enabled || !muted
    })),
  toggleMute: () =>
    set((state) => {
      const nextMuted = !state.muted;
      return {
        muted: nextMuted,
        enabled: state.enabled || !nextMuted
      };
    })
}));
