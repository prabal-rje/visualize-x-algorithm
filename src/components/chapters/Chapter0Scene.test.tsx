import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter0Scene from './Chapter0Scene';

describe('Chapter0Scene', () => {
  it('renders loadout chapter with config steps', () => {
    render(<Chapter0Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-0-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 0/i)).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
