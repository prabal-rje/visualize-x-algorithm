export type FunctionStep = {
  id: string;
  name: string;
  file: string;
  summary: string;
  githubUrl: string;
};

export type SubChapter = {
  id: string;
  labelSimple: string;
  labelTechnical: string;
  functions: FunctionStep[];
};

export type Chapter = {
  id: string;
  number: number;
  labelSimple: string;
  labelTechnical: string;
  subChapters: SubChapter[];
};

const GITHUB_BASE = 'https://github.com/xai-org/x-algorithm/blob/main';

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch0',
    number: 0,
    labelSimple: 'Loadout',
    labelTechnical: 'Mission Prep',
    subChapters: [
      {
        id: 'ch0-a',
        labelSimple: 'Persona',
        labelTechnical: 'Persona Select',
        functions: [
          {
            id: 'ch0-a-1',
            name: 'MissionLoadout::select_persona()',
            file: 'client/mission_loadout.ts',
            summary: 'Selecting persona archetype and voice',
            githubUrl: `${GITHUB_BASE}/client/mission_loadout.ts`
          }
        ]
      },
      {
        id: 'ch0-b',
        labelSimple: 'Audience',
        labelTechnical: 'Audience Mix',
        functions: [
          {
            id: 'ch0-b-1',
            name: 'MissionLoadout::set_audience_mix()',
            file: 'client/mission_loadout.ts',
            summary: 'Balancing audience types for delivery',
            githubUrl: `${GITHUB_BASE}/client/mission_loadout.ts`
          }
        ]
      },
      {
        id: 'ch0-c',
        labelSimple: 'Tweet',
        labelTechnical: 'Draft Input',
        functions: [
          {
            id: 'ch0-c-1',
            name: 'MissionLoadout::draft_tweet()',
            file: 'client/mission_loadout.ts',
            summary: 'Drafting the tweet for simulation',
            githubUrl: `${GITHUB_BASE}/client/mission_loadout.ts`
          }
        ]
      }
    ]
  },
  {
    id: 'ch1',
    number: 1,
    labelSimple: 'Request',
    labelTechnical: 'gRPC Request',
    subChapters: [
      {
        id: 'ch1-a',
        labelSimple: 'Receive',
        labelTechnical: 'Request Handler',
        functions: [
          {
            id: 'ch1-a-1',
            name: 'get_scored_posts()',
            file: 'home-mixer/server.rs',
            summary: 'Receiving timeline request from client',
            githubUrl: `${GITHUB_BASE}/home-mixer/server.rs`
          }
        ]
      },
      {
        id: 'ch1-b',
        labelSimple: 'Hydrate',
        labelTechnical: 'Query Hydration',
        functions: [
          {
            id: 'ch1-b-1',
            name: 'UserActionSeqQueryHydrator::hydrate()',
            file: 'home-mixer/query_hydrators/user_action_seq_query_hydrator.rs',
            summary: 'Fetching user engagement history',
            githubUrl: `${GITHUB_BASE}/home-mixer/query_hydrators/user_action_seq_query_hydrator.rs`
          },
          {
            id: 'ch1-b-2',
            name: 'UserFeaturesQueryHydrator::hydrate()',
            file: 'home-mixer/query_hydrators/user_features_query_hydrator.rs',
            summary: 'Fetching user profile features',
            githubUrl: `${GITHUB_BASE}/home-mixer/query_hydrators/user_features_query_hydrator.rs`
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    number: 2,
    labelSimple: 'Gather',
    labelTechnical: 'Thunder/Phoenix',
    subChapters: [
      {
        id: 'ch2-a',
        labelSimple: 'Tokenize',
        labelTechnical: 'Tokenize Tweet',
        functions: [
          {
            id: 'ch2-a-1',
            name: 'TwoTowerModel.tokenize()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Splitting the tweet into sub-token pieces',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
          }
        ]
      },
      {
        id: 'ch2-b',
        labelSimple: 'Embeddings',
        labelTechnical: 'Token Embeddings',
        functions: [
          {
            id: 'ch2-b-1',
            name: 'TwoTowerModel.embed_tokens()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Embedding each token into latent vectors',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
          }
        ]
      },
      {
        id: 'ch2-c',
        labelSimple: 'Pooling',
        labelTechnical: 'Token Pooling',
        functions: [
          {
            id: 'ch2-c-1',
            name: 'TwoTowerModel.pool_tokens()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Pooling token vectors into a single embedding',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
          }
        ]
      },
      {
        id: 'ch2-d',
        labelSimple: 'Similarity',
        labelTechnical: 'Similarity Map',
        functions: [
          {
            id: 'ch2-d-1',
            name: 'approximate_nearest_neighbors()',
            file: 'phoenix/ann/approximate_nearest_neighbors.py',
            summary: 'Placing candidates around the user embedding',
            githubUrl: `${GITHUB_BASE}/phoenix/ann/approximate_nearest_neighbors.py`
          }
        ]
      },
      {
        id: 'ch2-e',
        labelSimple: 'Merge',
        labelTechnical: 'Source Merge',
        functions: [
          {
            id: 'ch2-e-1',
            name: 'PhoenixCandidatePipeline::run()',
            file: 'home-mixer/pipeline/phoenix_candidate_pipeline.rs',
            summary: 'Merging Thunder and Phoenix candidates',
            githubUrl: `${GITHUB_BASE}/home-mixer/pipeline/phoenix_candidate_pipeline.rs`
          }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    number: 3,
    labelSimple: 'Filter',
    labelTechnical: 'Filter Cascade',
    subChapters: [
      {
        id: 'ch3-a',
        labelSimple: 'Dedup',
        labelTechnical: 'Deduplication Filters',
        functions: [
          {
            id: 'ch3-a-1',
            name: 'DropDuplicatesFilter::filter()',
            file: 'home-mixer/filters/dedup.rs',
            summary: 'Removing duplicate tweets',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/dedup.rs`
          },
          {
            id: 'ch3-a-2',
            name: 'RepostDeduplicationFilter::filter()',
            file: 'home-mixer/filters/dedup.rs',
            summary: 'Removing duplicate reposts',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/dedup.rs`
          }
        ]
      },
      {
        id: 'ch3-b',
        labelSimple: 'Social',
        labelTechnical: 'Social Graph Filter',
        functions: [
          {
            id: 'ch3-b-1',
            name: 'AuthorSocialgraphFilter::filter()',
            file: 'home-mixer/filters/socialgraph.rs',
            summary: 'Filtering by blocks and mutes',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/socialgraph.rs`
          },
          {
            id: 'ch3-b-2',
            name: 'SelfpostFilter::filter()',
            file: 'home-mixer/filters/socialgraph.rs',
            summary: 'Removing your own posts',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/socialgraph.rs`
          }
        ]
      },
      {
        id: 'ch3-c',
        labelSimple: 'Recency',
        labelTechnical: 'Recency & History',
        functions: [
          {
            id: 'ch3-c-1',
            name: 'AgeFilter::filter()',
            file: 'home-mixer/filters/history.rs',
            summary: 'Removing stale posts',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/history.rs`
          },
          {
            id: 'ch3-c-2',
            name: 'PreviouslySeenPostsFilter::filter()',
            file: 'home-mixer/filters/history.rs',
            summary: 'Removing already-seen posts',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/history.rs`
          },
          {
            id: 'ch3-c-3',
            name: 'PreviouslyServedPostsFilter::filter()',
            file: 'home-mixer/filters/history.rs',
            summary: 'Removing recently served posts',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/history.rs`
          }
        ]
      },
      {
        id: 'ch3-d',
        labelSimple: 'Content',
        labelTechnical: 'Content Filters',
        functions: [
          {
            id: 'ch3-d-1',
            name: 'MutedKeywordFilter::filter()',
            file: 'home-mixer/filters/content.rs',
            summary: 'Filtering muted keywords',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/content.rs`
          },
          {
            id: 'ch3-d-2',
            name: 'IneligibleSubscriptionFilter::filter()',
            file: 'home-mixer/filters/content.rs',
            summary: 'Removing ineligible subscription content',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/content.rs`
          }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    number: 4,
    labelSimple: 'Score',
    labelTechnical: 'Heavy Ranker',
    subChapters: [
      {
        id: 'ch4-a',
        labelSimple: 'Tokens',
        labelTechnical: 'Context Tokens',
        functions: [
          {
            id: 'ch4-a-1',
            name: 'PhoenixRanker.forward()',
            file: 'phoenix/recsys_model.py',
            summary: 'Encoding engagement context tokens',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          }
        ]
      },
      {
        id: 'ch4-b',
        labelSimple: 'Attention',
        labelTechnical: 'Attention Weights',
        functions: [
          {
            id: 'ch4-b-1',
            name: 'PhoenixRanker.attention()',
            file: 'phoenix/recsys_model.py',
            summary: 'Computing token attention weights',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          }
        ]
      },
      {
        id: 'ch4-c',
        labelSimple: 'Odds',
        labelTechnical: 'Engagement Odds',
        functions: [
          {
            id: 'ch4-c-1',
            name: 'PhoenixScorer::score()',
            file: 'home-mixer/scorers/phoenix_scorer.rs',
            summary: 'Estimating engagement probabilities',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/phoenix_scorer.rs`
          }
        ]
      },
      {
        id: 'ch4-d',
        labelSimple: 'Combine',
        labelTechnical: 'Weighted Score',
        functions: [
          {
            id: 'ch4-d-1',
            name: 'WeightedScorer::score()',
            file: 'home-mixer/scorers/weighted_scorer.rs',
            summary: 'Combining scores with weights',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/weighted_scorer.rs`
          },
          {
            id: 'ch4-d-2',
            name: 'AuthorDiversityScorer::score()',
            file: 'home-mixer/scorers/diversity.rs',
            summary: 'Penalizing repeated authors',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/diversity.rs`
          }
        ]
      }
    ]
  },
  {
    id: 'ch5',
    number: 5,
    labelSimple: 'Deliver',
    labelTechnical: 'Delivery Report',
    subChapters: [
      {
        id: 'ch5-a',
        labelSimple: 'Select',
        labelTechnical: 'Top-K Selector',
        functions: [
          {
            id: 'ch5-a-1',
            name: 'TopKScoreSelector::select()',
            file: 'home-mixer/selectors/top_k_score_selector.rs',
            summary: 'Selecting top scored tweets',
            githubUrl: `${GITHUB_BASE}/home-mixer/selectors/top_k_score_selector.rs`
          }
        ]
      },
      {
        id: 'ch5-b',
        labelSimple: 'Reach',
        labelTechnical: 'Reach Forecast',
        functions: [
          {
            id: 'ch5-b-1',
            name: 'AudienceReachForecaster::estimate()',
            file: 'home-mixer/pipelines/reach_forecaster.rs',
            summary: 'Estimating reach from embeddings + audience mix',
            githubUrl: `${GITHUB_BASE}/home-mixer/pipelines/reach_forecaster.rs`
          }
        ]
      },
      {
        id: 'ch5-c',
        labelSimple: 'Reactions',
        labelTechnical: 'Engagement Burst',
        functions: [
          {
            id: 'ch5-c-1',
            name: 'EngagementBurstSimulator::run()',
            file: 'home-mixer/pipelines/engagement_burst_simulator.rs',
            summary: 'Simulating early reactions from the audience',
            githubUrl: `${GITHUB_BASE}/home-mixer/pipelines/engagement_burst_simulator.rs`
          }
        ]
      },
      {
        id: 'ch5-d',
        labelSimple: 'Report',
        labelTechnical: 'Delivery Report',
        functions: [
          {
            id: 'ch5-d-1',
            name: 'format_response()',
            file: 'home-mixer/server.rs',
            summary: 'Serializing final timeline payload',
            githubUrl: `${GITHUB_BASE}/home-mixer/server.rs`
          }
        ]
      }
    ]
  }
];

// Helper to get total position count for navigation bounds
export function getTotalPositions(): number {
  return CHAPTERS.reduce(
    (total, chapter) =>
      total +
      chapter.subChapters.reduce(
        (subTotal, subChapter) => subTotal + subChapter.functions.length,
        0
      ),
    0
  );
}

// Helper to get function at a specific position
export function getFunctionAtPosition(
  chapterIndex: number,
  subChapterIndex: number,
  functionIndex: number
): FunctionStep | null {
  const chapter = CHAPTERS[chapterIndex];
  if (!chapter) return null;
  const subChapter = chapter.subChapters[subChapterIndex];
  if (!subChapter) return null;
  return subChapter.functions[functionIndex] ?? null;
}
