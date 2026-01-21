import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnimationTimer } from './useAnimationTimer';

describe('useAnimationTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in paused state', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useAnimationTimer({ onTick, interval: 1000 }));

    expect(result.current.isPlaying).toBe(false);
    expect(onTick).not.toHaveBeenCalled();
  });

  it('calls onTick at specified interval when playing', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useAnimationTimer({ onTick, interval: 1000 }));

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(onTick).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledTimes(2);
  });

  it('stops calling onTick when paused', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useAnimationTimer({ onTick, interval: 500 }));

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onTick).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledTimes(1);
  });

  it('toggle switches between play and pause', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useAnimationTimer({ onTick, interval: 1000 }));

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('cleans up interval on unmount', () => {
    const onTick = vi.fn();
    const { result, unmount } = renderHook(() => useAnimationTimer({ onTick, interval: 1000 }));

    act(() => {
      result.current.play();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onTick).not.toHaveBeenCalled();
  });

  it('can start in playing state with autoStart', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useAnimationTimer({ onTick, interval: 1000, autoStart: true })
    );

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledTimes(1);
  });

  it('respects speed multiplier', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useAnimationTimer({ onTick, interval: 1000, speed: 2 })
    );

    act(() => {
      result.current.play();
    });

    // At 2x speed, interval should be 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onTick).toHaveBeenCalledTimes(1);
  });

  it('allows setting speed dynamically', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useAnimationTimer({ onTick, interval: 1000 }));

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onTick).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setSpeed(2);
    });

    // Now at 2x speed, interval should be 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
