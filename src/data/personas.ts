const PERSONA_BASE = [
  {
    id: 'tech-founder',
    name: 'Tech Founder',
    icon: 'rocket',
    subtitle: 'Building the future, one pivot at a time'
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: 'laptop',
    subtitle: 'Shipping code, breaking prod'
  },
  {
    id: 'ai-researcher',
    name: 'AI/ML Researcher',
    icon: 'brain',
    subtitle: 'Pushing the boundaries of intelligence'
  },
  {
    id: 'venture-capitalist',
    name: 'VC / Investor',
    icon: 'cash',
    subtitle: 'Funding the future'
  },
  {
    id: 'cs-student',
    name: 'CS Student',
    icon: 'cap',
    subtitle: 'Learning to build the future'
  },
  {
    id: 'tech-reporter',
    name: 'Tech Reporter',
    icon: 'news',
    subtitle: 'Breaking the stories that matter'
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    icon: 'chart',
    subtitle: 'Shipping features, managing roadmaps'
  },
  {
    id: 'tech-executive',
    name: 'Tech Executive',
    icon: 'tie',
    subtitle: 'Leading teams, driving strategy'
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    icon: 'camera',
    subtitle: 'Building an audience, one post at a time'
  },
  {
    id: 'indie-hacker',
    name: 'Indie Hacker',
    icon: 'tools',
    subtitle: 'Building in public, shipping fast'
  },
  {
    id: 'designer',
    name: 'Designer',
    icon: 'palette',
    subtitle: 'Crafting experiences, pixel by pixel'
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: 'chart-up',
    subtitle: 'Finding signal in the noise'
  },
  {
    id: 'cybersecurity-pro',
    name: 'Security Professional',
    icon: 'lock',
    subtitle: 'Defending the digital frontier'
  },
  {
    id: 'consultant',
    name: 'Management Consultant',
    icon: 'briefcase',
    subtitle: 'Solving problems, building slides'
  },
  {
    id: 'marketer',
    name: 'Marketing Professional',
    icon: 'megaphone',
    subtitle: 'Growing brands, driving conversions'
  },
  {
    id: 'educator',
    name: 'Educator / Course Creator',
    icon: 'book',
    subtitle: 'Teaching the skills that matter'
  }
] as const;

type PersonaBase = (typeof PERSONA_BASE)[number];

const TECHNICAL_PERSONA_IDS: ReadonlySet<PersonaBase['id']> = new Set([
  'tech-founder',
  'software-engineer',
  'ai-researcher',
  'cs-student',
  'indie-hacker',
  'data-scientist',
  'cybersecurity-pro'
]);

export type Persona = PersonaBase & { technical: boolean };

export const PERSONAS: Persona[] = PERSONA_BASE.map((persona) => ({
  ...persona,
  technical: TECHNICAL_PERSONA_IDS.has(persona.id)
}));
