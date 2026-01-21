import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TopKSelector from './TopKSelector';

describe('TopKSelector', () => {
  it('shows selected top-K entries', () => {
    render(
      <TopKSelector
        candidates={[
          { id: 'a', label: 'Tweet A', score: 0.9 },
          { id: 'b', label: 'Tweet B', score: 0.4 }
        ]}
        topK={1}
        isActive={false}
      />
    );
    expect(screen.getByText(/TOP 1 SELECTION/i)).toBeInTheDocument();
    expect(screen.getByText(/Tweet A/)).toBeInTheDocument();
  });
});
