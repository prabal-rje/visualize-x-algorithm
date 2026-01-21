import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = fs.readFileSync('src/styles/crt.module.css', 'utf8');

describe('crt module styles', () => {
  it('applies global phosphor glow to content', () => {
    expect(css).toContain('.crtContent');
    expect(css).toContain('text-shadow');
    expect(css).toContain('var(--phosphor-glow)');
  });
});
