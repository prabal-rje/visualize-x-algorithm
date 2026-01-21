import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FilterGate from './FilterGate';

describe('FilterGate', () => {
  it('renders label, function, and counts', () => {
    render(
      <FilterGate
        label="DEDUP"
        functionName="DropDuplicatesFilter::filter()"
        totalIn={100}
        totalPass={92}
        totalFail={8}
        tweets={[{ id: 't1', text: 'Duplicate content', status: 'fail' }]}
        highlightTweet="My tweet"
        isActive={false}
      />
    );
    expect(screen.getByTestId('filter-gate')).toBeInTheDocument();
    expect(screen.getByText(/DEDUP/)).toBeInTheDocument();
    expect(screen.getByText(/DropDuplicatesFilter/)).toBeInTheDocument();
    expect(screen.getByTestId('filter-count-pass')).toHaveTextContent('92');
    expect(screen.getByTestId('filter-count-fail')).toHaveTextContent('8');
    expect(screen.getByTestId('filter-highlight-tweet')).toHaveTextContent(/My tweet/);
  });
});
