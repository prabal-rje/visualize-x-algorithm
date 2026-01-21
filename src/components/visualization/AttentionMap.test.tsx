import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AttentionMap from './AttentionMap';

describe('AttentionMap', () => {
  it('highlights a row on hover', () => {
    render(
      <AttentionMap
        items={[
          { id: 'alpha', label: 'Alpha', weight: 0.12 },
          { id: 'beta', label: 'Beta', weight: 0.42 }
        ]}
      />
    );

    const row = screen.getByTestId('attention-row-beta');
    fireEvent.mouseEnter(row);
    expect(row).toHaveAttribute('data-active', 'true');
  });

  it('shows detail panel for the hovered row', () => {
    render(
      <AttentionMap
        sourceTweet="User tweet text"
        items={[
          {
            id: 'alpha',
            label: 'AI demo',
            weight: 0.12,
            action: 'liked',
            tokens: ['AI', 'demo']
          },
          {
            id: 'beta',
            label: 'Launch post',
            weight: 0.42,
            action: 'reposted',
            tokens: ['Launch', 'post']
          }
        ]}
      />
    );

    const row = screen.getByTestId('attention-row-beta');
    fireEvent.mouseEnter(row);
    expect(screen.getByTestId('attention-detail')).toBeInTheDocument();
    expect(screen.getByText(/User tweet text/)).toBeInTheDocument();
    expect(screen.getByText(/Launch post/)).toBeInTheDocument();
    expect(screen.getByText(/reposted/i)).toBeInTheDocument();
  });
});
