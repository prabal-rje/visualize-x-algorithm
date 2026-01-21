/**
 * Simulated tweet pool generator.
 * Generates tweet candidates with varied content and real embeddings
 * for testing and demonstration of the X algorithm visualizer.
 */

import { getEmbedding } from './embeddings';

/**
 * A tweet candidate in the simulated pool.
 */
export type TweetCandidate = {
  id: string;
  text: string;
  author: string;
  embedding: number[];
  category: string;
  timestamp: number;
};

/**
 * Predefined list of simulated authors.
 */
const AUTHORS = [
  '@techfounder',
  '@devguru',
  '@startuplife',
  '@airesearcher',
  '@newsreporter',
  '@breakingnews',
  '@worldevents',
  '@politicswatcher',
  '@moviecritic',
  '@musiclover',
  '@celebwatcher',
  '@streamingfan',
  '@comedywriter',
  '@memepage',
  '@funnymoments',
  '@jokemaster',
  '@businessinsider',
  '@marketwatch',
  '@financeexpert',
  '@stocktrader',
] as const;

/**
 * Tweet templates organized by category.
 * Placeholders in {braces} will be replaced with random values.
 */
const TWEET_TEMPLATES: Record<string, string[]> = {
  tech: [
    'Just shipped a new feature using {tech}. The DX is incredible!',
    'Been playing with {tech} all weekend. Game changer for developer productivity.',
    'Hot take: {tech} will replace {tech2} within 5 years.',
    'Finally migrated our codebase to {tech}. No regrets.',
    'The {tech} community is so welcoming. Just got my first PR merged!',
    'Debugging {tech} at 3am. Living the dream.',
    'TIL about this amazing {tech} feature. Mind = blown.',
    '{tech} + {tech2} = the perfect stack for 2024.',
  ],
  news: [
    'Breaking: Major developments in {topic} today.',
    'JUST IN: {topic} situation escalates.',
    'Latest update on {topic} - here is what we know so far.',
    'Developing story: {topic} takes unexpected turn.',
    'Sources confirm major announcement regarding {topic}.',
    'Timeline of events in {topic} situation.',
  ],
  entertainment: [
    'Can not stop thinking about {show}. What an ending!',
    'Just finished {show} and I am emotionally destroyed.',
    '{movie} deserves all the awards. Incredible cinematography.',
    'The soundtrack for {show} is absolutely phenomenal.',
    'Hot take: {movie} is actually underrated.',
    'Anyone else obsessed with {show} right now?',
  ],
  humor: [
    'POV: You are debugging at 3am',
    'Me: I will just write a quick script\n*6 hours later*',
    'Programmers be like: it works on my machine',
    'My code: *works perfectly in dev*\nProduction: no',
    'Stack Overflow: *closes question as duplicate*\nMe: but...',
    "That feeling when git blame shows it was you all along",
    'Code review: can you add some comments?\nMe: // magic happens here',
  ],
  business: [
    'Q4 earnings looking strong. {company} up 15% this quarter.',
    'Market analysis: Why {industry} is poised for growth.',
    'Leadership lesson: The importance of {concept} in modern business.',
    '{company} announces major expansion into {industry}.',
    'The future of {industry} is here. Key trends to watch.',
    'Interesting moves in the {industry} space today.',
  ],
};

/**
 * Placeholder values for template substitution.
 */
const PLACEHOLDERS: Record<string, string[]> = {
  tech: ['React', 'TypeScript', 'Rust', 'Go', 'Python', 'Node.js', 'Svelte', 'Vue', 'Next.js', 'Bun'],
  tech2: ['JavaScript', 'Java', 'C++', 'PHP', 'Ruby', 'Angular', 'jQuery', 'Webpack'],
  topic: ['climate policy', 'tech regulation', 'economic reform', 'international relations', 'healthcare'],
  show: ['The Bear', 'Severance', 'Succession', 'White Lotus', 'House of the Dragon'],
  movie: ['Oppenheimer', 'Barbie', 'Dune Part Two', 'Poor Things', 'The Holdovers'],
  company: ['Apple', 'Microsoft', 'Amazon', 'Tesla', 'Google', 'Meta', 'Nvidia'],
  industry: ['AI', 'fintech', 'biotech', 'clean energy', 'e-commerce', 'cybersecurity'],
  concept: ['transparency', 'agile methodologies', 'remote work', 'work-life balance', 'innovation'],
};

/**
 * Categories available for tweet generation.
 */
const CATEGORIES = Object.keys(TWEET_TEMPLATES);

/**
 * Generate a unique ID for a tweet.
 */
function generateId(index: number): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `tweet_${timestamp}_${random}_${index}`;
}

/**
 * Get a random element from an array.
 */
function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random timestamp within the last 24 hours.
 */
function randomTimestamp(): number {
  const now = Date.now();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  return now - Math.floor(Math.random() * twentyFourHoursMs);
}

/**
 * Fill in placeholders in a tweet template.
 */
function fillTemplate(template: string): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const values = PLACEHOLDERS[key];
    if (!values) return `{${key}}`;
    return randomElement(values);
  });
}

/**
 * Generate a single tweet text for a given category.
 */
function generateTweetText(category: string): string {
  const templates = TWEET_TEMPLATES[category];
  if (!templates || templates.length === 0) {
    return 'This is a sample tweet.';
  }
  const template = randomElement(templates);
  return fillTemplate(template);
}

/**
 * Generate a pool of simulated tweets with real embeddings.
 * @param count Number of tweets to generate
 * @returns Array of tweet candidates with embeddings
 */
export async function generateTweetPool(count: number): Promise<TweetCandidate[]> {
  if (count <= 0) {
    return [];
  }

  // Generate tweet metadata first
  const tweetData: Array<{ id: string; text: string; author: string; category: string; timestamp: number }> = [];

  for (let i = 0; i < count; i++) {
    // Distribute categories evenly-ish with some randomness
    const category = CATEGORIES[i % CATEGORIES.length];
    const text = generateTweetText(category);
    const author = randomElement(AUTHORS);
    const timestamp = randomTimestamp();
    const id = generateId(i);

    tweetData.push({ id, text, author, category, timestamp });
  }

  // Compute embeddings in parallel
  const embeddings = await Promise.all(tweetData.map((tweet) => getEmbedding(tweet.text)));

  // Combine metadata with embeddings
  return tweetData.map((tweet, index) => ({
    ...tweet,
    embedding: embeddings[index],
  }));
}
