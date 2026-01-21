import { AUDIENCES } from '../data/audiences';
import { PERSONAS } from '../data/personas';
import { estimateBernoulliMLE } from './mle';

type PersonaId = (typeof PERSONAS)[number]['id'];
type AudienceId = (typeof AUDIENCES)[number]['id'];
type AudienceMix = Record<AudienceId, number>;

export type EngagementCounts = {
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
  clicks: number;
};

export type EngagementRates = {
  likeRate: number;
  repostRate: number;
  replyRate: number;
  bookmarkRate: number;
  clickRate: number;
};

export type SimulationResult = {
  counts: EngagementCounts;
  rates: EngagementRates;
};

const MAX_TWEET_LENGTH = 280;
const TECH_AUDIENCE_IDS: AudienceId[] = [
  'tech',
  'founders',
  'investors',
  'students'
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toCount = (impressions: number, rate: number) =>
  Math.min(impressions, Math.max(0, Math.round(impressions * rate)));

export const simulateEngagement = (input: {
  personaId: PersonaId;
  tweetText: string;
  audienceMix: AudienceMix;
}): SimulationResult => {
  const { personaId, tweetText, audienceMix } = input;
  const persona = PERSONAS.find((item) => item.id === personaId);
  const botsShare = clamp(audienceMix.bots ?? 0, 0, 100) / 100;
  const activeShare = 1 - botsShare;
  const technicalShare =
    TECH_AUDIENCE_IDS.reduce(
      (acc, id) => acc + (audienceMix[id] ?? 0),
      0
    ) / 100;
  const personaAffinity = persona?.technical
    ? 0.9 + technicalShare * 0.4
    : 0.9 + (1 - technicalShare) * 0.4;
  const lengthFactor =
    0.85 + clamp(tweetText.length / MAX_TWEET_LENGTH, 0, 1) * 0.4;
  const activeFactor = 0.8 + activeShare * 0.4;
  const engagementFactor = clamp(
    lengthFactor * personaAffinity * activeFactor,
    0.6,
    1.6
  );

  const impressions = Math.max(
    120,
    Math.round(420 + tweetText.length * 4 + activeShare * 900)
  );

  const counts: EngagementCounts = {
    impressions,
    likes: toCount(impressions, 0.06 * engagementFactor),
    reposts: toCount(impressions, 0.012 * engagementFactor),
    replies: toCount(impressions, 0.006 * engagementFactor),
    bookmarks: toCount(impressions, 0.01 * engagementFactor),
    clicks: toCount(impressions, 0.02 * engagementFactor)
  };

  const rates: EngagementRates = {
    likeRate: estimateBernoulliMLE(counts.likes, impressions),
    repostRate: estimateBernoulliMLE(counts.reposts, impressions),
    replyRate: estimateBernoulliMLE(counts.replies, impressions),
    bookmarkRate: estimateBernoulliMLE(counts.bookmarks, impressions),
    clickRate: estimateBernoulliMLE(counts.clicks, impressions)
  };

  return { counts, rates };
};
