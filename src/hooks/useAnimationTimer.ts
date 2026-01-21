import { useCallback, useEffect, useRef, useState } from 'react';

export type UseAnimationTimerOptions = {
  /** Callback to invoke on each tick */
  onTick: () => void;
  /** Base interval in milliseconds */
  interval: number;
  /** Whether to start playing immediately */
  autoStart?: boolean;
  /** Speed multiplier (1 = normal, 2 = 2x speed) */
  speed?: number;
};

export type UseAnimationTimerReturn = {
  /** Whether the timer is currently playing */
  isPlaying: boolean;
  /** Current speed multiplier */
  speed: number;
  /** Start the timer */
  play: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Toggle between play and pause */
  toggle: () => void;
  /** Set speed multiplier */
  setSpeed: (speed: number) => void;
};

export function useAnimationTimer({
  onTick,
  interval,
  autoStart = false,
  speed: initialSpeed = 1
}: UseAnimationTimerOptions): UseAnimationTimerReturn {
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);

  // Keep onTick ref updated
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Clear existing interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start/restart the interval when playing or speed changes
  useEffect(() => {
    clearTimer();

    if (isPlaying) {
      const effectiveInterval = interval / speed;
      intervalRef.current = setInterval(() => {
        onTickRef.current();
      }, effectiveInterval);
    }

    return clearTimer;
  }, [isPlaying, speed, interval, clearTimer]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(Math.max(0.1, newSpeed));
  }, []);

  return {
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    setSpeed: updateSpeed
  };
}
