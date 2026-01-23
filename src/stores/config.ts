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

// Semantic mapping: which audience best matches each persona
const PERSONA_PRIMARY_AUDIENCE: Record<PersonaId, AudienceId> = {
  'tech-founder': 'founders',
  'software-engineer': 'tech',
  'ai-researcher': 'tech',
  'venture-capitalist': 'investors',
  'cs-student': 'students',
  'tech-reporter': 'news',
  'product-manager': 'tech',
  'tech-executive': 'founders',
  'content-creator': 'creators',
  'indie-hacker': 'founders',
  'designer': 'creators',
  'data-scientist': 'tech',
  'cybersecurity-pro': 'tech',
  'consultant': 'investors',
  'marketer': 'creators',
  'educator': 'students'
};

// Generate audience mix weighted toward the persona's primary audience
function getAudienceMixForPersona(personaId: PersonaId): AudienceMix {
  const primaryAudience = PERSONA_PRIMARY_AUDIENCE[personaId] ?? 'tech';
  const mix = {} as AudienceMix;

  // Primary audience gets 75%, rest 25% split evenly among others
  const primaryShare = 75;
  const otherShare = (100 - primaryShare) / (AUDIENCES.length - 1);

  for (const audience of AUDIENCES) {
    mix[audience.id] = audience.id === primaryAudience
      ? primaryShare
      : Number(otherShare.toFixed(1));
  }

  return mix;
}

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
const defaultAudienceMix = getAudienceMixForPersona(defaultPersonaId);

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
      setPersonaId: (personaId) => set({
        personaId,
        audienceMix: getAudienceMixForPersona(personaId)
      }),
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
