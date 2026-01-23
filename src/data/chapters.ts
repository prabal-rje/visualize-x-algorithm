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
            name: 'selectPersona()',
            file: 'simulation/config.ts',
            summary: 'Selecting persona archetype and voice',
            githubUrl: '' // Simulation-only, not in X codebase
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
            name: 'setAudienceMix()',
            file: 'simulation/config.ts',
            summary: 'Balancing audience types for delivery',
            githubUrl: '' // Simulation-only, not in X codebase
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
            name: 'draftTweet()',
            file: 'simulation/config.ts',
            summary: 'Drafting the tweet for simulation',
            githubUrl: '' // Simulation-only, not in X codebase
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
            summary: 'Fetching engagement history and user features',
            githubUrl: `${GITHUB_BASE}/home-mixer/query_hydrators/user_action_seq_query_hydrator.rs`
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
        labelTechnical: 'Feature Hashing',
        functions: [
          {
            id: 'ch2-a-1',
            name: 'block_user_reduce()',
            file: 'phoenix/recsys_model.py',
            summary: 'Converting user features to hash embeddings',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          }
        ]
      },
      {
        id: 'ch2-b',
        labelSimple: 'Embeddings',
        labelTechnical: 'Hash Embeddings',
        functions: [
          {
            id: 'ch2-b-1',
            name: 'block_history_reduce()',
            file: 'phoenix/recsys_model.py',
            summary: 'Combining post and author hash embeddings',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          }
        ]
      },
      {
        id: 'ch2-c',
        labelSimple: 'Pooling',
        labelTechnical: 'Mean Pooling',
        functions: [
          {
            id: 'ch2-c-1',
            name: 'build_user_representation()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Pooling embeddings into user representation',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
          }
        ]
      },
      {
        id: 'ch2-d',
        labelSimple: 'Similarity',
        labelTechnical: 'Dot Product',
        functions: [
          {
            id: 'ch2-d-1',
            name: 'PhoenixRetrievalModel.__call__()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Computing dot product similarity scores',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
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
            name: 'CandidatePipeline::fetch_candidates()',
            file: 'candidate-pipeline/candidate_pipeline.rs',
            summary: 'Merging Thunder and Phoenix candidates',
            githubUrl: `${GITHUB_BASE}/candidate-pipeline/candidate_pipeline.rs`
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
        labelSimple: 'Quality',
        labelTechnical: 'Quality Gates',
        functions: [
          {
            id: 'ch3-a-1',
            name: 'DropDuplicatesFilter::filter()',
            file: 'home-mixer/filters/drop_duplicates_filter.rs',
            summary: 'Removing duplicates and blocked content',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/drop_duplicates_filter.rs`
          }
        ]
      },
      {
        id: 'ch3-b',
        labelSimple: 'Freshness',
        labelTechnical: 'Freshness Gates',
        functions: [
          {
            id: 'ch3-b-1',
            name: 'AgeFilter::filter()',
            file: 'home-mixer/filters/age_filter.rs',
            summary: 'Removing stale and already-seen content',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/age_filter.rs`
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
        labelSimple: 'History',
        labelTechnical: 'Your History',
        functions: [
          {
            id: 'ch4-a-1',
            name: 'PhoenixModel.__call__()',
            file: 'phoenix/recsys_model.py',
            summary: 'Encoding your recent engagement history',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          }
        ]
      },
      {
        id: 'ch4-b',
        labelSimple: 'Odds',
        labelTechnical: 'Engagement Odds',
        functions: [
          {
            id: 'ch4-b-1',
            name: 'PhoenixScorer::score()',
            file: 'home-mixer/scorers/phoenix_scorer.rs',
            summary: 'Predicting engagement probabilities',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/phoenix_scorer.rs`
          }
        ]
      },
      {
        id: 'ch4-c',
        labelSimple: 'Weights',
        labelTechnical: 'Platform Weights',
        functions: [
          {
            id: 'ch4-c-1',
            name: 'WeightedScorer::compute_weighted_score()',
            file: 'home-mixer/scorers/weighted_scorer.rs',
            summary: 'Applying platform-defined action weights',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/weighted_scorer.rs`
          }
        ]
      },
      {
        id: 'ch4-d',
        labelSimple: 'Score',
        labelTechnical: 'Final Score',
        functions: [
          {
            id: 'ch4-d-1',
            name: 'WeightedScorer::score()',
            file: 'home-mixer/scorers/weighted_scorer.rs',
            summary: 'Combining odds into final ranking score',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/weighted_scorer.rs`
          }
        ]
      },
      {
        id: 'ch4-e',
        labelSimple: 'Rank',
        labelTechnical: 'Diversity Rank',
        functions: [
          {
            id: 'ch4-e-1',
            name: 'AuthorDiversityScorer::score()',
            file: 'home-mixer/scorers/author_diversity_scorer.rs',
            summary: 'Applying author diversity penalties',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/author_diversity_scorer.rs`
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
            name: 'simulateReach()',
            file: 'simulation/reach_forecaster.ts',
            summary: 'Estimating reach from embeddings + audience mix',
            githubUrl: '' // Simulation-only, not in X codebase
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
            name: 'simulateEngagement()',
            file: 'simulation/engagement_simulator.ts',
            summary: 'Simulating early reactions from the audience',
            githubUrl: '' // Simulation-only, not in X codebase
          }
        ]
      }
      // Note: 5D (Delivery Report) content is now shown in the completion overlay
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
