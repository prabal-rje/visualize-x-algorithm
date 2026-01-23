import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter4Scene from './Chapter4Scene';

describe('Chapter4Scene', () => {
  it('renders scoring chapter with history panel on step 0', () => {
    render(<Chapter4Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-4-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 4/)).toBeInTheDocument();
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
    expect(screen.getByText(/Your Recent Activity/)).toBeInTheDocument();
  });

  it('renders odds panel on step 1', () => {
    render(<Chapter4Scene currentStep={1} isActive={true} />);
    expect(screen.getByTestId('odds-panel')).toBeInTheDocument();
    expect(screen.getByText(/Predicted Engagement/)).toBeInTheDocument();
  });

  it('renders score panel on step 2', () => {
    render(<Chapter4Scene currentStep={2} isActive={true} />);
    expect(screen.getByTestId('score-panel')).toBeInTheDocument();
    expect(screen.getByText('4C: Final Score')).toBeInTheDocument();
    expect(screen.getByText(/Where You Rank/)).toBeInTheDocument();
  });

  it('shows step labels correctly', () => {
    const { rerender } = render(<Chapter4Scene currentStep={0} isActive={true} />);
    expect(screen.getByText('4A: Your History')).toBeInTheDocument();

    rerender(<Chapter4Scene currentStep={1} isActive={true} />);
    expect(screen.getByText('4B: Engagement Odds')).toBeInTheDocument();

    rerender(<Chapter4Scene currentStep={2} isActive={true} />);
    expect(screen.getByText('4C: Final Score')).toBeInTheDocument();
  });
});
