import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VectorSpace from './VectorSpace';

describe('VectorSpace', () => {
  const mockUserPoint = { x: 50, y: 50, label: 'USER' };
  const mockCandidates = [
    { x: 70, y: 30, label: 'Tweet 1', similarity: 0.85, text: 'Alpha tweet' },
    { x: 20, y: 60, label: 'Tweet 2', similarity: 0.45, text: 'Beta tweet' },
    { x: 80, y: 80, label: 'Tweet 3', similarity: 0.92, text: 'Gamma tweet' },
    { x: 30, y: 20, label: 'Tweet 4', similarity: 0.23, text: 'Delta tweet' }
  ];

  it('renders with testid', () => {
    render(
      <VectorSpace userPoint={mockUserPoint} candidates={mockCandidates} />
    );
    expect(screen.getByTestId('vector-space')).toBeInTheDocument();
  });

  it('renders user point', () => {
    render(
      <VectorSpace userPoint={mockUserPoint} candidates={mockCandidates} />
    );
    expect(screen.getByTestId('vector-space-user')).toBeInTheDocument();
  });

  it('renders candidate points', () => {
    render(
      <VectorSpace userPoint={mockUserPoint} candidates={mockCandidates} />
    );
    const candidates = screen.getAllByTestId('vector-space-candidate');
    expect(candidates).toHaveLength(4);
  });

  it('displays user label', () => {
    render(
      <VectorSpace userPoint={mockUserPoint} candidates={mockCandidates} />
    );
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('displays similarity scores on candidates', () => {
    render(
      <VectorSpace
        userPoint={mockUserPoint}
        candidates={mockCandidates}
        showSimilarity={true}
      />
    );
    expect(screen.getByText(/0.85/)).toBeInTheDocument();
    expect(screen.getByText(/0.92/)).toBeInTheDocument();
  });

  it('applies isActive state', () => {
    render(
      <VectorSpace
        userPoint={mockUserPoint}
        candidates={mockCandidates}
        isActive={true}
      />
    );
    const element = screen.getByTestId('vector-space');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('renders header with label', () => {
    render(
      <VectorSpace
        userPoint={mockUserPoint}
        candidates={mockCandidates}
        label="EMBEDDING SPACE"
      />
    );
    expect(screen.getByText(/EMBEDDING SPACE/)).toBeInTheDocument();
  });

  it('handles empty candidates', () => {
    render(<VectorSpace userPoint={mockUserPoint} candidates={[]} />);
    expect(screen.getByTestId('vector-space-user')).toBeInTheDocument();
    expect(screen.queryAllByTestId('vector-space-candidate')).toHaveLength(0);
  });

  it('shows hovered tweet details', () => {
    render(
      <VectorSpace userPoint={mockUserPoint} candidates={mockCandidates} />
    );
    const candidate = screen.getAllByTestId('vector-space-candidate')[0];
    fireEvent.mouseEnter(candidate);
    expect(screen.getByTestId('vector-space-hover')).toBeInTheDocument();
    expect(screen.getByText(/Alpha tweet/)).toBeInTheDocument();
  });
});
