import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

describe('index.html fonts', () => {
  it('loads crt fonts from Google Fonts', () => {
    expect(html).toContain('family=VT323');
    expect(html).toContain('family=Press+Start+2P');
    expect(html).toContain('family=IBM+Plex+Mono');
  });
});
