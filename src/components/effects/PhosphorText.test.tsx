import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PhosphorText from './PhosphorText';

describe('PhosphorText', () => {
  it('shows a fading trail when text changes', () => {
    vi.useFakeTimers();
    const { rerender } = render(<PhosphorText>Alpha</PhosphorText>);

    rerender(<PhosphorText>Beta</PhosphorText>);

    expect(screen.getByTestId('phosphor-trail')).toHaveTextContent('Alpha');

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.queryByTestId('phosphor-trail')).toBeNull();
    vi.useRealTimers();
  });
});
