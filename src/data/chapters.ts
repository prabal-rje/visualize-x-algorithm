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
        labelSimple: 'Thunder',
        labelTechnical: 'In-Network Source',
        functions: [
          {
            id: 'ch2-a-1',
            name: 'ThunderSource::get_candidates()',
            file: 'home-mixer/sources/thunder_source.rs',
            summary: 'Fetching tweets from users you follow',
            githubUrl: `${GITHUB_BASE}/home-mixer/sources/thunder_source.rs`
          }
        ]
      },
      {
        id: 'ch2-b',
        labelSimple: 'Phoenix',
        labelTechnical: 'Out-of-Network Source',
        functions: [
          {
            id: 'ch2-b-1',
            name: 'TwoTowerModel.user_tower()',
            file: 'phoenix/recsys_retrieval_model.py',
            summary: 'Encoding user into embedding vector',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
          },
          {
            id: 'ch2-b-2',
            name: 'PhoenixSource::get_candidates()',
            file: 'home-mixer/sources/phoenix_source.rs',
            summary: 'Discovering tweets outside your network',
            githubUrl: `${GITHUB_BASE}/home-mixer/sources/phoenix_source.rs`
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
            file: 'home-mixer/filters/drop_duplicates_filter.rs',
            summary: 'Removing duplicate tweets',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/drop_duplicates_filter.rs`
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
            file: 'home-mixer/filters/author_socialgraph_filter.rs',
            summary: 'Filtering by blocks and mutes',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/author_socialgraph_filter.rs`
          }
        ]
      },
      {
        id: 'ch3-c',
        labelSimple: 'Keywords',
        labelTechnical: 'Muted Keywords',
        functions: [
          {
            id: 'ch3-c-1',
            name: 'MutedKeywordFilter::filter()',
            file: 'home-mixer/filters/muted_keyword_filter.rs',
            summary: 'Filtering muted keywords',
            githubUrl: `${GITHUB_BASE}/home-mixer/filters/muted_keyword_filter.rs`
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
        labelSimple: 'Phoenix',
        labelTechnical: 'Phoenix Scorer',
        functions: [
          {
            id: 'ch4-a-1',
            name: 'PhoenixRanker.forward()',
            file: 'phoenix/recsys_model.py',
            summary: 'Predicting engagement probabilities',
            githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
          },
          {
            id: 'ch4-a-2',
            name: 'PhoenixScorer::score()',
            file: 'home-mixer/scorers/phoenix_scorer.rs',
            summary: 'Computing Phoenix model scores',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/phoenix_scorer.rs`
          }
        ]
      },
      {
        id: 'ch4-b',
        labelSimple: 'Combine',
        labelTechnical: 'Weighted Scoring',
        functions: [
          {
            id: 'ch4-b-1',
            name: 'WeightedScorer::score()',
            file: 'home-mixer/scorers/weighted_scorer.rs',
            summary: 'Combining scores with weights',
            githubUrl: `${GITHUB_BASE}/home-mixer/scorers/weighted_scorer.rs`
          },
          {
            id: 'ch4-b-2',
            name: 'AuthorDiversityScorer::score()',
            file: 'home-mixer/scorers/author_diversity_scorer.rs',
            summary: 'Penalizing repeated authors',
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
    labelTechnical: 'Top-K Selection',
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
        labelSimple: 'Pipeline',
        labelTechnical: 'Candidate Pipeline',
        functions: [
          {
            id: 'ch5-b-1',
            name: 'PhoenixCandidatePipeline::run()',
            file: 'home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs',
            summary: 'Orchestrating the full pipeline',
            githubUrl: `${GITHUB_BASE}/home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs`
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
