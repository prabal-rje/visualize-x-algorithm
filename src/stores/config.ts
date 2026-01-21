import { create } from 'zustand';
import { PERSONAS } from '../data/personas';
import type { Persona } from '../data/personas';

type PersonaId = Persona['id'];

type ConfigState = {
  expertMode: boolean;
  personaId: PersonaId;
  setExpertMode: (value: boolean) => void;
  setPersonaId: (id: PersonaId) => void;
};

const defaultPersonaId: PersonaId = PERSONAS[0]?.id ?? 'tech-founder';

export const useConfigStore = create<ConfigState>((set) => ({
  expertMode: false,
  personaId: defaultPersonaId,
  setExpertMode: (value) => set({ expertMode: value }),
  setPersonaId: (personaId) => set({ personaId })
}));
