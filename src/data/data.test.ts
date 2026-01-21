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

  it('expands chapters 3-5 into more granular sub-steps', () => {
    const ch3 = CHAPTERS.find((chapter) => chapter.id === 'ch3');
    const ch4 = CHAPTERS.find((chapter) => chapter.id === 'ch4');
    const ch5 = CHAPTERS.find((chapter) => chapter.id === 'ch5');
    expect(ch3?.subChapters.length).toBeGreaterThanOrEqual(4);
    expect(ch4?.subChapters.length).toBeGreaterThanOrEqual(4);
    expect(ch5?.subChapters.length).toBeGreaterThanOrEqual(4);
  });
});
