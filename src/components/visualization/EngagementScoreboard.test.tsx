import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EngagementScoreboard from './EngagementScoreboard';

describe('EngagementScoreboard', () => {
  it('renders engagement rows and final score', () => {
    render(
      <EngagementScoreboard
        actions={[{ id: 'like', label: 'Like', probability: 0.4, weight: 1, group: 'positive' }]}
        finalScore={0.4}
        diversityPenalty={0.05}
        rankings={[{ id: 'a', label: 'Candidate A', score: 0.5 }]}
        isActive={false}
      />
    );
    expect(screen.getByText(/Like/)).toBeInTheDocument();
    expect(screen.getByText(/Final Score/)).toBeInTheDocument();
  });
});
