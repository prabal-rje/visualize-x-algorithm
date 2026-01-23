import { describe, expect, it } from 'vitest';
import { AUDIENCES } from './audiences';
import { PERSONAS } from './personas';
import { CHAPTERS } from './chapters';

describe('data fixtures', () => {
  it('includes 16 personas', () => {
    expect(PERSONAS).toHaveLength(16);
  });

  it('includes 8 audiences', () => {
    expect(AUDIENCES).toHaveLength(8);
  });

  it('includes a loadout chapter at index 0', () => {
    expect(CHAPTERS[0]?.labelSimple).toMatch(/Loadout|Prep/i);
  });

  it('has correct subChapter counts for chapters 3-5', () => {
    const ch3 = CHAPTERS.find((chapter) => chapter.id === 'ch3');
    const ch4 = CHAPTERS.find((chapter) => chapter.id === 'ch4');
    const ch5 = CHAPTERS.find((chapter) => chapter.id === 'ch5');
    expect(ch3?.subChapters.length).toBe(2); // Quality Gates, Freshness Gates
    expect(ch4?.subChapters.length).toBe(5); // History, Odds, Weights, Score, Rank
    expect(ch5?.subChapters.length).toBeGreaterThanOrEqual(4);
  });
});
