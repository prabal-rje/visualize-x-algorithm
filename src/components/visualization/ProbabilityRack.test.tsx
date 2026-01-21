import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProbabilityRack from './ProbabilityRack';

describe('ProbabilityRack', () => {
  it('renders probabilities as percentages', () => {
    render(
      <ProbabilityRack
        items={[{ id: 'like', label: 'Like', probability: 0.235 }]}
      />
    );

    expect(screen.getByTestId('probability-rack')).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.getByText('23.5%')).toBeInTheDocument();
  });

  it('shows weighted sum of probabilities', () => {
    render(
      <ProbabilityRack
        items={[
          { id: 'like', label: 'Like', probability: 0.2, weight: 1.0 },
          { id: 'repost', label: 'Repost', probability: 0.1, weight: 2.0 }
        ]}
      />
    );

    expect(screen.getByTestId('probability-weighted-sum')).toHaveTextContent('0.40');
  });
});
