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
});
