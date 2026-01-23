import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TopKSelector from './TopKSelector';

describe('TopKSelector', () => {
  it('shows top-K selection header', () => {
    render(
      <TopKSelector
        candidates={[
          { id: 'a', label: 'Candidate A', score: 0.9 },
          { id: 'b', label: 'Candidate B', score: 0.4 }
        ]}
        topK={1}
        isActive={false}
      />
    );
    expect(screen.getByText(/TOP 1 SELECTION/i)).toBeInTheDocument();
    expect(screen.getByText('Candidate A')).toBeInTheDocument();
  });

  it('flags the user tweet row', () => {
    render(
      <TopKSelector
        candidates={[
          { id: 'you', label: 'Your Tweet', score: 0.88, isUser: true },
          { id: 'b', label: 'Candidate B', score: 0.4 }
        ]}
        topK={1}
        isActive={false}
      />
    );
    expect(screen.getByTestId('topk-selector')).toBeInTheDocument();
    expect(screen.getByText('Your Tweet')).toBeInTheDocument();
  });

  it('shows VISIBILITY FILTER section', () => {
    render(
      <TopKSelector
        candidates={[
          { id: 'you', label: 'Your Tweet', score: 0.5, isUser: true },
          { id: 'b', label: 'Candidate B', score: 0.4 }
        ]}
        topK={2}
        minScore={0.4}
        isActive={false}
      />
    );
    expect(screen.getByText('VISIBILITY FILTER')).toBeInTheDocument();
  });
});
