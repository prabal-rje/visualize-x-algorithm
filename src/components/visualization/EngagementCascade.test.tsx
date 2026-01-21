import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EngagementCascade from './EngagementCascade';

describe('EngagementCascade', () => {
  it('renders predicted and actual stats', () => {
    render(
      <EngagementCascade
        stats={[
          { id: 'like', label: 'Likes', predicted: 120, actual: 98 }
        ]}
        isActive={false}
      />
    );
    expect(screen.getByTestId('engagement-cascade')).toBeInTheDocument();
    expect(screen.getByText(/Likes/)).toBeInTheDocument();
    expect(screen.getByText(/Pred 120/)).toBeInTheDocument();
    expect(screen.getByText(/Actual 98/)).toBeInTheDocument();
  });
});
