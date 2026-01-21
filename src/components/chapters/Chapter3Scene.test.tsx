import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter3Scene from './Chapter3Scene';

describe('Chapter3Scene', () => {
  it('renders filtering chapter with gates', () => {
    render(<Chapter3Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-3-scene')).toBeInTheDocument();
    expect(screen.getByText(/CHAPTER 3/)).toBeInTheDocument();
    expect(screen.getAllByTestId('filter-gate').length).toBeGreaterThan(0);
  });

  it('renders 4th step label for content filters', () => {
    render(<Chapter3Scene currentStep={3} isActive={true} />);
    expect(screen.getByText(/3D: Content Filters/i)).toBeInTheDocument();
  });
});
