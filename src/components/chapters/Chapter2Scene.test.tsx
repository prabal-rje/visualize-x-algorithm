import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setEmbedderForTests } from '../../ml/embeddings';
import { useConfigStore } from '../../stores/config';
import Chapter2Scene from './Chapter2Scene';

describe('Chapter2Scene', () => {
  const defaultProps = {
    currentStep: 0,
    isActive: true
  };

  // Mock embedder that returns predictable 128-dim vectors
  const mockEmbedder = async () => ({
    data: new Float32Array(128).fill(0.1)
  });

  beforeEach(() => {
    // Set up mock embedder
    setEmbedderForTests(mockEmbedder);
    // Set up config store with a sample tweet
    useConfigStore.setState({ tweetText: 'Test tweet about AI and technology' });
  });

  afterEach(() => {
    // Clear mock embedder
    setEmbedderForTests(null);
  });

  it('renders with testid', () => {
    render(<Chapter2Scene {...defaultProps} />);
    expect(screen.getByTestId('chapter-2-scene')).toBeInTheDocument();
  });

  it('shows chapter title', () => {
    render(<Chapter2Scene {...defaultProps} />);
    expect(screen.getByText(/THE GATHERING/)).toBeInTheDocument();
  });

  it('shows embedding heatmap at step 0 after loading', async () => {
    render(<Chapter2Scene {...defaultProps} currentStep={0} />);
    await waitFor(() => {
      expect(screen.getByTestId('embedding-heatmap')).toBeInTheDocument();
    });
  });

  it('labels embedding as tweet embedding', async () => {
    render(<Chapter2Scene {...defaultProps} currentStep={0} />);
    await waitFor(() => {
      expect(screen.getByText(/TWEET EMBEDDING/)).toBeInTheDocument();
    });
  });

  it('shows vector space at step 1 after loading', async () => {
    render(<Chapter2Scene {...defaultProps} currentStep={1} />);
    await waitFor(() => {
      expect(screen.getByTestId('vector-space')).toBeInTheDocument();
    });
  });

  it('shows candidate streams at step 2 (merging)', () => {
    render(<Chapter2Scene {...defaultProps} currentStep={2} />);
    expect(screen.getByTestId('candidate-streams')).toBeInTheDocument();
  });

  it('shows Thunder stream label at step 2', () => {
    render(<Chapter2Scene {...defaultProps} currentStep={2} />);
    expect(screen.getByText(/THUNDER/)).toBeInTheDocument();
  });

  it('shows Phoenix stream label at step 2', () => {
    render(<Chapter2Scene {...defaultProps} currentStep={2} />);
    expect(screen.getByText(/PHOENIX/)).toBeInTheDocument();
  });

  it('applies isActive state', () => {
    render(<Chapter2Scene {...defaultProps} isActive={true} />);
    const element = screen.getByTestId('chapter-2-scene');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('applies inactive state', () => {
    render(<Chapter2Scene {...defaultProps} isActive={false} />);
    const element = screen.getByTestId('chapter-2-scene');
    expect(element).toHaveAttribute('data-active', 'false');
  });
});
