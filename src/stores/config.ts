import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUDIENCES } from '../data/audiences';
import { PERSONAS } from '../data/personas';
import { SAMPLE_TWEETS } from '../data/tweets';
import { simulateEngagement, type SimulationResult } from '../simulation/simulate';
import { computeRPGStats, type RPGStats } from '../utils/rpgStats';
import type { Persona } from '../data/personas';

type PersonaId = Persona['id'];
type AudienceId = (typeof AUDIENCES)[number]['id'];
type AudienceMix = Record<AudienceId, number>;

type ConfigState = {
  expertMode: boolean;
  personaId: PersonaId;
  tweetText: string;
  sampleTweetId: string | null;
  audienceMix: AudienceMix;
  simulationStarted: boolean;
  simulationResult: SimulationResult | null;
  rpgStats: RPGStats | null;
  setExpertMode: (value: boolean) => void;
  setPersonaId: (id: PersonaId) => void;
  setTweetText: (text: string) => void;
  selectSampleTweet: (id: string) => void;
  shuffleSampleTweet: () => void;
  setAudienceMix: (mix: AudienceMix) => void;
  setAudienceMixValue: (id: AudienceId, value: number) => void;
  beginSimulation: () => void;
  resetSimulation: () => void;
};

const defaultPersonaId: PersonaId = PERSONAS[0]?.id ?? 'tech-founder';
const defaultSampleTweet = SAMPLE_TWEETS[0];
const audienceDefault = 100 / AUDIENCES.length;
const defaultAudienceMix = AUDIENCES.reduce((acc, audience) => {
  acc[audience.id] = Number(audienceDefault.toFixed(2));
  return acc;
}, {} as AudienceMix);

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      expertMode: false,
      personaId: defaultPersonaId,
      tweetText: defaultSampleTweet?.text ?? '',
      sampleTweetId: defaultSampleTweet?.id ?? null,
      audienceMix: defaultAudienceMix,
      simulationStarted: false,
      simulationResult: null,
      rpgStats: null,
      setExpertMode: (value) => set({ expertMode: value }),
      setPersonaId: (personaId) => set({ personaId }),
      setTweetText: (text) => set({ tweetText: text, sampleTweetId: null }),
      selectSampleTweet: (id) => {
        const sample = SAMPLE_TWEETS.find((item) => item.id === id);
        set({
          sampleTweetId: id,
          tweetText: sample?.text ?? ''
        });
      },
      shuffleSampleTweet: () => {
        const index = Math.floor(Math.random() * SAMPLE_TWEETS.length);
        const sample = SAMPLE_TWEETS[index];
        if (!sample) return;
        set({ sampleTweetId: sample.id, tweetText: sample.text });
      },
      setAudienceMix: (mix) => set({ audienceMix: mix }),
      setAudienceMixValue: (id, value) => {
        const clamped = Math.max(0, Math.min(100, value));
        set((state) => ({
          audienceMix: { ...state.audienceMix, [id]: clamped }
        }));
      },
      beginSimulation: () =>
        set((state) => {
          const simulationResult = simulateEngagement({
            personaId: state.personaId,
            tweetText: state.tweetText,
            audienceMix: state.audienceMix
          });
          return {
            simulationStarted: true,
            simulationResult,
            rpgStats: computeRPGStats(simulationResult)
          };
        }),
      resetSimulation: () =>
        set({ simulationStarted: false, simulationResult: null, rpgStats: null })
    }),
    {
      name: 'x-algorithm-config',
      partialize: (state) => ({
        expertMode: state.expertMode,
        personaId: state.personaId,
        tweetText: state.tweetText,
        sampleTweetId: state.sampleTweetId,
        audienceMix: state.audienceMix
      })
    }
  )
);
