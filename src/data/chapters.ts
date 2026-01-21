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
            name: 'handleRequest()',
            file: 'home-mixer/server.rs',
            summary: 'Receiving timeline request from client',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/HomeMixerServer.scala'
          }
        ]
      },
      {
        id: 'ch1-b',
        labelSimple: 'Parse',
        labelTechnical: 'Request Parsing',
        functions: [
          {
            id: 'ch1-b-1',
            name: 'parseClientContext()',
            file: 'home-mixer/request.rs',
            summary: 'Extracting user context and preferences',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/HomeMixerRequestHandler.scala'
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
        labelSimple: 'Candidates',
        labelTechnical: 'Candidate Sources',
        functions: [
          {
            id: 'ch2-a-1',
            name: 'fetchInNetworkCandidates()',
            file: 'candidate-sources/in-network.rs',
            summary: 'Fetching tweets from users you follow',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/candidate_source/InNetworkCandidateSource.scala'
          },
          {
            id: 'ch2-a-2',
            name: 'fetchOutOfNetworkCandidates()',
            file: 'candidate-sources/out-of-network.rs',
            summary: 'Discovering tweets outside your network',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/candidate_source/OutOfNetworkCandidateSource.scala'
          }
        ]
      },
      {
        id: 'ch2-b',
        labelSimple: 'Features',
        labelTechnical: 'Feature Hydration',
        functions: [
          {
            id: 'ch2-b-1',
            name: 'hydrateFeatures()',
            file: 'feature-hydrator/hydrator.rs',
            summary: 'Computing features for each candidate',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/feature_hydrator/FeatureHydrator.scala'
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
        labelSimple: 'Safety',
        labelTechnical: 'Safety Filters',
        functions: [
          {
            id: 'ch3-a-1',
            name: 'applySafetyFilters()',
            file: 'filters/safety.rs',
            summary: 'Removing content violating policies',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/filter/SafetyFilter.scala'
          }
        ]
      },
      {
        id: 'ch3-b',
        labelSimple: 'Visibility',
        labelTechnical: 'Visibility Filtering',
        functions: [
          {
            id: 'ch3-b-1',
            name: 'filterByVisibility()',
            file: 'filters/visibility.rs',
            summary: 'Applying visibility rules and blocks',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/filter/VisibilityFilter.scala'
          }
        ]
      },
      {
        id: 'ch3-c',
        labelSimple: 'Quality',
        labelTechnical: 'Quality Scoring',
        functions: [
          {
            id: 'ch3-c-1',
            name: 'scoreQuality()',
            file: 'filters/quality.rs',
            summary: 'Computing content quality scores',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/filter/QualityFilter.scala'
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
        labelSimple: 'Embed',
        labelTechnical: 'Embeddings',
        functions: [
          {
            id: 'ch4-a-1',
            name: 'computeEmbeddings()',
            file: 'ranker/embeddings.rs',
            summary: 'Converting tweets to vector representations',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/ranker/EmbeddingComputer.scala'
          }
        ]
      },
      {
        id: 'ch4-b',
        labelSimple: 'Predict',
        labelTechnical: 'Engagement Prediction',
        functions: [
          {
            id: 'ch4-b-1',
            name: 'predictEngagement()',
            file: 'ranker/heavy-ranker.rs',
            summary: 'Predicting likes, retweets, and replies',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/ranker/HeavyRanker.scala'
          },
          {
            id: 'ch4-b-2',
            name: 'combineScores()',
            file: 'ranker/scorer.rs',
            summary: 'Combining engagement predictions into final score',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/ranker/Scorer.scala'
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
        labelSimple: 'Mix',
        labelTechnical: 'Content Mixing',
        functions: [
          {
            id: 'ch5-a-1',
            name: 'mixContent()',
            file: 'mixer/content-mixer.rs',
            summary: 'Balancing content types in the timeline',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/mixer/ContentMixer.scala'
          }
        ]
      },
      {
        id: 'ch5-b',
        labelSimple: 'Select',
        labelTechnical: 'Final Selection',
        functions: [
          {
            id: 'ch5-b-1',
            name: 'selectTopK()',
            file: 'mixer/selector.rs',
            summary: 'Selecting final tweets for your timeline',
            githubUrl:
              'https://github.com/twitter/the-algorithm/blob/main/home-mixer/server/src/main/scala/com/twitter/home_mixer/mixer/Selector.scala'
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
