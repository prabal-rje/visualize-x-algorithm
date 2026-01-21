import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const css = fs.readFileSync('src/index.css', 'utf8');

describe('global css', () => {
  it('defines crt color variables', () => {
    expect(css).toContain('--phosphor-green');
    expect(css).toContain('--crt-black');
  });

  it('defines phosphor persistence variable', () => {
    expect(css).toContain('--phosphor-persistence');
  });

  it('defines phosphor glow variable', () => {
    expect(css).toContain('--phosphor-glow');
  });

  it('uses retro pixel fonts', () => {
    expect(css).toContain('VT323');
    expect(css).toContain('Press Start 2P');
  });
});
