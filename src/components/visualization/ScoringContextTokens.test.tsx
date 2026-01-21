import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ScoringContextTokens from './ScoringContextTokens';

describe('ScoringContextTokens', () => {
  it('renders icons for core engagement actions', () => {
    render(
      <ScoringContextTokens
        tokens={[
          { id: 't1', action: 'liked', text: 'AI demo', weight: 0.2 },
          { id: 't2', action: 'replied', text: 'Thread follow-up', weight: 0.3 },
          { id: 't3', action: 'reposted', text: 'Launch recap', weight: 0.1 }
        ]}
        isActive={true}
      />
    );

    expect(screen.getByTestId('action-icon-liked')).toBeInTheDocument();
    expect(screen.getByTestId('action-icon-replied')).toBeInTheDocument();
    expect(screen.getByTestId('action-icon-reposted')).toBeInTheDocument();
  });
});
