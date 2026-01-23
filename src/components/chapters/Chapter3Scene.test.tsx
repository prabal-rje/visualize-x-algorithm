import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter3Scene from './Chapter3Scene';

describe('Chapter3Scene', () => {
  it('renders filtering chapter with funnel visualization', () => {
    render(<Chapter3Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-3-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 3/)).toBeInTheDocument();
    expect(screen.getByTestId('funnel-viz')).toBeInTheDocument();
  });

  it('renders quality gates label for step 0', () => {
    render(<Chapter3Scene currentStep={0} isActive={true} />);
    expect(screen.getByText(/3A: Quality Gates/i)).toBeInTheDocument();
  });

  it('renders freshness gates label for step 1', () => {
    render(<Chapter3Scene currentStep={1} isActive={true} />);
    expect(screen.getByText(/3B: Freshness Gates/i)).toBeInTheDocument();
  });

  it('shows candidate count in funnel', () => {
    render(<Chapter3Scene currentStep={0} isActive={true} />);
    // May appear in multiple places (start count, running totals)
    expect(screen.getAllByText('2,847').length).toBeGreaterThanOrEqual(1);
  });
});
