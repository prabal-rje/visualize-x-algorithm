import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TypewriterText from './TypewriterText';

describe('TypewriterText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders empty initially when not started', () => {
    render(<TypewriterText text="Hello" started={false} />);
    const element = screen.getByTestId('typewriter-text');
    expect(element.textContent).toBe('');
  });

  it('types out text character by character when started', () => {
    render(<TypewriterText text="ABC" started={true} speed={100} />);
    const element = screen.getByTestId('typewriter-text');

    expect(element.textContent).toBe('');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(element.textContent).toBe('A');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(element.textContent).toBe('AB');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(element.textContent).toBe('ABC');
  });

  it('shows cursor while typing', () => {
    render(<TypewriterText text="Hello" started={true} showCursor={true} />);
    const cursor = screen.getByTestId('typewriter-cursor');
    expect(cursor).toBeInTheDocument();
  });

  it('hides cursor when complete and hideCursorOnComplete is true', () => {
    render(
      <TypewriterText
        text="Hi"
        started={true}
        speed={50}
        showCursor={true}
        hideCursorOnComplete={true}
      />
    );

    // Type first char at 50ms, second at 100ms, complete detected at 150ms
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.queryByTestId('typewriter-cursor')).not.toBeInTheDocument();
  });

  it('calls onComplete when finished typing', () => {
    const onComplete = vi.fn();
    render(
      <TypewriterText text="AB" started={true} speed={50} onComplete={onComplete} />
    );

    expect(onComplete).not.toHaveBeenCalled();

    // Type first char at 50ms, second at 100ms, complete detected at 150ms
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<TypewriterText text="Test" started={false} className="custom-class" />);
    const element = screen.getByTestId('typewriter-text');
    expect(element.className).toContain('custom-class');
  });

  it('shows full text immediately when instant prop is true', () => {
    render(<TypewriterText text="Instant text" started={true} instant={true} />);
    const element = screen.getByTestId('typewriter-text');
    expect(element.textContent).toBe('Instant text');
  });

  it('uses default speed of 50ms', () => {
    render(<TypewriterText text="AB" started={true} />);
    const element = screen.getByTestId('typewriter-text');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('A');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('AB');
  });
});
