import { describe, expect, it } from 'vitest';
import { AUDIENCES } from './audiences';
import { PERSONAS } from './personas';

describe('data fixtures', () => {
  it('includes 16 personas', () => {
    expect(PERSONAS).toHaveLength(16);
  });

  it('includes 8 audiences', () => {
    expect(AUDIENCES).toHaveLength(8);
  });
});
