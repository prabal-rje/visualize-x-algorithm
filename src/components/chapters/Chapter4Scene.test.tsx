import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter4Scene from './Chapter4Scene';

describe('Chapter4Scene', () => {
  it('renders scoring chapter with scoreboard', () => {
    render(<Chapter4Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-4-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 4/)).toBeInTheDocument();
    expect(screen.getByTestId('engagement-scoreboard')).toBeInTheDocument();
  });
});
