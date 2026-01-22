import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cssPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'config-panel.module.css'
);

describe('config panel sizing', () => {
  it('uses border-box sizing on the panel to prevent mobile overflow', async () => {
    const css = await readFile(cssPath, 'utf8');
    expect(css).toMatch(/\.panel\s*\{[^}]*box-sizing:\s*border-box;/s);
  });
});
