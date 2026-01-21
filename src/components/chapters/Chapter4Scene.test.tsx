import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter4Scene from './Chapter4Scene';

describe('Chapter4Scene', () => {
  it('renders scoring chapter with scoreboard on final step', () => {
    render(<Chapter4Scene currentStep={3} isActive={true} />);
    expect(screen.getByTestId('chapter-4-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 4/)).toBeInTheDocument();
    expect(screen.getByTestId('engagement-scoreboard')).toBeInTheDocument();
  });

  it('renders probability rack on step 2', () => {
    render(<Chapter4Scene currentStep={2} isActive={true} />);
    expect(screen.getByTestId('probability-rack')).toBeInTheDocument();
  });

  it('renders attention bars on step 1', () => {
    render(<Chapter4Scene currentStep={1} isActive={true} />);
    expect(screen.getByTestId('attention-bars')).toBeInTheDocument();
  });
});
