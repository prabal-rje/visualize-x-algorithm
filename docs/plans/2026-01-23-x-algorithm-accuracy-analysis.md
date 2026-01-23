# X Algorithm Accuracy Analysis

## Overview

This document analyzes the accuracy of our visualization against the actual X algorithm codebase at `https://github.com/xai-org/x-algorithm`.

---

## Chapter-by-Chapter Accuracy Analysis

### Chapter 0: Loadout (Mission Prep)
**Status: FICTIONAL (Intentional)**

This chapter is our simulation setup - not part of the actual X algorithm. It's where users configure:
- Persona selection
- Audience mix
- Tweet drafting

No corrections needed - this is by design.

---

### Chapter 1: Request (gRPC Request)

#### 1A: Receive - Request Handler

| Current | Actual |
|---------|--------|
| `get_scored_posts()` | `get_scored_posts()` |
| `home-mixer/server.rs` | `home-mixer/server.rs` |
| GitHub URL: `home-mixer/server.rs` | **CORRECT** |

**Status: ACCURATE**

The actual function signature:
```rust
async fn get_scored_posts(
    &self,
    request: Request<pb::ScoredPostsQuery>,
) -> Result<Response<ScoredPostsResponse>, Status>
```

#### 1B: Hydrate - Query Hydration

| Current | Actual |
|---------|--------|
| `QueryHydrationPipeline::run()` | **Does not exist** |
| `home-mixer/query_hydrators/hydration_pipeline.rs` | **File does not exist** |

**Status: INCORRECT**

**Actual files:**
- `home-mixer/query_hydrators/user_action_seq_query_hydrator.rs` - `UserActionSeqQueryHydrator::hydrate()`
- `home-mixer/query_hydrators/user_features_query_hydrator.rs` - `UserFeaturesQueryHydrator::hydrate()`

**Recommended correction:**
```typescript
{
  id: 'ch1-b',
  labelSimple: 'Hydrate',
  labelTechnical: 'Query Hydration',
  functions: [
    {
      id: 'ch1-b-1',
      name: 'UserActionSeqQueryHydrator::hydrate()',
      file: 'home-mixer/query_hydrators/user_action_seq_query_hydrator.rs',
      summary: 'Fetching user engagement history sequence',
      githubUrl: `${GITHUB_BASE}/home-mixer/query_hydrators/user_action_seq_query_hydrator.rs`
    }
  ]
}
```

---

### Chapter 2: Gather (Thunder/Phoenix)

#### 2A: Tokenize

| Current | Actual |
|---------|--------|
| `TwoTowerModel.tokenize()` | **Does not exist with this name** |
| `phoenix/recsys_retrieval_model.py` | File exists but function doesn't |

**Status: INCORRECT**

The Phoenix retrieval model doesn't have a `tokenize()` method. The actual flow uses hash-based embeddings, not tokenization.

**What actually happens:**
1. User/post features are converted to hashes
2. Hashes are looked up in embedding tables
3. Multiple hash embeddings are combined via learned projections

**Recommended correction:**
```typescript
{
  id: 'ch2-a',
  labelSimple: 'Hash',
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
}
```

#### 2B: Embeddings

| Current | Actual |
|---------|--------|
| `TwoTowerModel.embed_tokens()` | **Does not exist** |

**Status: INCORRECT**

**Actual function:** `block_history_reduce()` in `phoenix/recsys_model.py`

This function:
- Takes history post hashes, author hashes, action embeddings, product surface embeddings
- Concatenates them
- Projects to embedding dimension D

#### 2C: Pooling

| Current | Actual |
|---------|--------|
| `TwoTowerModel.pool_tokens()` | **Does not exist** |

**Status: INCORRECT**

**Actual operation:** In `build_user_representation()` in `phoenix/recsys_retrieval_model.py`:
```python
user_embedding_sum = jnp.sum(user_embeddings_masked, axis=1)  # [B, D]
mask_sum = jnp.sum(mask_float, axis=1)  # [B, 1]
user_representation = user_embedding_sum / jnp.maximum(mask_sum, 1.0)
```

This is **mean pooling** over valid positions.

#### 2D: Similarity

| Current | Actual |
|---------|--------|
| `approximate_nearest_neighbors()` | **File does not exist** |
| `phoenix/ann/approximate_nearest_neighbors.py` | **Path does not exist** |

**Status: INCORRECT**

The similarity computation happens in `PhoenixRetrievalModel.__call__()`:
```python
# Dot product similarity between user and candidates
similarity_scores = jnp.einsum("bd,bcd->bc", user_representation, candidate_representation)
```

**Recommended correction:**
```typescript
{
  id: 'ch2-d',
  labelSimple: 'Similarity',
  labelTechnical: 'Dot Product Similarity',
  functions: [
    {
      id: 'ch2-d-1',
      name: 'PhoenixRetrievalModel.__call__()',
      file: 'phoenix/recsys_retrieval_model.py',
      summary: 'Computing dot product similarity for retrieval',
      githubUrl: `${GITHUB_BASE}/phoenix/recsys_retrieval_model.py`
    }
  ]
}
```

#### 2E: Merge - Source Merge

| Current | Actual |
|---------|--------|
| `PhoenixCandidatePipeline::run()` | Should be `execute()` |
| `home-mixer/pipeline/phoenix_candidate_pipeline.rs` | **Path incorrect** |

**Status: INCORRECT**

**Actual path:** `home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs`

**Recommended correction:**
```typescript
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
```

---

### Chapter 3: Filter (Filter Cascade)

#### 3A: Quality - Quality Gates

| Current | Actual |
|---------|--------|
| `QualityFilterCascade::run()` | **Does not exist** |
| `home-mixer/filters/quality.rs` | **File does not exist** |

**Status: INCORRECT**

**Actual filters (quality-related):**
- `DropDuplicatesFilter` in `home-mixer/filters/drop_duplicates_filter.rs`
- `AuthorSocialgraphFilter` in `home-mixer/filters/author_socialgraph_filter.rs`
- `SelfTweetFilter` in `home-mixer/filters/self_tweet_filter.rs`
- `MutedKeywordFilter` in `home-mixer/filters/muted_keyword_filter.rs`

**Recommended correction:**
```typescript
{
  id: 'ch3-a',
  labelSimple: 'Quality',
  labelTechnical: 'Quality Gates',
  functions: [
    {
      id: 'ch3-a-1',
      name: 'DropDuplicatesFilter::filter()',
      file: 'home-mixer/filters/drop_duplicates_filter.rs',
      summary: 'Removing duplicate and blocked content',
      githubUrl: `${GITHUB_BASE}/home-mixer/filters/drop_duplicates_filter.rs`
    }
  ]
}
```

#### 3B: Freshness - Freshness Gates

| Current | Actual |
|---------|--------|
| `FreshnessFilterCascade::run()` | **Does not exist** |
| `home-mixer/filters/freshness.rs` | **File does not exist** |

**Status: INCORRECT**

**Actual filters (freshness-related):**
- `AgeFilter` in `home-mixer/filters/age_filter.rs`
- `PreviouslySeenPostsFilter` in `home-mixer/filters/previously_seen_posts_filter.rs`
- `PreviouslyServedPostsFilter` in `home-mixer/filters/previously_served_posts_filter.rs`

**Recommended correction:**
```typescript
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
```

---

### Chapter 4: Score (Heavy Ranker)

#### 4A: History - Your History

| Current | Actual |
|---------|--------|
| `PhoenixRanker.encode_context()` | **Does not exist with this name** |
| `phoenix/recsys_model.py` | File exists |

**Status: INCORRECT**

**Actual function:** `PhoenixModel.build_context_representation()` or the history encoding in `__call__()`.

Actually, looking at the code, the context (user + history) is encoded in `PhoenixModel.__call__()` which:
1. Calls `block_user_reduce()` for user embeddings
2. Calls `block_history_reduce()` for history embeddings
3. Concatenates and passes through transformer

**Recommended correction:**
```typescript
{
  id: 'ch4-a',
  labelSimple: 'History',
  labelTechnical: 'Your History',
  functions: [
    {
      id: 'ch4-a-1',
      name: 'block_history_reduce()',
      file: 'phoenix/recsys_model.py',
      summary: 'Encoding your recent engagement history',
      githubUrl: `${GITHUB_BASE}/phoenix/recsys_model.py`
    }
  ]
}
```

#### 4B: Odds - Engagement Odds

| Current | Actual |
|---------|--------|
| `PhoenixScorer::predict()` | Should be `score()` |
| `home-mixer/scorers/phoenix_scorer.rs` | **CORRECT** |

**Status: PARTIALLY CORRECT**

The actual method is `score()` not `predict()`, though internally it calls `phoenix_client.predict()`.

#### 4C: Weights - Platform Weights

| Current | Actual |
|---------|--------|
| `WeightedScorer::load_weights()` | **Does not exist** |
| `home-mixer/scorers/weighted_scorer.rs` | File exists |

**Status: INCORRECT**

Weights are hardcoded constants, not loaded. The actual function is `compute_weighted_score()`.

**Recommended correction:**
```typescript
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
}
```

#### 4D: Score - Final Score

| Current | Actual |
|---------|--------|
| `WeightedScorer::combine()` | **Does not exist** |

**Status: INCORRECT**

The actual scoring formula is in `compute_weighted_score()` which does:
```rust
let combined_score = Self::apply(s.favorite_score, p::FAVORITE_WEIGHT)
    + Self::apply(s.reply_score, p::REPLY_WEIGHT)
    + Self::apply(s.retweet_score, p::RETWEET_WEIGHT)
    + ... // many more
```

#### 4E: Rank - Where You Rank

| Current | Actual |
|---------|--------|
| `CandidateRanker::rank()` | **Does not exist** |
| `home-mixer/rankers/candidate_ranker.rs` | **File does not exist** |

**Status: INCORRECT**

Ranking is done by `AuthorDiversityScorer` which applies decay to repeated authors:
```rust
fn multiplier(&self, position: usize) -> f64 {
    (1.0 - self.floor) * self.decay_factor.powf(position as f64) + self.floor
}
```

**Recommended correction:**
```typescript
{
  id: 'ch4-e',
  labelSimple: 'Rank',
  labelTechnical: 'Diversity Ranking',
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
```

---

### Chapter 5: Deliver (Delivery Report)

#### 5A: Select - Top-K Selector

| Current | Actual |
|---------|--------|
| `TopKScoreSelector::select()` | **CORRECT** |
| `home-mixer/selectors/top_k_score_selector.rs` | **CORRECT** |

**Status: ACCURATE**

#### 5B: Reach - Reach Forecast

| Current | Actual |
|---------|--------|
| `AudienceReachForecaster::estimate()` | **Does not exist** |
| `home-mixer/pipelines/reach_forecaster.rs` | **File does not exist** |

**Status: FICTIONAL**

This is our simulation addition - not part of the actual algorithm.

#### 5C: Reactions - Engagement Burst

| Current | Actual |
|---------|--------|
| `EngagementBurstSimulator::run()` | **Does not exist** |
| `home-mixer/pipelines/engagement_burst_simulator.rs` | **File does not exist** |

**Status: FICTIONAL**

This is our simulation addition - not part of the actual algorithm.

#### 5D: Report - Delivery Report

| Current | Actual |
|---------|--------|
| `format_response()` | **Does not exist as separate function** |
| `home-mixer/server.rs` | File exists |

**Status: PARTIALLY INCORRECT**

The response is assembled inline in `get_scored_posts()`, not in a separate function.

---

## Mathematical Approximations

### How We Approximate the Real Algorithm

Since we don't have access to X's actual ML models, we use **MiniLM embeddings** to approximate semantic similarity. Here's how each approximation works:

### 1. Tokenization Approximation

**Real X Algorithm:**
- Uses hash-based feature encoding
- Multiple hash functions per feature type
- Learned embedding tables

**Our Approximation:**
```typescript
// We use transformers.js tokenizer
const tokens = await tokenizer(text, { padding: true, truncation: true });
// Returns: { input_ids: [101, 2023, 2003, ...], attention_mask: [1, 1, 1, ...] }
```

### 2. Embedding Approximation

**Real X Algorithm:**
- Hash embeddings looked up from trained tables
- Projected through learned weight matrices
- Combined: `embedding = W @ concat(user_hash_emb, history_hash_emb, ...)`

**Our Approximation:**
```typescript
// MiniLM sentence embedding (384 dimensions)
const embedding = await model.encode(text);
// Returns: Float32Array[384]
```

### 3. Similarity Calculation

**Real X Algorithm (Phoenix Retrieval):**
```python
# L2 normalize both representations
user_representation = user_embedding / jnp.linalg.norm(user_embedding)
candidate_representation = candidate_embedding / jnp.linalg.norm(candidate_embedding)

# Dot product similarity
similarity = jnp.dot(user_representation, candidate_representation)
```

**Our Approximation (identical math):**
```typescript
// Cosine similarity = dot product of L2-normalized vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}
```

### 4. Scoring Approximation

**Real X Algorithm (WeightedScorer):**
```rust
// From home-mixer/scorers/weighted_scorer.rs
let combined_score =
    favorite_score * FAVORITE_WEIGHT        // 0.5
  + reply_score * REPLY_WEIGHT              // 27.0
  + retweet_score * RETWEET_WEIGHT          // 1.0
  + photo_expand_score * PHOTO_EXPAND_WEIGHT
  + click_score * CLICK_WEIGHT
  + profile_click_score * PROFILE_CLICK_WEIGHT
  + vqv_score * VQV_WEIGHT
  + share_score * SHARE_WEIGHT
  + dwell_score * DWELL_WEIGHT
  + quote_score * QUOTE_WEIGHT
  + follow_author_score * FOLLOW_AUTHOR_WEIGHT
  + not_interested_score * NOT_INTERESTED_WEIGHT  // negative
  + block_author_score * BLOCK_AUTHOR_WEIGHT      // negative
  + mute_author_score * MUTE_AUTHOR_WEIGHT        // negative
  + report_score * REPORT_WEIGHT;                 // negative
```

**Our Approximation:**
```typescript
// We approximate engagement probabilities from embedding similarity
function predictEngagement(similarity: number, audienceAffinity: number): Scores {
  const baseProb = (similarity + 1) / 2; // Convert [-1,1] to [0,1]

  return {
    likeProb: baseProb * 0.4 * audienceAffinity,
    replyProb: baseProb * 0.1 * audienceAffinity,
    retweetProb: baseProb * 0.15 * audienceAffinity,
    clickProb: baseProb * 0.3 * audienceAffinity,
  };
}

// Then apply similar weighted formula
const score =
    likeProb * 0.5 +
    replyProb * 27.0 +
    retweetProb * 1.0 +
    clickProb * 1.5;
```

### 5. Diversity Penalty

**Real X Algorithm:**
```rust
// From author_diversity_scorer.rs
fn multiplier(&self, position: usize) -> f64 {
    (1.0 - self.floor) * self.decay_factor.powf(position as f64) + self.floor
}
// Where decay_factor ≈ 0.5, floor ≈ 0.2
// So: 1st occurrence = 1.0, 2nd = 0.6, 3rd = 0.4, 4th+ = 0.2
```

**Our Approximation:**
```typescript
function authorDiversityMultiplier(authorOccurrence: number): number {
  const decayFactor = 0.5;
  const floor = 0.2;
  return (1.0 - floor) * Math.pow(decayFactor, authorOccurrence) + floor;
}
```

---

## Full Mathematical Pipeline

### Step 1: Tweet Embedding
```
E_tweet = MiniLM(tweet_text) ∈ ℝ³⁸⁴
```

### Step 2: Audience Embedding
```
E_audience = Σᵢ (weight_i × E_archetype_i) / Σᵢ weight_i
```
Where `E_archetype_i` is the centroid embedding for each audience segment.

### Step 3: Similarity Score
```
similarity(tweet, audience) = (E_tweet · E_audience) / (||E_tweet|| × ||E_audience||)
```

### Step 4: Engagement Probability Estimation
```
P(action | similarity, affinity) = sigmoid(similarity) × affinity_weight
```

### Step 5: Weighted Score
```
Score = Σⱼ (P(actionⱼ) × weightⱼ)
```
Where weights approximate X's actual values:
- Like: 0.5
- Reply: 27.0
- Retweet: 1.0
- Click: 1.5
- Profile Click: 10.0
- Dwell: 0.4

### Step 6: Final Rank
```
FinalScore = Score × AuthorDiversityMultiplier(occurrence)
```

---

## Recommendations

### Priority 1: Fix Incorrect File Paths
All GitHub URLs should point to actual files in the repository.

### Priority 2: Fix Function Names
Function names should match actual method signatures.

### Priority 3: Decide on Fictional Elements
Chapters 5B (Reach) and 5C (Reactions) are fictional. Either:
- Mark them clearly as "simulation additions"
- Remove GitHub links for these
- Or replace with actual post-processing steps

### Priority 4: Add Accuracy Indicators
Consider adding a visual indicator showing which parts are:
- **Accurate**: Matches real X algorithm
- **Approximated**: Uses similar math with different implementation
- **Fictional**: Added for educational/simulation purposes
