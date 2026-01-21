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
});
