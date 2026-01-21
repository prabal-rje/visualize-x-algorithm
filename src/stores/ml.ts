import { create } from 'zustand';

export type MLStatus = 'idle' | 'loading' | 'ready' | 'error';

type MLState = {
  status: MLStatus;
  progress: number;
  currentStep: string | null;
  error: string | null;
  setLoading: (step: string) => void;
  setProgress: (value: number) => void;
  setReady: () => void;
  setError: (message: string) => void;
  reset: () => void;
};

const initialState = {
  status: 'idle' as MLStatus,
  progress: 0,
  currentStep: null as string | null,
  error: null as string | null
};

export const useMLStore = create<MLState>()((set) => ({
  ...initialState,
  setLoading: (step: string) => set({ status: 'loading', currentStep: step }),
  setProgress: (value: number) => set({ progress: Math.max(0, Math.min(1, value)) }),
  setReady: () => set({ status: 'ready', progress: 1 }),
  setError: (message: string) => set({ status: 'error', error: message }),
  reset: () => set(initialState)
}));
