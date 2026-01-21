export type SampleTweet = {
  id: string;
  text: string;
  persona: string[];
  category: string;
  expectedEngagement: string;
};

export const SAMPLE_TWEETS: SampleTweet[] = [
  {
    id: 'sample-1',
    text:
      'Just tried the new Claude API and wow, the tool use is incredible. Building something cool with it.',
    persona: ['tech-founder', 'software-engineer', 'ai-researcher'],
    category: 'product',
    expectedEngagement: 'high'
  },
  {
    id: 'sample-2',
    text: 'We hit $1M ARR today. Bootstrapped. No VC. Just me and 2 engineers. AMA.',
    persona: ['indie-hacker', 'tech-founder'],
    category: 'milestone',
    expectedEngagement: 'very-high'
  },
  {
    id: 'sample-3',
    text: 'Unpopular opinion: Dark mode is overrated and often hurts readability.',
    persona: ['designer', 'product-manager'],
    category: 'hot-take',
    expectedEngagement: 'high'
  },
  {
    id: 'sample-4',
    text:
      'The best advice I got from my investor: Your job is to not run out of money. Everything else is secondary.',
    persona: ['tech-founder', 'venture-capitalist'],
    category: 'advice',
    expectedEngagement: 'high'
  },
  {
    id: 'sample-5',
    text:
      'Explaining a complex topic using only diagrams. No jargon. Thread incoming.',
    persona: ['educator', 'ai-researcher'],
    category: 'educational',
    expectedEngagement: 'very-high'
  }
];
