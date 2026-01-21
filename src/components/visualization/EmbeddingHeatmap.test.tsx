import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmbeddingHeatmap from './EmbeddingHeatmap';

describe('EmbeddingHeatmap', () => {
  // Generate 128 values for a 16x8 grid (matching X's Phoenix model)
  const mockEmbedding = Array.from({ length: 128 }, (_, i) =>
    Math.sin(i * 0.1) * 0.5 // Values between -0.5 and 0.5
  );

  it('renders with testid', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} />);
    expect(screen.getByTestId('embedding-heatmap')).toBeInTheDocument();
  });

  it('renders a 16x8 grid', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} />);
    const grid = screen.getByTestId('embedding-heatmap-grid');
    expect(grid).toBeInTheDocument();
    // Should have 128 cells
    const cells = screen.getAllByTestId('heatmap-cell');
    expect(cells).toHaveLength(128);
  });

  it('matches cell glow color to background', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} />);
    const cells = screen.getAllByTestId('heatmap-cell');
    cells.forEach((cell) => {
      expect(cell.style.backgroundColor).not.toBe('');
      expect(cell.style.color).toBe(cell.style.backgroundColor);
    });
  });

  it('renders header with label', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} label="USER EMBEDDING" />);
    expect(screen.getByText(/USER EMBEDDING/)).toBeInTheDocument();
  });

  it('shows dimension count', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} />);
    expect(screen.getByText(/128-dim/)).toBeInTheDocument();
  });

  it('applies isActive state', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} isActive={true} />);
    const element = screen.getByTestId('embedding-heatmap');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('defaults isActive to true', () => {
    render(<EmbeddingHeatmap embedding={mockEmbedding} />);
    const element = screen.getByTestId('embedding-heatmap');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('handles partial embeddings gracefully', () => {
    const partialEmbedding = Array.from({ length: 100 }, () => 0.5);
    render(<EmbeddingHeatmap embedding={partialEmbedding} />);
    // Should still render 128 cells, missing ones are 0
    const cells = screen.getAllByTestId('heatmap-cell');
    expect(cells).toHaveLength(128);
  });

  it('clamps values to valid range', () => {
    // Some values outside -1 to 1 range
    const outOfRangeEmbedding = Array.from({ length: 128 }, (_, i) =>
      i % 2 === 0 ? 2.5 : -2.5
    );
    render(<EmbeddingHeatmap embedding={outOfRangeEmbedding} />);
    // Should render without errors
    expect(screen.getByTestId('embedding-heatmap')).toBeInTheDocument();
  });
});
